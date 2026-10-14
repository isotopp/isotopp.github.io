import type { Diagram } from '../../Diagram.js';
/**
 * Wraps an error message into a few centered lines for the error diagram.
 *
 * Whitespace is normalized, words longer than a line are hard-wrapped, and a
 * message that does not fit is capped at {@link MAX_LINES} lines with a
 * trailing ellipsis.
 *
 * @param message - The error message to wrap.
 * @returns The wrapped lines, or an empty array for an empty message.
 */
export declare const wrapErrorMessage: (message: string) => string[];
/**
 * Draws an info picture in the tag with id: id based on the graph definition in text.
 *
 * When the diagram carries an error message (set on the error db by
 * `mermaidAPI.render` when parsing failed), it is drawn below the headline so
 * that hosts which only show the SVG also see the actual cause of the failure.
 *
 * @param _text - Mermaid graph definition.
 * @param id - The text for the error
 * @param version - The version
 * @param diag - The error diagram, used to read the error message
 */
export declare const draw: (_text: string, id: string, version: string, diag?: Diagram) => void;
export declare const renderer: {
    draw: (_text: string, id: string, version: string, diag?: Diagram) => void;
};
export default renderer;
