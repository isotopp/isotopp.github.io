import { applyLineJumpsToSvg } from '../../rendering-elements/lineJump.js';
import type { CommonLayoutPaintContext } from '../common/index.js';
import type { LayoutData } from '../../types.js';
/**
 * The paint groups `applyElkLineJumps` needs off the measure context.
 *
 * The selection type is taken from `applyLineJumpsToSvg`'s own signature rather
 * than named here: `D3Selection` is not part of mermaid's public surface, and
 * deriving it keeps the two in step without widening that surface.
 */
interface EdgePaintGroups {
    groups: {
        edgePaths: Parameters<typeof applyLineJumpsToSvg>[0];
    };
}
/**
 * Draw a hop where two edges cross.
 *
 * Runs as `afterPaint`, because a hop is a property of the rendered path rather
 * than of the layout: the crossings are only known once every edge has been
 * emitted, and the fix is to rewrite the `d` of the edge that gives way.
 *
 * ELK's curve is compatible either way — `applyElkEdgeLayout` sets `rounded`
 * for a routed edge and `linear` for its straight-line fallback, and
 * `curveSupportsLineHops` accepts both. An edge that takes a hop loses its
 * corner rounding in exchange, which is the trade the line-jump module
 * documents.
 */
export declare function applyElkLineJumps(data4Layout: LayoutData, { measure }: CommonLayoutPaintContext<unknown, EdgePaintGroups>): void;
export {};
