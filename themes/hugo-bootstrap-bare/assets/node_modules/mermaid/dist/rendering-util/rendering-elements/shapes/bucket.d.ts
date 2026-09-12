import type { Node, ShapeRenderOptions } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/** Bucket shape: an open-top container narrowing to a curved base, with an elliptical rim. */
export declare function bucket<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node, { config: { themeVariables } }: ShapeRenderOptions): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
