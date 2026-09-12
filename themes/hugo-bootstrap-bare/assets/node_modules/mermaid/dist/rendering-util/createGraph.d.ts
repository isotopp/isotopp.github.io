import type { Selection } from 'd3';
import * as graphlib from 'dagre-d3-es/src/graphlib/index.js';
import type { ClusterNode, LayoutData, NonClusterNode, ShapeRenderOptions } from './types.js';
type D3Selection<T extends SVGElement = SVGElement> = Selection<T, unknown, Element | null, unknown>;
interface LayoutElementGroups {
    clusters: D3Selection<SVGGElement>;
    edgePaths: D3Selection<SVGGElement>;
    edgeLabels: D3Selection<SVGGElement>;
    nodes: D3Selection<SVGGElement>;
    rootGroups: D3Selection<SVGGElement>;
}
export interface CreateLayoutElementGroupsOptions {
    edgePathsClass?: string;
}
export declare function createLayoutElementGroups(element: D3Selection, { edgePathsClass }?: CreateLayoutElementGroupsOptions): LayoutElementGroups;
export declare function measureGroupLabel(nodesGroup: D3Selection<SVGGElement>, node: ClusterNode): Promise<void>;
export declare function insertMeasuredNode(nodesGroup: D3Selection<SVGGElement>, node: NonClusterNode, renderOptions: ShapeRenderOptions): Promise<D3Selection<SVGElement | SVGGElement>>;
/**
 * Creates a graph by merging the graph construction and DOM element insertion.
 *
 * This function creates the graph, inserts the SVG groups (clusters, edgePaths, edgeLabels, nodes)
 * into the provided element, and uses `insertNode` to add nodes to the diagram. Node dimensions
 * are computed using each node's bounding box.
 *
 * @param element - The D3 selection in which the SVG groups are inserted.
 * @param data4Layout - The layout data containing nodes and edges.
 * @returns A promise resolving to an object containing the graph and the inserted groups.
 */
export declare function createGraphWithElements(element: D3Selection, data4Layout: LayoutData): Promise<{
    graph: graphlib.Graph;
    groups: {
        clusters: D3Selection<SVGGElement>;
        edgePaths: D3Selection<SVGGElement>;
        edgeLabels: D3Selection<SVGGElement>;
        nodes: D3Selection<SVGGElement>;
        rootGroups: D3Selection<SVGGElement>;
    };
    nodeElements: Map<string, D3Selection<SVGElement | SVGGElement>>;
}>;
export {};
