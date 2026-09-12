import type { Node } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/** Folder shape: a rectangle with a raised tab on its top-left edge. */
export declare function folder<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
