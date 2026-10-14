/**
 * Agentflow conformance runner — part 1 of issue #13.
 *
 * Drives a directory of paired `<case>-agentflow.mmd` +
 * `<case>-agentflow.expected.json` fixtures through the parser and the
 * diagnostic layer, comparing the actual outcome (`valid` / `warning` /
 * `error` / `parse-error`) and any observed diagnostics against the
 * expectations declared in JSON.
 *
 * Files use Mermaid's standard `.mmd` extension. The `-agentflow` suffix
 * identifies the diagram type so agentflow fixtures can share a
 * conformance root with other diagram types later without collisions.
 *
 * The runner is intentionally small: fixture format, parse + drive, match.
 * PR 5 fills the `fixtures/` directory with the full wave-1 corpus and
 * ports every example from the agentflow syntax specification.
 *
 * Fixture format
 * --------------
 *
 * `<case>-agentflow.mmd` — the diagram source.
 *
 * `<case>-agentflow.expected.json`:
 *
 * ```json
 * {
 *   "outcome": "valid",        // "valid" | "warning" | "error" | "parse-error"
 *   "diagnostics": [           // optional; every listed diagnostic must be present
 *     {
 *       "id": "HEXAGON_MULTI_BRANCH",
 *       "nodeId": "h",          // optional
 *       "edgeId": "e1",         // optional
 *       "line": 2               // optional; matches `position.startLine`
 *     }
 *   ],
 *   "semanticAssertions": {    // optional; wave-2 PR 5 addition
 *     "vertices": [
 *       { "id": "do_work", "vertexKind": "tool",
 *         "resolvedMetadata": { "returns": "OutputType" } }
 *     ],
 *     "edges": [
 *       { "start": "a", "end": "b", "edgeSemantic": "control" }
 *     ]
 *   }
 * }
 * ```
 *
 * `diagnostics` pins the full set: every listed expectation must match at
 * least one actual entry, and every actual diagnostic must be anticipated by
 * some listed entry. Set `"allowExtraDiagnostics": true` to fall back to
 * subset matching.
 *
 * `parse-error` fixtures may add `"parseErrorContains"` to pin which error was
 * raised rather than only that one was.
 *
 * `semanticAssertions` uses partial-subset matching: every listed
 * vertex/edge must exist in the semantic model, and every listed field
 * must match; unlisted vertices/edges/fields are ignored.
 */
import type { AgentflowDiagnostic } from '../diagnostics.js';
import type { AgentflowSemanticModel } from '../types.js';
export interface ExpectedDiagnostic {
    /** Message ID — must match `AgentflowDiagnostic.id`. */
    id: string;
    /** Optional nodeId constraint. */
    nodeId?: string;
    /** Optional edgeId constraint. */
    edgeId?: string;
    /** Optional source line (compared against `position.startLine`). */
    line?: number;
}
/**
 * Semantic-model assertion on a single vertex. `id` is required and must
 * match a `SemanticVertex.id`. Fields that are listed are checked; fields
 * that are omitted are not. `metadata` uses partial-subset matching —
 * each listed key must appear with the listed value, but the actual map
 * may carry additional keys.
 */
export interface ExpectedVertex {
    id: string;
    vertexKind?: 'tool' | 'action' | 'input' | 'refdoc' | 'decision' | 'task';
    /** Partial match: listed keys must equal, extras allowed. */
    metadata?: Record<string, unknown>;
}
/**
 * Semantic-model assertion on a single edge. Either both `start` and
 * `end` (for operator-keyed matching) or `id` (for author-assigned edge
 * ids) must be provided. `edgeSemantic` is the v0.8.1 §5.1 derived value.
 */
export interface ExpectedEdge {
    start?: string;
    end?: string;
    id?: string;
    edgeSemantic?: 'sequence' | 'reference' | 'failure';
}
export interface ExpectedSemanticAssertions {
    vertices?: ExpectedVertex[];
    edges?: ExpectedEdge[];
}
export interface FixtureExpectation {
    outcome: 'valid' | 'warning' | 'error' | 'parse-error';
    diagnostics?: ExpectedDiagnostic[];
    /**
     * Allow diagnostics the fixture did not list. Off by default: a declared
     * `diagnostics` array pins the full set.
     */
    allowExtraDiagnostics?: boolean;
    /**
     * For `parse-error` fixtures: a substring the thrown parser message must
     * contain, so the fixture pins *which* error, not merely that one occurred.
     */
    parseErrorContains?: string;
    /**
     * Optional assertions against `getSemanticModel()` output. Every listed
     * vertex and edge must be present and every listed field must match;
     * unlisted vertices/edges/fields are not constrained.
     */
    semanticAssertions?: ExpectedSemanticAssertions;
}
export interface FixtureResult {
    outcome: 'valid' | 'warning' | 'error' | 'parse-error';
    diagnostics: readonly AgentflowDiagnostic[];
    /** Populated unless the JISON parser threw. */
    semanticModel?: AgentflowSemanticModel;
    /** Populated when the JISON parser threw. */
    parseError?: string;
}
/**
 * Parse a fixture's source, drive post-parse validators via `getData()`,
 * collect diagnostics, and classify the outcome.
 */
export declare function runFixture(source: string): FixtureResult;
export interface MatchFailure {
    kind: 'outcome-mismatch' | 'missing-diagnostic' | 'unexpected-diagnostic' | 'semantic-mismatch' | 'parse-error-mismatch';
    message: string;
}
/**
 * Compare a fixture result to its expectation. Returns an empty array on
 * success or a list of human-readable failure descriptions. The runner
 * passes this into the test assertion layer.
 */
export declare function matchExpected(result: FixtureResult, expected: FixtureExpectation): MatchFailure[];
