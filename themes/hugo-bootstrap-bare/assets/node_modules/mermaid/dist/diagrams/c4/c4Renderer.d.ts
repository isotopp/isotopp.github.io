import type { Diagram } from '../../Diagram.js';
import type { C4DiagramConfig } from '../../config.type.js';
import type { SVG } from '../../diagram-api/types.js';
import type { C4Boundary, C4Rel, C4Shape } from './c4Types.js';
/** The config passed to {@link setConf} may carry the global font settings. */
type C4SetConfigParam = C4DiagramConfig & {
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
};
interface BoundsData {
    startx?: number;
    stopx?: number;
    starty?: number;
    stopy?: number;
    widthLimit?: number;
}
interface NextBoundsData {
    startx?: number;
    stopx?: number;
    starty?: number;
    stopy?: number;
    cnt: number;
}
declare class Bounds {
    name: string;
    data: BoundsData;
    nextData: NextBoundsData;
    constructor(diagObj: Diagram);
    setData(startx: number, stopx: number, starty: number, stopy: number): void;
    updateVal(obj: BoundsData | NextBoundsData, key: 'startx' | 'stopx' | 'starty' | 'stopy', val: number, fun: (a: number, b: number) => number): void;
    insert(c4Shape: C4Shape): void;
    init(diagObj: Diagram): void;
    bumpLastMargin(margin: number): void;
}
export declare const setConf: (cnf?: C4SetConfigParam) => void;
export declare const drawBoundary: (diagram: SVG, boundary: C4Boundary, bounds: Bounds) => void;
export declare const drawC4ShapeArray: (currentBounds: Bounds, diagram: SVG, c4ShapeArray: C4Shape[], c4ShapeKeys: string[]) => Promise<void>;
export declare const drawRels: (diagram: SVG, rels: C4Rel[], getC4ShapeObj: (alias: string) => C4Shape | undefined, diagObj: Diagram, diagramId: string) => void;
/**
 * Draws a sequenceDiagram in the tag with id: id based on the graph definition in text.
 */
export declare const draw: (_text: string, id: string, _version: string, diagObj: Diagram) => Promise<void>;
declare const _default: {
    drawPersonOrSystemArray: (currentBounds: Bounds, diagram: SVG, c4ShapeArray: C4Shape[], c4ShapeKeys: string[]) => Promise<void>;
    drawBoundary: (diagram: SVG, boundary: C4Boundary, bounds: Bounds) => void;
    setConf: (cnf?: C4SetConfigParam) => void;
    draw: (_text: string, id: string, _version: string, diagObj: Diagram) => Promise<void>;
};
export default _default;
