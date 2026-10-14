import type { MermaidConfig } from '../config.type.js';
import type { SVG } from '../diagram-api/types.js';
/**
 * Append the `<defs>` that the look-specific stylesheet rules point at.
 *
 * `styles.ts` emits, for `look: neo`, declarations of the form
 * `stroke: url(#<svgId>-gradient)` and `filter: url(#<svgId>-drop-shadow)`. An `url(#…)`
 * paint that resolves to nothing is painted as **none**, not as a fallback colour — so a
 * diagram that carries `data-look="neo"` without these definitions loses its borders
 * entirely rather than degrading to a plain stroke.
 *
 * Every diagram going through `rendering-util/render.ts` gets them from there. Block
 * diagrams run their own render loop and so have to ask for them; extracted here rather
 * than duplicated so the two cannot drift into producing different gradients.
 *
 * Idempotent by id: calling it twice on one svg would append duplicate definitions, so
 * call it once per render.
 *
 * @param svg - The diagram's root `svg` selection. Its `id` scopes every definition, so
 * several diagrams on one page do not collide.
 * @param config - The merged config, read for `theme` and `themeVariables`.
 */
export declare const insertLookDefs: (svg: SVG, config: MermaidConfig) => void;
