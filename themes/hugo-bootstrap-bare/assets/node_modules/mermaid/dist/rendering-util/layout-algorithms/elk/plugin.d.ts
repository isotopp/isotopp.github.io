import type { LayoutLoaderDefinition } from '../../render.js';
/**
 * Entry point for the standalone `@mermaid-js/layout-elk` package, which is
 * built from this file so there is exactly one ELK implementation.
 *
 * mermaid registers these layouts itself, so the package is only needed for
 * builds that ship without ELK — notably `mermaid.tiny.js`.
 */
declare const layouts: LayoutLoaderDefinition[];
export default layouts;
