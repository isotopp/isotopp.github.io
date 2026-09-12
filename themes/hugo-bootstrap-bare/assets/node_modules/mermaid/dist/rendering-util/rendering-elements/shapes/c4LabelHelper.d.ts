import type { Node } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/**
 * Renders a stacked multi-section node label (name, stereotype, description
 * lines) as pure SVG text, one `createText` call per section so each section
 * can be styled through its own CSS class.
 *
 * Drop-in for `labelHelper` on nodes carrying a `stereotype`: same element
 * structure and return contract. The wrap width is a soft limit - an
 * unbreakable word may exceed it, and the calling shape self-sizes from the
 * returned bounds.
 */
export declare const c4LabelHelper: <T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node, classes?: string) => Promise<{
    shapeSvg: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
    bbox: DOMRect;
    halfPadding: number;
    label: import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>;
}>;
