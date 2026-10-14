/**
 * `edgeSemantic` field tests (v0.8.1).
 *
 * Per the agentflow syntax specification §5.1, every edge operator carries a first-class
 * `edgeSemantic` value that downstream tooling reads as the authoritative
 * semantic. The v0.8.1 mapping table is:
 *
 * | Operator | edgeSemantic |
 * | -------- | ------------ |
 * | `-->`    | sequence     |
 * | `-.-`    | reference    |
 * | `--x`    | failure      |
 *
 * Operators outside the table leave `edgeSemantic` as `undefined` (or are
 * outright rejected by the grammar). Existing `type` / `stroke` / `length`
 * fields are preserved unchanged so rendering is unaffected.
 */
export {};
