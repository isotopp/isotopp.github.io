import type { SVG, SVGGroup } from '../../diagram-api/types.js';
import type { RectData } from '../common/commonTypes.js';
import type { C4Boundary, C4DrawConfig, C4Rel } from './c4Types.js';
export declare const drawRect: (elem: SVG | SVGGroup, rectData: RectData) => import("../common/commonTypes.js").D3RectElement;
export declare const drawRels: (elem: SVG, rels: C4Rel[], conf: C4DrawConfig, diagramId: string) => void;
export declare const insertDatabaseIcon: (elem: SVG, id: string) => void;
export declare const insertComputerIcon: (elem: SVG, id: string) => void;
export declare const insertClockIcon: (elem: SVG, id: string) => void;
/**
 * Setup arrow head and define the marker. The result is appended to the svg.
 */
export declare const insertArrowHead: (elem: SVG, id: string) => void;
export declare const insertArrowEnd: (elem: SVG, id: string) => void;
/**
 * Setup arrow head and define the marker. The result is appended to the svg.
 */
export declare const insertArrowFilledHead: (elem: SVG, id: string) => void;
/**
 * Setup arrow head and define the marker. The result is appended to the svg.
 */
export declare const insertArrowCrossHead: (elem: SVG, id: string) => void;
declare const _default: {
    drawRect: (elem: SVG | SVGGroup, rectData: RectData) => import("../common/commonTypes.js").D3RectElement;
    drawBoundary: (elem: SVG, boundary: C4Boundary, conf: C4DrawConfig) => void;
    drawRels: (elem: SVG, rels: C4Rel[], conf: C4DrawConfig, diagramId: string) => void;
    insertArrowHead: (elem: SVG, id: string) => void;
    insertArrowEnd: (elem: SVG, id: string) => void;
    insertArrowFilledHead: (elem: SVG, id: string) => void;
    insertArrowCrossHead: (elem: SVG, id: string) => void;
    insertDatabaseIcon: (elem: SVG, id: string) => void;
    insertComputerIcon: (elem: SVG, id: string) => void;
    insertClockIcon: (elem: SVG, id: string) => void;
};
export default _default;
