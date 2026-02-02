from __future__ import annotations

import argparse
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


FRONT_MATTER_DELIMS = ("---", "+++")
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}


@dataclass
class PostParts:
    front_matter: str
    body: str
    fm_delim: str | None


@dataclass
class ImageFixResult:
    updated_body: str
    copied: int
    moved: int
    missing: list[Path]


def split_front_matter(text: str) -> PostParts:
    stripped = text.lstrip()
    for delim in FRONT_MATTER_DELIMS:
        prefix = f"{delim}\n"
        if stripped.startswith(prefix):
            start = text.find(prefix)
            end = text.find(f"\n{delim}\n", start + len(prefix))
            if end == -1:
                return PostParts(front_matter="", body=text, fm_delim=None)
            fm = text[start + len(prefix) : end]
            body = text[end + len(f"\n{delim}\n") :]
            return PostParts(front_matter=fm, body=body, fm_delim=delim)
    return PostParts(front_matter="", body=text, fm_delim=None)


def iter_post_indexes(root: Path) -> Iterable[Path]:
    for path in root.glob("*/index.md"):
        yield path


def dedupe_tags(front_matter: str) -> str:
    lines = front_matter.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if re.match(r"^\s*tags\s*:\s*$", line):
            out.append(line)
            i += 1
            items: list[str] = []
            indent = "  "
            while i < len(lines):
                match = re.match(r"^(\s*)-\s+(.*)$", lines[i])
                if not match:
                    break
                indent = match.group(1) or indent
                items.append(match.group(2).strip())
                i += 1
            seen: set[str] = set()
            for item in items:
                if item in seen:
                    continue
                seen.add(item)
                out.append(f"{indent}- {item}")
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def parse_markdown_image(inner: str) -> tuple[str, str]:
    value = inner.strip()
    if value.startswith("<") and value.endswith(">"):
        return value[1:-1], ""
    if " " not in value and "\t" not in value:
        return value, ""
    parts = value.split(None, 1)
    return parts[0], parts[1] if len(parts) > 1 else ""


def is_remote_url(url: str) -> bool:
    lowered = url.lower()
    return (
        lowered.startswith("http://")
        or lowered.startswith("https://")
        or lowered.startswith("mailto:")
        or lowered.startswith("data:")
        or lowered.startswith("#")
        or lowered.startswith("/")
    )


def find_image_by_name(content_root: Path, name: str) -> list[Path]:
    matches: list[Path] = []
    for candidate in content_root.rglob(name):
        if candidate.is_file() and candidate.suffix.lower() in IMAGE_EXTS:
            matches.append(candidate)
    return sorted(matches)


def fix_images_in_body(
    body: str,
    post_dir: Path,
    content_root: Path,
    apply_changes: bool,
) -> ImageFixResult:
    missing: list[Path] = []
    copied = 0
    moved = 0

    year_month_pattern = re.compile(r"^\d{4}/\d{2}/[^/]+$")

    def replace(match: re.Match) -> str:
        nonlocal copied, moved
        inner = match.group(2)
        url, title = parse_markdown_image(inner)
        if is_remote_url(url):
            return match.group(0)

        rel_path = Path(url)
        target_path = post_dir / rel_path
        if not target_path.exists():
            candidates = find_image_by_name(content_root, rel_path.name)
            if candidates:
                source = candidates[0]
                if apply_changes:
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source, target_path)
                copied += 1
            else:
                missing.append(target_path)

        new_url = url
        if year_month_pattern.match(url):
            dest = post_dir / rel_path.name
            if target_path.exists() and not dest.exists():
                if apply_changes:
                    shutil.move(target_path, dest)
                new_url = rel_path.name
                moved += 1

        if new_url == url:
            return match.group(0)
        rebuilt = f"{new_url} {title}".rstrip()
        return f"![{match.group(2)}]({rebuilt})"

    pattern = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
    updated = pattern.sub(replace, body)

    return ImageFixResult(
        updated_body=updated,
        copied=copied,
        moved=moved,
        missing=missing,
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fix image references and dedupe tags in Hugo post bundles."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path("content/posts"),
        help="Directory containing post bundles (each with index.md).",
    )
    parser.add_argument(
        "--content",
        type=Path,
        default=Path("content"),
        help="Content root to search for missing images by name.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write changes to disk. Omit for a dry run.",
    )

    args = parser.parse_args()
    if not args.root.exists():
        raise SystemExit(f"Posts root not found: {args.root}")
    if not args.content.exists():
        raise SystemExit(f"Content root not found: {args.content}")

    total_copied = 0
    total_moved = 0
    total_missing = 0

    for index_path in iter_post_indexes(args.root):
        text = index_path.read_text(encoding="utf-8")
        parts = split_front_matter(text)

        updated_front = dedupe_tags(parts.front_matter) if parts.fm_delim else parts.front_matter
        image_result = fix_images_in_body(
            parts.body,
            index_path.parent,
            args.content,
            args.apply,
        )

        if args.apply:
            if parts.fm_delim:
                updated_text = (
                    f"{parts.fm_delim}\n{updated_front.strip()}\n"
                    f"{parts.fm_delim}\n{image_result.updated_body}"
                )
            else:
                updated_text = image_result.updated_body
            index_path.write_text(updated_text, encoding="utf-8")

        total_copied += image_result.copied
        total_moved += image_result.moved
        total_missing += len(image_result.missing)

        if image_result.missing:
            print(f"Missing images for {index_path}:")
            for item in image_result.missing:
                print(f"  - {item}")

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: copied {total_copied} images, moved {total_moved}, missing {total_missing}")
