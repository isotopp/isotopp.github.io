import type { Node } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/**
 * Person shape: a circular head above a rounded-rectangle body, as used for
 * people/actors in C4 model notation.
 */
export declare function person<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
