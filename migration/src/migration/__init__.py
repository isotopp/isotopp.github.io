from __future__ import annotations

import argparse
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


FRONT_MATTER_DELIMS = ("---", "+++")


@dataclass
class PostParts:
    front_matter: str
    body: str
    fm_delim: str | None


@dataclass
class ResourceRef:
    original: str
    rel_path: str


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


def extract_date(front_matter: str, filename: str) -> tuple[str, str, str] | None:
    date_match = re.search(r"\b(\d{4})-(\d{2})-(\d{2})\b", front_matter)
    if date_match:
        return date_match.group(1), date_match.group(2), date_match.group(3)
    name_match = re.match(r"(\d{4})-(\d{2})-(\d{2})-", filename)
    if name_match:
        return name_match.group(1), name_match.group(2), name_match.group(3)
    return None


def extract_slug(front_matter: str, filename: str) -> str:
    slug_match = re.search(r'^\s*slug\s*[:=]\s*["\']?([^"\n\']+)["\']?\s*$',
                           front_matter, re.MULTILINE)
    if slug_match:
        return slug_match.group(1).strip().strip("/")
    url_match = re.search(r'^\s*url\s*[:=]\s*["\']?([^"\n\']+)["\']?\s*$',
                          front_matter, re.MULTILINE)
    if url_match:
        url = url_match.group(1).strip().strip("/")
        if url.endswith(".html"):
            url = url[:-5]
        return url.split("/")[-1]
    name_match = re.match(r"\d{4}-\d{2}-\d{2}-(.+)", filename)
    if name_match:
        return name_match.group(1)
    return Path(filename).stem


def ensure_alias(front_matter: str, fm_delim: str | None, alias: str) -> str:
    if not fm_delim:
        return front_matter
    if fm_delim == "---":
        if re.search(r"^\s*aliases\s*:", front_matter, re.MULTILINE):
            if alias in front_matter:
                return front_matter
            lines = front_matter.splitlines()
            out: list[str] = []
            inserted = False
            i = 0
            while i < len(lines):
                line = lines[i]
                out.append(line)
                if re.match(r"^\s*aliases\s*:", line):
                    inserted = True
                    if i + 1 < len(lines) and re.match(r"^\s*-\s+", lines[i + 1]):
                        out.append(f"  - {alias}")
                    else:
                        out.append(f"  - {alias}")
                i += 1
            if inserted:
                return "\n".join(out)
        return f"{front_matter}\naliases:\n  - {alias}".lstrip("\n")
    if fm_delim == "+++":
        if re.search(r"^\s*aliases\s*=", front_matter, re.MULTILINE):
            if alias in front_matter:
                return front_matter
            return re.sub(
                r"^\s*aliases\s*=\s*\[(.*?)\]\s*$",
                lambda m: f'aliases = [{m.group(1).rstrip()},"{alias}"]',
                front_matter,
                flags=re.MULTILINE,
            )
        return f'{front_matter}\naliases = ["{alias}"]'.lstrip("\n")
    return front_matter


def normalize_upload_path(url: str, base_url: str) -> tuple[str, str] | None:
    cleaned = url.split("#", 1)[0].split("?", 1)[0]
    for prefix in (
        f"{base_url.rstrip('/')}/uploads/",
        "/uploads/",
        "uploads/",
        "/static/uploads/",
        "static/uploads/",
    ):
        if cleaned.startswith(prefix):
            rel = cleaned[len(prefix):]
            return cleaned, rel
    return None


def update_content_and_collect(
    body: str, base_url: str
) -> tuple[str, list[ResourceRef]]:
    refs: list[ResourceRef] = []

    patterns = [
        (re.compile(r"(!\[[^\]]*\]\()([^)]+)(\))"), 1, 2, 3),
        (re.compile(r"(\[[^\]]*\]\()([^)]+)(\))"), 1, 2, 3),
        (re.compile(r'((?:src|href)\s*=\s*["\'])([^"\']+)(["\'])'), 1, 2, 3),
    ]

    def replace(match: re.Match, url_group: int, prefix_group: int, suffix_group: int) -> str:
        prefix = match.group(prefix_group)
        url = match.group(url_group)
        suffix = match.group(suffix_group)
        normalized = normalize_upload_path(url, base_url)
        if normalized is None:
            return match.group(0)
        original, rel = normalized
        refs.append(ResourceRef(original=original, rel_path=rel))
        return f"{prefix}{rel}{suffix}"

    updated = body
    for pattern, prefix_idx, url_idx, suffix_idx in patterns:
        updated = pattern.sub(lambda m: replace(m, url_idx, prefix_idx, suffix_idx), updated)

    return updated, refs


def iter_markdown_files(source_dir: Path) -> Iterable[Path]:
    for path in source_dir.rglob("*.md"):
        if path.name.startswith("_"):
            continue
        yield path


def migrate_post(
    path: Path,
    dest_root: Path,
    uploads_root: Path,
    base_url: str,
    apply_changes: bool,
    move_assets: bool,
) -> tuple[list[Path], list[Path]]:
    text = path.read_text(encoding="utf-8")
    parts = split_front_matter(text)

    date_parts = extract_date(parts.front_matter, path.stem)
    slug = extract_slug(parts.front_matter, path.name)
    alias = None
    if date_parts and slug:
        alias = f"/{date_parts[0]}/{date_parts[1]}/{date_parts[2]}/{slug}.html"

    updated_body, refs = update_content_and_collect(parts.body, base_url)

    updated_front = parts.front_matter
    if alias:
        updated_front = ensure_alias(parts.front_matter, parts.fm_delim, alias)

    bundle_dir = dest_root / path.stem
    bundle_dir_index = bundle_dir / "index.md"

    missing: list[Path] = []
    moved: list[Path] = []

    if apply_changes:
        bundle_dir.mkdir(parents=True, exist_ok=True)
        if parts.fm_delim:
            updated_text = (
                f"{parts.fm_delim}\n{updated_front.strip()}\n{parts.fm_delim}\n{updated_body}"
            )
        else:
            updated_text = updated_body
        bundle_dir_index.write_text(updated_text, encoding="utf-8")

    for ref in refs:
        src = uploads_root / ref.rel_path
        dest = bundle_dir / ref.rel_path
        if not src.exists():
            missing.append(src)
            continue
        moved.append(dest)
        if apply_changes:
            dest.parent.mkdir(parents=True, exist_ok=True)
            if move_assets:
                shutil.move(src, dest)
            else:
                shutil.copy2(src, dest)

    return moved, missing


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Migrate Hugo posts into leaf bundles and move /uploads assets into bundles."
        )
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("content/posts"),
        help="Directory containing source markdown posts.",
    )
    parser.add_argument(
        "--uploads",
        type=Path,
        default=Path("static/uploads"),
        help="Directory containing uploaded assets.",
    )
    parser.add_argument(
        "--dest",
        type=Path,
        default=Path("content/posts-bundles"),
        help="Directory to write the migrated page bundles.",
    )
    parser.add_argument(
        "--base-url",
        default="https://blog.koehntopp.info",
        help="Base URL used to normalize absolute upload links.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write changes to disk. Omit for a dry run.",
    )
    parser.add_argument(
        "--move",
        action="store_true",
        help="Move assets out of uploads instead of copying them.",
    )

    args = parser.parse_args()

    if not args.source.exists():
        raise SystemExit(f"Source directory not found: {args.source}")
    if not args.uploads.exists():
        raise SystemExit(f"Uploads directory not found: {args.uploads}")

    moved_total = 0
    missing_total = 0

    for post_path in iter_markdown_files(args.source):
        moved, missing = migrate_post(
            post_path,
            args.dest,
            args.uploads,
            args.base_url,
            args.apply,
            args.move,
        )
        moved_total += len(moved)
        missing_total += len(missing)
        if missing:
            print(f"Missing assets for {post_path}:")
            for item in missing:
                print(f"  - {item}")

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: migrated posts from {args.source} to {args.dest}")
    print(f"Assets copied: {moved_total}, missing: {missing_total}")
