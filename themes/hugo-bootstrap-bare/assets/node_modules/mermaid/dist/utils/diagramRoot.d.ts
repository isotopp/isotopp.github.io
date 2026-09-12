import type { D3HtmlSelection } from '../types.js';
export interface DiagramRoot {
    /** Selection of the body that diagram elements should be queried from. */
    root: D3HtmlSelection<HTMLElement>;
    /** Owner document of {@link root} (the iframe document in sandbox mode). */
    doc: Document;
}
/**
 * Resolves the root selection a renderer should draw into, accounting for
 * `securityLevel: 'sandbox'` where the diagram lives inside an `#i<id>`
 * iframe. Centralizes the sandbox handling that was previously copy-pasted
 * (with non-null assertions) into every renderer.
 */
export declare const getDiagramRoot: (id: string, securityLevel?: string) => DiagramRoot;
