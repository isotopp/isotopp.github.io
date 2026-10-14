import type { Point } from './geometry.js';
import type { Edge, Node } from '../../../types.js';
type PointLite = Point;
type MaterializedEdge = Edge & {
    points?: PointLite[];
};
type MaterializedNode = Node & {
    direction?: string;
};
export declare function separateSharedRenderedTerminalLanes(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export declare function collapseRedundantRectangularDoglegs(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export declare function liftObstacleHuggingSameSideRails(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
/**
 * Moves top-lane title bands above any rail that crosses them. A lane with no
 * `direction` of its own takes the layout's `direction`.
 */
export declare function liftTopLaneTitleBandsAboveRails(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>, layoutDirection?: string): void;
/**
 * Moves left-lane title bands of an LR layout left of any rail that crosses them.
 * A lane with no `direction` of its own takes the layout's `direction`.
 */
export declare function shiftLeftLaneTitleBandsLeftOfRails(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>, layoutDirection?: string): void;
export declare function swapDestinationTerminalTailsToReduceCrossings(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export declare function reassignCrossingExternalRailChannels(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export declare function shortcutRedundantOrthogonalJogs(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export declare function resolveRenderedOrthogonalCrossings(edges: MaterializedEdge[], nodeByIdMap: Map<string, MaterializedNode>): void;
export {};
