import type { DiagramDB } from '../../diagram-api/types.js';
import type { Edge, Node } from '../../rendering-util/types.js';
import type { AgentflowElementMapping, AgentflowSemanticModel, EdgeSemantic, FlowClass, FlowEdge, FlowSubGraph, FlowText, FlowVertex, FlowVertexTypeParam } from './types.js';
import type { AgentflowDiagnostic, AgentflowDiagnosticContext, AgentflowWarningId } from './diagnostics.js';
/**
 * Raw JISON `@$` location object. Produced by the jison-generated parser
 * when location tracking is enabled (default). Only the line/column/range
 * fields are used.
 */
interface JisonLocation {
    first_line: number;
    first_column: number;
    last_line: number;
    last_column: number;
    range?: [number, number];
}
export declare class AgentFlowDB implements DiagramDB {
    private vertexCounter;
    private config;
    private vertices;
    private edges;
    private classes;
    private subGraphs;
    private subGraphLookup;
    private globalNodes;
    private connectors;
    private tooltips;
    private subCount;
    private firstGraphFlag;
    private direction;
    private version;
    private secCount;
    private posCrossRef;
    private diagramId;
    readonly preserveCommentsWhenParsing = true;
    private frontmatterLineOffset;
    private elementMappings;
    private bareVertexMappings;
    private diagnostics;
    /**
     * Post-parse validators that emit diagnostics run at most once per parse
     * (idempotent `getData()` calls). Resettable via `clear()`.
     */
    private postParseValidationRun;
    private funs;
    constructor();
    private sanitizeText;
    private sanitizeNodeLabelType;
    /**
     * Sets the diagram's SVG element ID, used to prefix domIds for uniqueness
     * across multiple diagrams on the same page.
     */
    setDiagramId(svgElementId: string): void;
    /**
     * Function to lookup domId from id in the graph definition.
     * When diagramId is set, returns the prefixed version for DOM uniqueness.
     *
     * @param id - id of the node
     */
    lookUpDomId(id: string): string;
    /**
     * Function called by parser when a node definition has been found
     */
    addVertex(id: string, textObj: FlowText, type: FlowVertexTypeParam, style: string[], classes: string[], dir: string, props: {} | undefined, metadata: any, metadataLoc?: JisonLocation): void;
    /**
     * Translate a js-yaml failure raised while parsing an `<id>@{ ... }` block
     * from block-relative coordinates into absolute source coordinates, then
     * rethrow (issue #56 part 2).
     *
     * js-yaml's `mark.line` / `mark.column` (and the `(R:C)` reference plus the
     * `N |` excerpt prefixes baked into `message`) count from the start of the
     * block buffer the DB hands it — either the synthetic `{\n … \n}` wrapper
     * (single-line `@{ … }`) or the verbatim multi-line body. Neither matches
     * the line the user sees. Using the `shapeData` symbol's JISON location
     * (`@{`'s position) plus the frontmatter offset, we map the reported
     * coordinate back to source space, rewrite the message's `(R:C)` and excerpt
     * prefixes, update `mark`, and attach a JISON-style `hash.loc` so downstream
     * tooling can read source coordinates structurally instead of re-deriving
     * them from the buffer.
     *
     * Defensive: if the error isn't a positioned js-yaml exception, or we lack
     * the block location, the original error propagates untouched — translation
     * never makes a failure harder to read than it already was.
     */
    /**
     * Build a shape error carrying a JISON-shaped `hash.loc`, so the position is
     * readable structurally rather than only as prose. Mirrors what
     * `rethrowMetadataYamlError` attaches for YAML failures.
     */
    private positionedShapeError;
    private rethrowMetadataYamlError;
    /**
     * Function called by parser when a link/edge definition has been found
     *
     */
    addSingleLink(_start: string, _end: string, type: any, id?: string): void;
    private isLinkData;
    addLink(_start: string[], _end: string[], linkData: unknown): void;
    /**
     * Updates a link's line interpolation algorithm
     */
    updateLinkInterpolate(positions: ('default' | number)[], interpolate: string): void;
    /**
     * Updates a link with a style
     *
     */
    updateLink(positions: ('default' | number)[], style: string[]): void;
    addClass(ids: string, _style: string[]): void;
    /**
     * Called by parser when a graph definition is found, stores the direction of the chart.
     *
     */
    setDirection(dir: string): void;
    /**
     * Called by parser when a special node is found, e.g. a clickable element.
     *
     * @param ids - Comma separated list of ids
     * @param className - Class to add
     */
    setClass(ids: string, className: string): void;
    setTooltip(ids: string, tooltip: string): void;
    private setClickFun;
    /**
     * Called by parser when a link is found. Adds the URL to the vertex data.
     *
     * @param ids - Comma separated list of ids
     * @param linkStr - URL to create a link for
     * @param target - Target attribute for the link
     */
    setLink(ids: string, linkStr: string, target: string): void;
    getTooltip(id: string): string | undefined;
    /**
     * Called by parser when a click definition is found. Registers an event handler.
     *
     * @param ids - Comma separated list of ids
     * @param functionName - Function to be called on click
     * @param functionArgs - Arguments to be passed to the function
     */
    setClickEvent(ids: string, functionName: string, functionArgs: string): void;
    bindFunctions(element: Element): void;
    getDirection(): string | undefined;
    /**
     * Retrieval function for fetching the found nodes after parsing has completed.
     *
     */
    getVertices(): Map<string, FlowVertex>;
    /**
     * Retrieval function for fetching the found links after parsing has completed.
     *
     */
    getEdges(): FlowEdge[] & {
        defaultInterpolate?: string;
        defaultStyle?: string[];
    };
    /**
     * Returns true when `vertex` is a **tool definition** per
     * the agentflow syntax specification §8 — its resolved shape is `subroutine` or one
     * of the accepted aliases (`subprocess`, `subproc`, `framed-rectangle`).
     *
     * This is the source of truth for "is this a tool?" — there is no
     * separate kind tag stored on the vertex; tool-ness is derived from
     * shape on every check. Downstream consumers reading the semantic model
     * see this surfaced as `vertexKind: 'tool'` (see `getSemanticModel`).
     */
    isToolDefinition(vertex: FlowVertex): boolean;
    /**
     * Returns every vertex that is a tool definition (per `isToolDefinition`).
     * Derived view; not cached.
     */
    getTools(): FlowVertex[];
    /**
     * Retrieval function for fetching the found class definitions after parsing has completed.
     *
     */
    getClasses(): Map<string, FlowClass>;
    private setupToolTips;
    /**
     * Clears the internal graph db so that a new graph can be parsed.
     *
     */
    clear(ver?: string): void;
    setGen(ver: string): void;
    /**
     * Legacy `linkStyle default` colours, byte-identical to `flowDb`. Hardcoded
     * rather than theme-derived on purpose: nothing in the repo calls this, and
     * changing the values would diverge from flowchart for no visible gain.
     */
    defaultStyle(): string;
    addSubGraph(_id: {
        text: string;
    }, list: string[], _title: {
        text: string;
        type: string;
    }, type?: 'flow'): string;
    /**
     * Registers every node id that appears inside a `global … end` block as
     * globally scoped (issue #80): the node keeps no parent even when it is
     * referenced inside a `flow … end` block, opting out of the textual
     * membership rule that would otherwise pull it in. Edges declared inside
     * the block are ordinary top-level edges — only the membership exemption
     * is recorded here, and no container is emitted for the block.
     */
    addGlobal(list: unknown[]): void;
    private getPosForId;
    private indexNodes2;
    getDepthFirstPos(pos: number): number;
    indexNodes(): void;
    /**
     * Called by parser when a `connector <id>["Title"]` declaration is
     * encountered (§8). Stores the connector as a FlowVertex with
     * `isConnector: true` so the connector flows through the renderer
     * alongside vertices, while keeping a separate index for connector-
     * specific lookups (e.g. `connectorRef` resolution).
     */
    addConnector(textObj: FlowText, titleObj?: FlowText): string;
    /**
     * Live array. `getData()` and the JISON actions read it on the hot path and a
     * per-call copy would be wasted work; unlike `getDiagnostics()` this is not an
     * accessor built for external consumers. Same for `getVertices()` /
     * `getEdges()`, whose `defaultStyle` / `defaultInterpolate` side-properties a
     * copy would drop.
     */
    getSubGraphs(): FlowSubGraph[];
    /** Returns connectors declared via the `connector` keyword (§8). */
    getConnectors(): FlowVertex[];
    firstGraph(): boolean;
    /**
     * Maps the post-`destructLink` `(type, stroke)` pair onto the canonical
     * `edgeSemantic` value defined by the agentflow syntax specification §5.1 (v0.8.1).
     * The three-way table:
     *   - `-->` → arrow_point + normal → sequence
     *   - `-.-` → arrow_open  + dotted → reference
     *   - `--x` → arrow_cross + normal → failure
     * Returns `undefined` for combinations the spec no longer permits.
     */
    private computeEdgeSemantic;
    private destructStartLink;
    private countChar;
    private destructEndLink;
    destructLink(_str: string, _startStr: string): {
        type: string;
        stroke: string;
    } | {
        edgeSemantic: EdgeSemantic | undefined;
        length?: number;
        stroke: string;
        type: string;
        text?: string;
    };
    exists(allSgs: FlowSubGraph[], _id: string): boolean;
    /**
     * Deletes an id from all subgraphs
     *
     */
    makeUniq(sg: FlowSubGraph, allSubgraphs: FlowSubGraph[]): {
        nodes: string[];
    };
    lex: {
        firstGraph: typeof AgentFlowDB.prototype.firstGraph;
    };
    private getTypeFromVertex;
    private findNode;
    private destructEdgeType;
    private addNodeFromVertex;
    private getCompiledStyles;
    /**
     * Post-parse hook. Property-level metadata validation and semantic checks
     * (§10 applicability, connector-ref resolution, §3.3 containment, edge
     * endpoint kinds, flow input, identifier namespace) were removed from the
     * parser in v0.8.2 (issue #64) — they are semantic concerns owned by the
     * semantics module. The parser keeps only structural parsing plus `shape`
     * (unknown-shape errors, see `transformData`) and `view` handling. This hook
     * remains as a no-op so downstream callers and the run-once guard are intact.
     */
    private runPostParseValidators;
    getData(): {
        nodes: Node[];
        edges: Edge[];
        other: {};
        config: import("../../config.type.js").MermaidConfig;
        connectors: FlowVertex[];
    };
    defaultConfig(): import("../../config.type.js").FlowchartDiagramConfig | undefined;
    /**
     * The v0.8.1 §4 vertex kind for a parsed vertex.
     *
     * Extracted so the semantic model and `getData()`'s palette slots read the same rules
     * from one place. Kind is NOT recoverable from the resolved shape alone — a tool and a
     * task can both land on `roundedRect` — which is why this takes the vertex and not just
     * its shape.
     */
    private deriveVertexKind;
    getSemanticModel(): AgentflowSemanticModel;
    setFrontmatterLineOffset(offset: number): void;
    private toElementPosition;
    private pushMapping;
    addVertexMapping(id: string, _text: unknown, shape: unknown, loc: JisonLocation | undefined): void;
    /**
     * Extend a vertex's mapping end to cover a trailing inline metadata block
     * (`id["..."]@{ ... }`). The node declaration already pushed a mapping
     * spanning just the declaration; when the `@{ ... }` block reduces we widen
     * that mapping's end to the block's closing `}` so editor cursors inside the
     * block resolve to the node rather than the containing flow (issue #60).
     * `loc` is the `shapeData` symbol's location, so only the end moves — the
     * declaration start is preserved. Falls back to a fresh mapping if the node
     * has none yet.
     *
     * When the mapping being widened came from a bare `id` reference (no
     * label/shape brackets), the statement is a standalone attachment
     * (`id@{ ... }`) annotating an element declared elsewhere — retype it to
     * 'attachment' so consumers can tell it apart from a declaration
     * (issue #75).
     */
    extendVertexMapping(id: string, loc: JisonLocation | undefined): void;
    addEdgeMapping(_fromStmt: unknown, toNodes: unknown, _link: unknown, loc: JisonLocation | undefined): void;
    addSubgraphMapping(_id: unknown, _title: unknown, startLoc: JisonLocation | undefined, endLoc: JisonLocation | undefined): void;
    addConnectorMapping(textObj: FlowText | undefined, _titleObj: FlowText | undefined, startLoc: JisonLocation | undefined, endLoc: JisonLocation | undefined): void;
    getElementMappings(): readonly AgentflowElementMapping[];
    getElementById(id: string): AgentflowElementMapping | undefined;
    getElementsOnLine(line: number): AgentflowElementMapping[];
    getElementAtPosition(line: number, column: number): AgentflowElementMapping | undefined;
    getMappingStats(): {
        vertices: number;
        edges: number;
        subgraphs: number;
        connectors: number;
        attachments: number;
        totalElements: number;
    };
    private emitDiagnostic;
    emitWarning(id: AgentflowWarningId, message: string, ctx?: AgentflowDiagnosticContext): void;
    emitError(id: AgentflowWarningId, message: string, ctx?: AgentflowDiagnosticContext): void;
    /**
     * `readonly` is erased at runtime, so hand back a copy — this is a
     * consumer-facing accessor and a caller sorting the result in place would
     * otherwise reorder the DB's own list.
     */
    getDiagnostics(): readonly AgentflowDiagnostic[];
    setAccTitle: (txt: string) => void;
    setAccDescription: (txt: string) => void;
    setDiagramTitle: (txt: string) => void;
    getAccTitle: () => string;
    getAccDescription: () => string;
    getDiagramTitle: () => string;
}
export {};
