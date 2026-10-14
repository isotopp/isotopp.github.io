/**
 * Agentflow parser smoke + integration tests (v0.8.1).
 *
 * The v0.8.0/v0.8.1 round removed most of the v0.7.0 surface area
 * (agent/task/skill/testCase/directive/group containers; type/template
 * declarations; instance shapes; capability metadata; the `==>`, `-.->`,
 * `--o`, `-->>`, `o--o`, `~~`, `---` edge operators). This file keeps the
 * parser-level coverage for the surface that survived:
 *
 *   - `flow` containers (only one container kind in v0.8.1).
 *   - The three edge operators: `-->`, `-.-`, `--x`.
 *   - Flat `@{ … }` metadata.
 *   - The `connector` keyword.
 *   - Shape aliases (task / tool / input / decision / refdoc / action).
 *   - Diamond inline `id{Label}` decisions.
 *   - The `&` fan-out operator.
 *   - View hint (`view: collapsed`) on flow containers.
 */
export {};
