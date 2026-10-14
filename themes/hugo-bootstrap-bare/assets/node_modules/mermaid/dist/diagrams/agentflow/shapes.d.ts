/**
 * v0.8.1 shape aliases (§4.3.2). Author-friendly names map to canonical Mermaid
 * shape IDs. `round` is a forgiving legacy alias of `rect`, which the render
 * pass then normalises to {@link DEFAULT_SHAPE}.
 */
export declare const SHAPE_ALIASES: ReadonlyMap<string, string>;
/**
 * Shapes that are *removed* in v0.8.1 (§4.3.3). Authoring any of these is a hard
 * error (`SHAPE_REMOVED`); the node is coerced to {@link DEFAULT_SHAPE} rather
 * than crashing the render.
 */
export declare const REMOVED_SHAPES: ReadonlySet<string>;
/**
 * Shapes the v0.8.1 spec allows authors to use, as canonical Mermaid shape IDs
 * after alias resolution. `rect`/`squareRect` are normalised to
 * {@link DEFAULT_SHAPE} before this set is consulted, so they are not listed.
 */
export declare const ALLOWED_SHAPES: ReadonlySet<string>;
export declare const DEFAULT_SHAPE = "roundedRect";
/**
 * Resolve a shape name (alias or canonical) to its canonical Mermaid shape ID.
 * Returns the input unchanged when no alias matches.
 */
export declare function resolveShapeAlias(shape: string | undefined): string | undefined;
/** Minimal diagnostic sink, so this module does not have to know about the DB. */
export interface ShapeDiagnosticSink {
    emitError?: (id: 'SHAPE_REMOVED', message: string, ctx: {
        nodeId: string;
    }) => void;
    emitWarning?: (id: 'SHAPE_UNSUPPORTED', message: string, ctx: {
        nodeId: string;
    }) => void;
}
interface ShapedNode {
    id: string;
    shape?: string;
    isGroup?: boolean;
}
/**
 * Normalise every node's shape to a canonical, supported ID, reporting removed
 * and unsupported shapes through `sink`. Group nodes keep their cluster shape.
 */
export declare function normaliseNodeShapes(nodes: ShapedNode[], sink?: ShapeDiagnosticSink): void;
export {};
