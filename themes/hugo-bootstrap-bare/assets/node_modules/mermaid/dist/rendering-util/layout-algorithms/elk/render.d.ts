import { type CommonLayoutRenderContext } from '../common/index.js';
import type { LayoutData } from '../../types.js';
import { type TreeData } from './find-common-ancestor.js';
import { type P, type RectLike } from './geometry.js';
type Node = LayoutData['nodes'][number];
type Edge = LayoutData['edges'][number];
interface LabelData {
    width: number;
    height: number;
    wrappingWidth?: number;
}
interface ElkNodeOffset {
    posX: number;
    posY: number;
    x: number;
    y: number;
    depth: number;
    width: number;
    height: number;
}
interface NodeWithVertex {
    id: string;
    dir?: string;
    height?: number;
    intersect?: (point: P) => P | null;
    isGroup?: boolean;
    /**
     * Where ELK put this container, kept when `evenGroupFrames` moves the drawn
     * frame. Edge sections resolve against this, never against the moved frame.
     */
    elkOrigin?: {
        posX: number;
        posY: number;
    };
    padding?: number;
    parentId?: string;
    shape?: string;
    width?: number;
    x?: number;
    y?: number;
    [key: string]: any;
    children?: NodeWithVertex[];
    labelData?: LabelData;
    labels?: {
        text?: string;
        width: number;
        height: number;
    }[];
    layoutOptions?: Record<string, unknown>;
    offset?: ElkNodeOffset;
}
interface ElkSubgraphConfig {
    mergeEdges?: boolean;
    straightenEdges?: boolean;
    preset?: string;
    layeringStrategy?: string;
    layeringLayerBound?: number;
    nodePlacementAlignment?: string;
    nodePlacementStrategy?: string;
    cycleBreakingStrategy?: string;
}
interface ElkPreparedLayout {
    algorithm?: string;
}
interface ElkLayoutContext {
    algorithm?: string;
    /**
     * Extra root-graph `layoutOptions`, merged last over
     * {@link createRootElkGraph}'s defaults.
     *
     * NOT user-facing config: nothing in `config.schema.yaml` writes it and
     * production `render()` never sets it. It exists so the DDLT configuration
     * sweep can try ELK options that are currently hardcoded here — spacings,
     * edge routing, node placement — WITHOUT forking the layout pipeline. A
     * sweep that reimplemented `createRootElkGraph` would be measuring a graph
     * the browser never builds, which is the exact failure the single-pipeline
     * rule exists to prevent.
     *
     * Promote a winning option to a real default in `createRootElkGraph`, or to
     * a `config.elk.*` key if it should be author-controlled. Do not reach for
     * this from product code.
     */
    rootLayoutOptions?: Record<string, unknown>;
    common: {
        lineBreakRegex: RegExp;
    };
    getConfig: () => any;
    interpolateToCurve: (interpolate: string | undefined, defaultCurve: unknown) => unknown;
    log: {
        debug: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
    };
}
interface ElkLayoutState {
    elkGraph: any;
    nodeDb: Record<string, NodeWithVertex>;
    parentLookupDb: TreeData;
}
interface ElkLayoutResult {
    children?: any[];
    edges?: any[];
}
/**
 * Undo the algorithm-scoped options on a container, restoring the values a
 * plain subgraph would have had.
 */
export declare function clearContainerAlgorithmOptions(layoutOptions: Record<string, unknown>): void;
/**
 * Resolve a container's requested layout algorithm, or `undefined` when the
 * request is absent, not a string, or not a supported ELK algorithm.
 */
export declare function resolveContainerAlgorithm(requested: unknown, log?: ElkLayoutContext['log']): string | undefined;
export declare function dir2ElkDirection(dir: unknown): 'RIGHT' | 'LEFT' | 'DOWN' | 'UP';
export declare function buildSubgraphLayoutOptions(node: {
    dir?: string;
    shape?: string;
    padding?: number;
    labelData?: LabelData;
    metadata?: {
        algorithm?: unknown;
    } & Record<string, unknown>;
}, elkConfig: ElkSubgraphConfig | undefined, algorithm: string | undefined, log?: ElkLayoutContext['log']): Record<string, unknown>;
/**
 * Identify the entry node of each recursive flow so it can be pinned to the top.
 *
 * `elk.layered` must break cycles before it can rank nodes, and its default
 * cycle-breaking heuristic is purely degree-based — it has no notion of an
 * "entry point". So as soon as a flow loops back on itself (recursion), the
 * first-declared node can be ranked in the middle of the layout, scrambling the
 * reading order and hiding where the flow starts.
 *
 * For each container (grouped by `parentId`) we look only at edges internal to
 * that container and find its weakly-connected components. A component with no
 * natural source — no node with in-degree 0 once self-loops are ignored — must
 * contain a cycle. For such components we break cycles greedily in edge
 * declaration order: an edge that would close a directed cycle is treated as a
 * back-edge and skipped, and the entry is the first node in declaration order
 * that is a source of the remaining forward edges. Raw in-degree alone cannot
 * find it — a back-edge feeding the true entry hides it, and nominating by
 * node declaration order instead scrambles the layout (#79). Acyclic
 * components always have a source and nominate nothing, leaving their layout
 * untouched. The caller pins each nominee to the first layer with
 * `elk.layered.layering.layerConstraint = FIRST`.
 *
 * @param nodes - layout nodes in declaration order
 * @param edges - layout edges referencing node ids via `source`/`target`
 * @returns the ids of nodes to constrain to the first layer
 */
export declare function findCyclicEntryNodes(nodes: {
    id: string;
    parentId?: string;
}[], edges: {
    source?: string | number;
    target?: string | number;
}[]): Set<string>;
export declare function prepareLayoutForElk(data4Layout: LayoutData, context: CommonLayoutRenderContext<ElkPreparedLayout>): ElkPreparedLayout;
export declare function runElkLayoutCore(data4Layout: LayoutData, context: CommonLayoutRenderContext<ElkPreparedLayout>): Promise<ElkLayoutResult>;
export declare function buildElkGraphFromLayoutData(data4Layout: LayoutData, elkContext: ElkLayoutContext): ElkLayoutState;
export declare const render: (data4Layout: LayoutData, svg: import("../../../mermaid.js").SVG, helpers?: import("../../../internals.js").InternalHelpers, options?: import("../../render.js").RenderOptions) => Promise<void>;
/**
 * Resolve a preset name, falling back to `default` for an unknown one.
 *
 * `Object.hasOwn` rather than a plain lookup: the schema's enum only guards the
 * config path, and a directive or a programmatic config can still put anything
 * here. `ELK_PRESETS['__proto__']` is truthy, so an indexed lookup would return
 * `Object.prototype` and every strategy read off it would come back `undefined`
 * — a silently strategy-less layout rather than the documented fallback.
 */
export declare function resolveElkPreset(name: string | undefined): {
    layering: string;
    placement: string;
    containerPlacement: string;
    alignment: string;
    cycleBreaking: string;
};
/**
 * Sit each group's frame an even distance from its own contents.
 *
 * ELK sizes a container around everything it put inside, edges included. An
 * edge that runs against the flow of the layout gets routed back around the
 * outside, and when that happens inside a frame the frame grows to hold the
 * lane — on one side only, since that is where the edge leaves. The result is a
 * group with 76px of space on the right and 24px on the left, which reads as a
 * mistake because nothing visible occupies it.
 *
 * The lane is real and the edge still needs it, so the fix is not to reclaim
 * the space but to stop drawing the frame around it. The frame is pulled in to
 * `SUBGRAPH_PADDING` from the children on the left, right and bottom, and the
 * edge keeps its lane just outside — which is what an edge routed around a
 * group should look like anyway.
 *
 * The top is left exactly as ELK set it. It carries the subgraph's title strip,
 * and there is no way from here to tell how much of that padding is the label
 * and how much is spare, so tightening it risks clipping the title.
 *
 * Runs deepest-first, so a parent measures against children that have already
 * been pulled in rather than against their original boxes.
 */
export declare function collectDescendantIds(elkNode: any, into?: Set<string>): Set<string>;
export declare function evenGroupFrames(elkNodes: any[], layoutState: ElkLayoutState, nodeById: Map<string, Node>, graph?: ElkLayoutResult): void;
/**
 * A run displaced by `straightenFront`, in both its original and its
 * straightened position, so a label that was riding along it can be moved
 * with it — see `applyElkEdgeLayout`'s use of `straightenEdgeTerminals`.
 * Both a and b are given in the original (unreversed) coordinate frame,
 * regardless of whether this run came from the front or back straightening
 * pass.
 */
export interface StraightenedRun {
    old: {
        a: P;
        b: P;
    };
    new: {
        a: P;
        b: P;
    };
}
/**
 * Straighten the port-to-channel staircase at either end of a clipped route,
 * leaving both ports where they are.
 *
 * Returns the original array when nothing applies, so callers can compare by
 * identity.
 */
export declare function straightenTerminalJogs(points: P[]): P[];
/**
 * Project a label sitting on one of an edge's straightened runs onto that
 * run's new position.
 *
 * Deliberately scoped to just the run(s) `straightenEdgeTerminals` actually
 * moved, rather than searching the edge's whole route: an unrelated,
 * unchanged segment elsewhere on the route (e.g. a return leg) can be nearer
 * to the label's old position than the run that moved is, and snapping to it
 * would put the label on the wrong part of the edge entirely. Nearness is
 * judged on each run's ORIGINAL position — the same point along the run
 * (by parameter, not by nearest-point-after-the-fact) is then read off its
 * new position, since a run only ever moves perpendicular to itself.
 */
export declare function projectLabelOntoStraightenedRun(label: P, runs: StraightenedRun[]): P | null;
/**
 * Straighten the port-to-channel step on every edge that has one, but only
 * where doing so does not buy a crossing or a label overlap.
 *
 * Runs once over the finished layout rather than per edge, because the decision
 * needs the other edges: the step is removed by displacing one of this edge's
 * runs onto the port's row, and that run can land in a lane something else
 * already occupies. Trading a barely-visible step for a new crossing is a bad
 * deal, so an edge that would cause one is left exactly as ELK routed it. So is
 * one that would leave ELK's reserved label lane for a label over an edge (#8368).
 *
 * Returns, for each edge whose points changed, the run(s) that moved, so the
 * caller can carry the edge's main label along with the specific run it sat
 * on (see `projectLabelOntoStraightenedRun` and the call site in
 * `applyElkEdgeLayout`) — the label's `x`/`y` is set from ELK's own layout
 * before this runs, and does not move on its own when a run does.
 */
export declare function straightenEdgeTerminals(edges: Edge[]): {
    edge: Edge;
    runs: StraightenedRun[];
}[];
/**
 * Push apart the labels of two opposite-direction edges between the same
 * node pair when they'd otherwise overlap.
 */
export declare function separateOppositeEdgeLabels(edges: Edge[]): void;
/**
 * ELK can place the end label of an edge that crosses into another group
 * across that group's frame (#8335). Slide such a label along its end segment,
 * by the shortest distance, until it clears every frame — never off that segment.
 */
export declare function slideTerminalLabelsOffFrames(edges: Edge[], nodes: LayoutData['nodes']): void;
/**
 * ELK puts every end label on one fixed side of its edge, but a `…Right` label
 * belongs on the right of the direction of travel and a `…Left` one on the left,
 * which is where dagre puts them. Mirror a label that is on the wrong side
 * across its end segment, which keeps its distance from the line and the
 * marker — but only onto free space: ELK reserved room on its own side, and the
 * mirrored spot can belong to an edge leaving a neighbouring port.
 */
export declare function putTerminalLabelsOnTheirSide(edges: Edge[], nodes: LayoutData['nodes']): void;
/**
 * ELK places terminal labels beside the port it routed from, but the clipping
 * and straightening passes can slide the endpoint along the node's side after
 * that. Move each label with its endpoint so it stays beside the end it names.
 */
export declare function followMovedEndpoints(edge: Edge, ports: {
    start: P;
    end: P;
}): void;
export declare function sanitizeElkEdgePoints(points: P[], startNode: NodeWithVertex, endNode: NodeWithVertex, log: ElkLayoutContext['log']): P[];
/**
 * Mirror of `ensureEndMarkerSegmentLength` for the start of the path: the
 * start marker's pull-back walks forward along the first segment, so a short
 * on-border stub there flips the start marker the same way.
 */
export declare function ensureStartMarkerSegmentLength(points: P[], startBounds: RectLike, markerOffset: number, log: {
    debug: (...args: unknown[]) => void;
}): P[];
export declare function ensureEndMarkerSegmentLength(points: P[], endBounds: RectLike, markerOffset: number, log: {
    debug: (...args: unknown[]) => void;
}): P[];
export {};
