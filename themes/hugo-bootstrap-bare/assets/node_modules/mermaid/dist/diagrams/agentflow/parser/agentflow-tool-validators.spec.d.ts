/**
 * Shape-based tool model (v0.8.1).
 *
 * Per the agentflow syntax specification §10, a tool definition is any named node whose
 * resolved shape is `subroutine` (canonical) — accessible via the alias
 * `tool` plus historical aliases `subprocess`, `subproc`,
 * `framed-rectangle`.
 *
 * This spec covers:
 *   - `isToolDefinition(vertex)` and `getTools()` derived accessors
 *   - `vertexKind: 'tool'` surfaced in `getSemanticModel()`
 *
 * The win-pane instance machinery from v0.7.0 is removed in v0.8.1; reuse
 * happens through MCP-callable `action` nodes instead. The `requires` /
 * `deny` / `permits` capability metadata is also removed.
 */
export {};
