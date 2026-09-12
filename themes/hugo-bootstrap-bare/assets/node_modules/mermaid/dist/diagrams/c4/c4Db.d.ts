import type { C4Boundary, C4Rel, C4Shape } from './c4Types.js';
/**
 * The parser may pass a plain string or an object with a single
 * `{ key: value }` entry for most attributes.
 */
type ParserAttribute = string | Record<string, string>;
export declare const getC4Type: () => string | undefined;
export declare const setC4Type: (c4TypeParam: string) => void;
export declare const addRel: (type: string | null | undefined, from: string | null | undefined, to: string | null | undefined, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addPersonOrSystem: (typeC4Shape: string, alias: string | null, label: string | null | undefined, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addContainer: (typeC4Shape: string, alias: string | null, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addComponent: (typeC4Shape: string, alias: string | null, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addPersonOrSystemBoundary: (alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addContainerBoundary: (alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const addDeploymentNode: (nodeType: string, alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
export declare const popBoundaryParseStack: () => void;
export declare const updateElStyle: (typeC4Shape: string, elementName: string, bgColor?: ParserAttribute | null, fontColor?: ParserAttribute | null, borderColor?: ParserAttribute | null, shadowing?: ParserAttribute | null, shape?: ParserAttribute | null, sprite?: ParserAttribute | null, techn?: ParserAttribute | null, legendText?: ParserAttribute | null, legendSprite?: ParserAttribute | null) => void;
export declare const updateRelStyle: (typeC4Shape: string, from: string, to: string, textColor?: ParserAttribute | null, lineColor?: ParserAttribute | null, offsetX?: ParserAttribute | null, offsetY?: ParserAttribute | null) => void;
export declare const updateLayoutConfig: (typeC4Shape: string, c4ShapeInRowParam: ParserAttribute, c4BoundaryInRowParam: ParserAttribute) => void;
export declare const getC4ShapeInRow: () => number;
export declare const getC4BoundaryInRow: () => number;
export declare const getCurrentBoundaryParse: () => string;
export declare const getParentBoundaryParse: () => string;
export declare const getC4ShapeArray: (parentBoundary?: string | null) => C4Shape[];
export declare const getC4Shape: (alias: string) => C4Shape | undefined;
export declare const getC4ShapeKeys: (parentBoundary?: string | null) => string[];
export declare const getBoundaries: (parentBoundary?: string | null) => C4Boundary[];
/**
 * @deprecated Use {@link getBoundaries} instead
 */
export declare const getBoundarys: (parentBoundary?: string | null) => C4Boundary[];
export declare const getRels: () => C4Rel[];
export declare const getTitle: () => string;
export declare const setWrap: (wrapSetting?: boolean) => void;
export declare const autoWrap: () => boolean | undefined;
export declare const clear: () => void;
export declare const LINETYPE: {
    SOLID: number;
    DOTTED: number;
    NOTE: number;
    SOLID_CROSS: number;
    DOTTED_CROSS: number;
    SOLID_OPEN: number;
    DOTTED_OPEN: number;
    LOOP_START: number;
    LOOP_END: number;
    ALT_START: number;
    ALT_ELSE: number;
    ALT_END: number;
    OPT_START: number;
    OPT_END: number;
    ACTIVE_START: number;
    ACTIVE_END: number;
    PAR_START: number;
    PAR_AND: number;
    PAR_END: number;
    RECT_START: number;
    RECT_END: number;
    SOLID_POINT: number;
    DOTTED_POINT: number;
};
export declare const ARROWTYPE: {
    FILLED: number;
    OPEN: number;
};
export declare const PLACEMENT: {
    LEFTOF: number;
    RIGHTOF: number;
    OVER: number;
};
export declare const setTitle: (txt: string) => void;
declare const _default: {
    addPersonOrSystem: (typeC4Shape: string, alias: string | null, label: string | null | undefined, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
    addPersonOrSystemBoundary: (alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, tags?: ParserAttribute, link?: ParserAttribute) => void;
    addContainer: (typeC4Shape: string, alias: string | null, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
    addContainerBoundary: (alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, tags?: ParserAttribute, link?: ParserAttribute) => void;
    addComponent: (typeC4Shape: string, alias: string | null, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
    addDeploymentNode: (nodeType: string, alias: string | null, label: string | null | undefined, type?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
    popBoundaryParseStack: () => void;
    addRel: (type: string | null | undefined, from: string | null | undefined, to: string | null | undefined, label: string | null | undefined, techn?: ParserAttribute | null, descr?: ParserAttribute | null, sprite?: ParserAttribute, tags?: ParserAttribute, link?: ParserAttribute) => void;
    updateElStyle: (typeC4Shape: string, elementName: string, bgColor?: ParserAttribute | null, fontColor?: ParserAttribute | null, borderColor?: ParserAttribute | null, shadowing?: ParserAttribute | null, shape?: ParserAttribute | null, sprite?: ParserAttribute | null, techn?: ParserAttribute | null, legendText?: ParserAttribute | null, legendSprite?: ParserAttribute | null) => void;
    updateRelStyle: (typeC4Shape: string, from: string, to: string, textColor?: ParserAttribute | null, lineColor?: ParserAttribute | null, offsetX?: ParserAttribute | null, offsetY?: ParserAttribute | null) => void;
    updateLayoutConfig: (typeC4Shape: string, c4ShapeInRowParam: ParserAttribute, c4BoundaryInRowParam: ParserAttribute) => void;
    autoWrap: () => boolean | undefined;
    setWrap: (wrapSetting?: boolean) => void;
    getC4ShapeArray: (parentBoundary?: string | null) => C4Shape[];
    getC4Shape: (alias: string) => C4Shape | undefined;
    getC4ShapeKeys: (parentBoundary?: string | null) => string[];
    getBoundaries: (parentBoundary?: string | null) => C4Boundary[];
    getBoundarys: (parentBoundary?: string | null) => C4Boundary[];
    getCurrentBoundaryParse: () => string;
    getParentBoundaryParse: () => string;
    getRels: () => C4Rel[];
    getTitle: () => string;
    getC4Type: () => string | undefined;
    getC4ShapeInRow: () => number;
    getC4BoundaryInRow: () => number;
    setAccTitle: (txt: string) => void;
    getAccTitle: () => string;
    getAccDescription: () => string;
    setAccDescription: (txt: string) => void;
    getConfig: () => Required<import("../../config.type.js").C4DiagramConfig>;
    clear: () => void;
    LINETYPE: {
        SOLID: number;
        DOTTED: number;
        NOTE: number;
        SOLID_CROSS: number;
        DOTTED_CROSS: number;
        SOLID_OPEN: number;
        DOTTED_OPEN: number;
        LOOP_START: number;
        LOOP_END: number;
        ALT_START: number;
        ALT_ELSE: number;
        ALT_END: number;
        OPT_START: number;
        OPT_END: number;
        ACTIVE_START: number;
        ACTIVE_END: number;
        PAR_START: number;
        PAR_AND: number;
        PAR_END: number;
        RECT_START: number;
        RECT_END: number;
        SOLID_POINT: number;
        DOTTED_POINT: number;
    };
    ARROWTYPE: {
        FILLED: number;
        OPEN: number;
    };
    PLACEMENT: {
        LEFTOF: number;
        RIGHTOF: number;
        OVER: number;
    };
    setTitle: (txt: string) => void;
    setC4Type: (c4TypeParam: string) => void;
};
export default _default;
