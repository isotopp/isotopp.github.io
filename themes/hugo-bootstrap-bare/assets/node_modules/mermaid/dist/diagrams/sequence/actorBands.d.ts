/** Height of the glyph band. The round icons set it: a 22 unit circle plus its underline. */
export declare const GLYPH_BAND_HEIGHT = 44;
/** Air between the bottom of the glyph and the top of the label block. */
export declare const GLYPH_LABEL_GAP = 6;
/** Air between the bottom of the label block and the lifeline datum. */
export declare const LABEL_LIFELINE_GAP = 6;
interface ActorLike {
    description: string;
    actorTextHeight?: number;
}
interface ActorFontConf {
    actorFontFamily?: string;
    actorFontSize?: string | number;
    actorFontWeight?: string | number;
}
/**
 * Measured height of the actor's label block. `calculateActorMargins` stashes the measurement it
 * already takes; the fallback keeps isolated `drawActor` calls (tests, external callers) working.
 */
export declare const actorLabelHeight: (actor: ActorLike, conf: ActorFontConf) => number;
/** The stack an icon-family actor needs above the datum: glyph, gap, label, gap. */
export declare const actorStackHeight: (textHeight: number) => number;
export interface HeaderBands {
    /** The datum: where this row's lifelines start. */
    lifelineStartY: number;
    /** Bottom edge of the glyph band; glyphs are drawn ending here. */
    glyphBottomY: number;
    /** Vertical centre of the label block. */
    labelCenterY: number;
}
export interface FooterBands {
    /** Top edge of the glyph band below the datum. */
    glyphTopY: number;
    /** Bottom edge of the glyph band. */
    glyphBottomY: number;
    /** Vertical centre of the label block. */
    labelCenterY: number;
    /** Total height the footer stack occupies below the datum. */
    stackHeight: number;
}
/**
 * Header geometry for one actor. `rowHeight` is the row's shared height (`conf.height` after
 * `calculateActorMargins`), which is what makes the datum one line rather than eight.
 */
export declare const headerBands: (actorY: number, rowHeight: number, textHeight: number) => HeaderBands;
/** Footer geometry: the same stack, top-anchored at the datum, growing downward. */
export declare const footerBands: (actorY: number, textHeight: number) => FooterBands;
export {};
