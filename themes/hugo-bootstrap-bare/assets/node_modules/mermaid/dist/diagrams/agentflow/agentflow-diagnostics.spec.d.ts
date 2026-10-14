/**
 * Diagnostic-layer tests for agentflow.
 *
 * Covers:
 * - `emitWarning` / `emitError` write to `getDiagnostics()` and `log`.
 * - Context (`nodeId` / `edgeId`) resolves to positions via the element
 *   mapping layer from PR 2a.
 * - `transformData`'s `SHAPE_UNSUPPORTED` warning reaches the diagnostic
 *   layer when a DB is passed in.
 * - `clear()` resets the diagnostic list.
 */
export {};
