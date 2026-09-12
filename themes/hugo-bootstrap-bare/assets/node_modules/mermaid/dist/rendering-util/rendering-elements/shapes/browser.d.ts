import type { Node, ShapeRenderOptions } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/** Browser shape: a rounded window with a chrome bar of dots and an address-bar hint. */
export declare function browser<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node, { config: { themeVariables } }: ShapeRenderOptions): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
