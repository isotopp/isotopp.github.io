#!/usr/bin/env python3
"""Check that the site's Hugo configuration preserves TeX for client-side KaTeX."""

import html
import json
import os
from pathlib import Path
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
FORMULAS = (
    r"\(a_1 + b_2 + \alpha\)",
    "\\[\n" + r"\begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}" + "\n\\]",
    "$$\n" + r"\int_0^1 x^2 \, dx = \frac{1}{3}" + "\n$$",
)


def main():
    with tempfile.TemporaryDirectory(prefix="hugo-math-") as directory:
        temporary = Path(directory)
        content = temporary / "content"
        layouts = temporary / "layouts"
        content.mkdir()
        (layouts / "_default").mkdir(parents=True)
        (layouts / "_default" / "single.html").write_text("{{ .Content }}\n")
        (content / "math-probe.md").write_text(
            '---\ntitle: Math probe\n---\n\n'
            + "\n\n".join(FORMULAS)
            + '\n\nOrdinary **Markdown** and currency: $10 and $20.\n'
            + '\nLiteral delimiters: `\\[x\\]`.\n',
            encoding="utf-8",
        )
        override = temporary / "config.json"
        override.write_text(json.dumps({
            "disableKinds": ["home", "taxonomy", "term", "RSS", "sitemap"],
        }))
        subprocess.run(
            ["hugo", "--source", str(ROOT),
             "--config", f"{ROOT / 'config.yaml'},{override}",
             "--contentDir", str(content), "--layoutDir", str(layouts),
             "--destination", str(temporary / "public"),
             "--cacheDir", str(temporary / "cache"), "--quiet"],
            env={**os.environ, "HUGO_RESOURCEDIR": str(temporary / "resources")},
            check=True,
        )
        rendered = (temporary / "public" / "math-probe" / "index.html").read_text()
        decoded = html.unescape(rendered)
        for formula in FORMULAS:
            assert formula in decoded, f"TeX changed during Markdown rendering: {formula!r}"
        assert "<strong>Markdown</strong>" in rendered
        assert "$10 and $20" in rendered
        assert r"<code>\[x\]</code>" in rendered
        print("PASS: inline/display TeX preserved; Markdown, currency and code unchanged")


if __name__ == "__main__":
    main()
