import type { Node, ShapeRenderOptions } from '../../types.js';
import type { D3Selection } from '../../../types.js';
/** Console shape: a rounded terminal window with a command prompt glyph in the top-left. */
export declare function consoleWindow<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node, { config: { themeVariables } }: ShapeRenderOptions): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
