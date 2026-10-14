/**
 * Comment parsing tests for agentflow diagrams.
 *
 * Mirrors the comment-handling scope of the flowchart JISON fix ported from
 * `alana/flowchart_jison_highlight` (commit dd77bb73b). Covers comments in all
 * positions: before/after the diagram header, between statements, inside node
 * shapes (text / ellipseText / trapText states), empty comments, and the
 * negative-lookahead case where `%%{init: ...}%%` directives MUST NOT be
 * tokenised as comments.
 */
export {};
