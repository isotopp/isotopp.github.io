#!/usr/bin/env python3
"""Report per-commit tree size deltas with optional SQLite caching."""

from __future__ import annotations

import argparse
import sqlite3
import subprocess
import sys
from pathlib import Path


def run_git(args: list[str], cwd: Path) -> str:
    proc = subprocess.run(
        ["git", *args],
        cwd=cwd,
        check=True,
        text=True,
        capture_output=True,
    )
    return proc.stdout


def humanize(n: int, signed: bool = False) -> str:
    sign = ""
    value = float(n)
    if signed:
        sign = "+" if n >= 0 else "-"
        value = abs(value)
    units = ["B", "KB", "MB", "GB", "TB", "PB"]
    idx = 0
    while value >= 1024.0 and idx < len(units) - 1:
        value /= 1024.0
        idx += 1
    return f"{sign}{value:.2f} {units[idx]}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Report per-commit total tree size and deltas."
    )
    parser.add_argument(
        "revspec",
        nargs="?",
        default="HEAD",
        help="Revision/range to walk (default: HEAD). Examples: HEAD, main, HEAD~50..HEAD",
    )
    parser.add_argument(
        "--all-parents",
        action="store_true",
        help="Walk full history (default is first-parent only).",
    )
    parser.add_argument(
        "--human",
        action="store_true",
        help="Show human-readable sizes instead of raw bytes.",
    )
    parser.add_argument(
        "--db",
        default=None,
        help="SQLite cache path (default: <repo>/.cache/commit-size-cache.sqlite).",
    )
    parser.add_argument(
        "--refresh",
        action="store_true",
        help="Ignore cached rows and recompute all commits in range.",
    )
    parser.add_argument(
        "--no-cache",
        action="store_true",
        help="Do not read/write cache.",
    )
    return parser.parse_args()


def setup_db(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS commit_sizes (
            repo_root TEXT NOT NULL,
            commit_sha TEXT NOT NULL,
            commit_date TEXT NOT NULL,
            subject TEXT NOT NULL,
            tree_size_bytes INTEGER NOT NULL,
            PRIMARY KEY (repo_root, commit_sha)
        )
        """
    )
    conn.execute(
        """
        CREATE INDEX IF NOT EXISTS idx_commit_sizes_repo_root
        ON commit_sizes(repo_root)
        """
    )


def fetch_cached(
    conn: sqlite3.Connection, repo_root: str, commits: list[str]
) -> dict[str, tuple[str, str, int]]:
    if not commits:
        return {}
    out: dict[str, tuple[str, str, int]] = {}
    chunk = 500
    for i in range(0, len(commits), chunk):
        part = commits[i : i + chunk]
        placeholders = ",".join("?" for _ in part)
        rows = conn.execute(
            f"""
            SELECT commit_sha, commit_date, subject, tree_size_bytes
            FROM commit_sizes
            WHERE repo_root = ? AND commit_sha IN ({placeholders})
            """,
            [repo_root, *part],
        )
        for sha, date, subject, size in rows:
            out[sha] = (date, subject, int(size))
    return out


def tree_size(cwd: Path, commit: str) -> int:
    out = run_git(["ls-tree", "-rl", "--full-tree", commit], cwd=cwd)
    total = 0
    for line in out.splitlines():
        # format: "<mode> <type> <sha> <size>\t<path>"
        parts = line.split(None, 4)
        if len(parts) >= 4:
            try:
                total += int(parts[3])
            except ValueError:
                continue
    return total


def commit_meta(cwd: Path, commit: str) -> tuple[str, str]:
    out = run_git(["log", "-1", "--format=%cs%x00%s", commit], cwd=cwd).rstrip("\n")
    if "\x00" in out:
        date, subject = out.split("\x00", 1)
    else:
        date, subject = "", out
    return date, subject


def main() -> int:
    args = parse_args()
    repo_root = Path(run_git(["rev-parse", "--show-toplevel"], cwd=Path.cwd()).strip())

    rev_list_args = ["rev-list", "--reverse"]
    if not args.all_parents:
        rev_list_args.append("--first-parent")
    rev_list_args.append(args.revspec)

    try:
        commits = [c for c in run_git(rev_list_args, cwd=repo_root).splitlines() if c]
    except subprocess.CalledProcessError as exc:
        sys.stderr.write(exc.stderr or f"Invalid revision spec: {args.revspec}\n")
        return exc.returncode

    if not commits:
        sys.stderr.write("No commits matched the revision spec.\n")
        return 1

    db_path = Path(args.db).expanduser() if args.db else repo_root / ".cache" / "commit-size-cache.sqlite"
    conn: sqlite3.Connection | None = None
    cache: dict[str, tuple[str, str, int]] = {}
    repo_key = str(repo_root.resolve())

    if not args.no_cache:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(db_path)
        setup_db(conn)
        if not args.refresh:
            cache = fetch_cached(conn, repo_key, commits)

    results: list[tuple[str, str, int, str]] = []
    for commit in commits:
        cached = cache.get(commit)
        if cached is not None:
            date, subject, size = cached
        else:
            size = tree_size(repo_root, commit)
            date, subject = commit_meta(repo_root, commit)
            if conn is not None:
                conn.execute(
                    """
                    INSERT OR REPLACE INTO commit_sizes
                    (repo_root, commit_sha, commit_date, subject, tree_size_bytes)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (repo_key, commit, date, subject, size),
                )
        results.append((date, subject, size, commit))

    if conn is not None:
        conn.commit()
        conn.close()

    if args.human:
        print(f"{'DATE':10} {'DELTA':14} {'TOTAL':14} {'COMMIT':12} SUBJECT")
    else:
        print(f"{'DATE':10} {'DELTA(B)':>12} {'TOTAL(B)':>12} {'COMMIT':12} SUBJECT")

    prev = 0
    for date, subject, total, commit in results:
        delta = total - prev
        prev = total
        short = commit[:12]
        if args.human:
            print(f"{date:10} {humanize(delta, signed=True):14} {humanize(total):14} {short:12} {subject}")
        else:
            print(f"{date:10} {delta:+12d} {total:12d} {short:12} {subject}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
