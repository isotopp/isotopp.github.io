export function getEdgesToRender(graph: any, yOffset?: number, { mergeSelfLoops }?: {
    mergeSelfLoops?: boolean | undefined;
}): any[];
export function applyDagreLayoutResult(data4Layout: any, measuredLayout: any): any;
export function prepareLayoutForDagre(data4Layout: any): {
    graph: graphlib.Graph<any, any, any>;
};
export function measureDagreLayout(data4Layout: any, { element, preparedLayout }: {
    element: any;
    preparedLayout: any;
}): Promise<{
    elem: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
    graph: any;
    groups: {
        clusters: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
        edgePaths: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
        edgeLabels: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
        nodes: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
        rootGroups: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
    };
    diagramType: any;
    id: any;
    mergeSelfLoops: boolean;
    subGraphTitleTotalMargin: number;
}>;
export function runDagreLayoutCore(data4Layout: any, context: any): any;
export const render: (data4Layout: import("../../types.js").LayoutData, svg: import("../../../mermaid.js").SVG, helpers?: import("../../../internals.js").InternalHelpers, options?: import("../../render.js").RenderOptions) => Promise<void>;
import * as graphlib from 'dagre-d3-es/src/graphlib/index.js';
