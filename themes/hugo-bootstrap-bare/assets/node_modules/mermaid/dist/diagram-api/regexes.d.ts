export declare const frontMatterRegex: RegExp;
export declare const directiveRegex: RegExp;
export declare const anyCommentRegex: RegExp;
/**
 * Strip `%%` comment runs exactly like `text.replace(anyCommentRegex, '\n')`, in linear time.
 *
 * A scanner rather than a regex, because no variant of this pattern is linear. Every regex form
 * carries a `\s*` that can cross newlines, and `/m` gives the engine a candidate start at each
 * line, so an all-whitespace document has the match attempt rescan the remaining run once per
 * line. Two shapes are quadratic in the released pattern and in the guarded `(^|\S)\s*%%.*\n`
 * that replaced it, both inside the default 50k `maxTextSize`:
 *
 * ```
 *   ('\n' + ' '.repeat(4)).repeat(10_000)   all whitespace, many lines   256ms
 *   '%%' + 'x%%'.repeat(16_000)             no terminating newline       339ms
 * ```
 *
 * against 0.1ms for ordinary diagram text of the same size. The guard cut the constant roughly
 * 40x but left the exponent alone, which is what CodeQL and the CWE-1333 review both caught.
 *
 * The scan walks forward once. For each `%%` it takes the line's terminating newline as the end
 * of the match — `.` never matches a newline, so the regex ends at that same character — and
 * extends left over the preceding whitespace run, never past the previous match. Each character
 * is visited at most twice, so the work is linear in the input and independent of how the
 * whitespace is arranged.
 *
 * A `%%` with no newline after it is left alone, because `%%.*\n` cannot match without one.
 */
export declare const stripAnyComments: (text: string) => string;
export interface FrontMatterMatch {
    /** The horizontal indent of the opening fence — `frontMatterRegex`'s capture group 1. */
    indent: string;
    /** The YAML body between the fences — capture group 2. */
    body: string;
    /** Length of the whole match, so callers can slice the front matter off. */
    length: number;
}
/**
 * Locate a front matter block exactly like `text.match(frontMatterRegex)`, in linear time.
 *
 * A scanner rather than a regex, because `frontMatterRegex` is ambiguous: the opening `\s*[\n\r]`
 * lets `\s*` consume line breaks as well, so every failed search for a closing fence backtracks
 * into it. Each of the O(n) split points then rescans the lazy body, which is quadratic overall —
 * on `'---\n' + ' \n'.repeat(n)`, well inside the default 50k `maxTextSize`:
 *
 * ```
 *   n =  4_000    38ms
 *   n =  8_000   161ms
 *   n = 16_000   619ms
 * ```
 *
 * Removing the ambiguity is not behaviour-preserving, so the scanner reproduces the
 * backtracking result rather than a tidier reading of it. The engine tries the *longest* opening
 * first and shortens it one line break at a time until the rest matches, which is equivalent to:
 *
 * 1. Take the closing fences that could terminate a block — a line break, `indent---`, then at
 *    least one more line break in the following whitespace run.
 * 2. The opening ends at the **last** line break of the run after `---` that still leaves a
 *    closing fence after it, since a longer opening is preferred but must leave one behind.
 * 3. The body ends at the **first** closing fence after that, because the body is lazy.
 *
 * This is why `'---\n\n---\n\nMORE\n---\n'` is stripped whole: the opening swallows both leading
 * line breaks, so the second `---` lands inside the body and only the third one can close.
 *
 * Two forward passes, each visiting a character a bounded number of times: the trailing
 * whitespace runs of two closing fences cannot overlap, since `---` separates them.
 */
export declare const matchFrontMatter: (text: string) => FrontMatterMatch | undefined;
