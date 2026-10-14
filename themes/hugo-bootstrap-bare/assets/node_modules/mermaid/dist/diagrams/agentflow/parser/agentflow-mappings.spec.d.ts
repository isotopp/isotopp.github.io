/**
 * Element-mapping tests for the agentflow parser (v0.8.1).
 *
 * Verifies that the JISON action blocks populate `elementMappings` via the
 * `addVertexMapping` / `addEdgeMapping` / `addSubgraphMapping` /
 * `addConnectorMapping` hooks, that the reported positions land on the
 * right line numbers, and that `setFrontmatterLineOffset` shifts positions
 * into original-source space.
 *
 * Corresponding infrastructure lives in `agentflowDb.ts` and the grammar
 * action blocks in `agentflow.jison`.
 */
export {};
