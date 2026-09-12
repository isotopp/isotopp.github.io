import type { Direction } from '../../../diagrams/block/blockTypes.js';
import type { D3Selection, Point } from '../../../types.js';
import type { Node } from '../../types.js';
export declare const getArrowPoints: (duplicatedDirections: Direction[], bbox: {
    width: number;
    height: number;
}, node: Pick<Node, "padding">, totalWidth?: number) => Point[];
export declare function block_arrow<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
