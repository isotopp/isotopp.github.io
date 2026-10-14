/**
 * Agentflow conformance suite — part 1 of issue #13.
 *
 * Discovers every `<case>-agentflow.mmd` file under `./fixtures/`, parses
 * it, runs the post-parse validators, and compares the outcome /
 * diagnostics to the paired `<case>-agentflow.expected.json`. Adding a
 * new case is a two-file change with no test-code edits.
 *
 * The `-agentflow` suffix lets agentflow conformance fixtures share a
 * conformance root with other diagram types later without filename
 * collisions — each diagram type would use its own `-<type>.mmd`
 * suffix and discovery filter.
 *
 * PR 4 ships a minimal pair of fixtures proving the runner end-to-end.
 * PR 5 fills the directory with the full wave-1 corpus, including every
 * §19 Semantic Pattern from the agentflow syntax specification.
 */
export {};
