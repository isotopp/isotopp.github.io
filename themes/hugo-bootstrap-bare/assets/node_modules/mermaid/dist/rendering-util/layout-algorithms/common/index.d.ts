import type { SVG } from '../../../diagram-api/types.js';
import type { InternalHelpers } from '../../../internals.js';
import type { D3Selection } from '../../../types.js';
import { createGraphWithElements } from '../../createGraph.js';
import type { LayoutData, Edge } from '../../types.js';
import type { RenderOptions } from '../../render.js';
export type CommonLayoutMeasure = Awaited<ReturnType<typeof createGraphWithElements>>;
type ClusterDb = Map<string, {
    node?: LayoutData['nodes'][number];
} & Record<string, unknown>>;
export interface CommonLayoutRenderContext<PreparedLayout = unknown> {
    element: D3Selection<SVGElement>;
    helpers?: InternalHelpers;
    options?: RenderOptions;
    preparedLayout?: PreparedLayout;
}
export interface CommonLayoutPaintContext<PreparedLayout = unknown, MeasureResult = CommonLayoutMeasure> extends CommonLayoutRenderContext<PreparedLayout> {
    measure: MeasureResult;
}
export interface CommonLayoutPaintOptions {
    clusterDb?: ClusterDb;
    getNodes?: (data4Layout: LayoutData, context: CommonLayoutPaintContext<unknown, CommonLayoutMeasure>) => Iterable<LayoutData['nodes'][number]>;
    getEdgeNode?: (id: string | undefined, edge: Edge, context: CommonLayoutPaintContext<unknown, CommonLayoutMeasure>) => LayoutData['nodes'][number] | object | undefined;
    skipNode?: (node: LayoutData['nodes'][number], context: CommonLayoutPaintContext<unknown, CommonLayoutMeasure>) => boolean;
    isCluster?: (node: LayoutData['nodes'][number], context: CommonLayoutPaintContext<unknown, CommonLayoutMeasure>) => boolean;
    skipEdge?: (edge: Edge) => boolean;
    skipIntersect?: boolean | ((edge: Edge) => boolean);
}
export interface CommonLayoutRendererDefinition<CoreResult = unknown, PreparedLayout = void, MeasureResult = CommonLayoutMeasure> {
    prepareLayout?: (data4Layout: LayoutData, context: CommonLayoutRenderContext<PreparedLayout>) => PreparedLayout | Promise<PreparedLayout>;
    measureLayout?: (data4Layout: LayoutData, context: CommonLayoutRenderContext<PreparedLayout>) => Promise<MeasureResult>;
    runLayoutCore: (data4Layout: LayoutData, context: CommonLayoutRenderContext<PreparedLayout>) => CoreResult | Promise<CoreResult>;
    paintLayout?: (data4Layout: LayoutData, context: CommonLayoutPaintContext<PreparedLayout, MeasureResult>, coreResult: CoreResult) => void | Promise<void>;
    afterPaint?: (data4Layout: LayoutData, context: CommonLayoutPaintContext<PreparedLayout, MeasureResult>, coreResult: CoreResult) => void | Promise<void>;
    paintOptions?: CommonLayoutPaintOptions;
}
export declare function createCommonLayoutRenderer<CoreResult = unknown, PreparedLayout = void, MeasureResult = CommonLayoutMeasure>({ prepareLayout, measureLayout, runLayoutCore, paintLayout, afterPaint, paintOptions, }: CommonLayoutRendererDefinition<CoreResult, PreparedLayout, MeasureResult>): (data4Layout: LayoutData, svg: SVG, helpers?: InternalHelpers, options?: RenderOptions) => Promise<void>;
export declare function clearLayoutRenderState(): void;
export declare function defaultMeasureLayout(data4Layout: LayoutData, { element }: CommonLayoutRenderContext): Promise<CommonLayoutMeasure>;
export declare function paintLayoutData(data4Layout: LayoutData, context: CommonLayoutPaintContext<unknown, CommonLayoutMeasure>, options?: CommonLayoutPaintOptions): Promise<void>;
export {};
