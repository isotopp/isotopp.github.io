import type { C4DiagramConfig } from '../../config.type.js';
import type { ShapeID } from '../../rendering-util/rendering-elements/shapes.js';
import type { NonClusterNode } from '../../rendering-util/types.js';
/**
 * Builds a unified-renderer {@link Node} from a legacy C4 shape so the legacy
 * renderer can draw elements through the shared unified shapes (the first
 * "migrate shapes" step of the C4 renderer migration). Layout still comes from
 * the legacy grid; only the drawing is delegated to the unified shapes.
 */
interface C4Text {
    text: string;
}
/** The subset of a legacy C4 shape the adapter reads. */
export interface C4ShapeLike {
    alias: string;
    label: C4Text;
    typeC4Shape: C4Text;
    techn?: C4Text;
    descr?: C4Text;
    bgColor?: string;
    fontColor?: string;
    borderColor?: string;
    shape?: string;
    sprite?: string;
    tags?: string;
}
/**
 * Resolves the render shape for a C4 element: explicit $shape/$sprite first,
 * then a recognised $tags token, then the element type.
 */
export declare const resolveNodeShape: (shape: C4ShapeLike) => ShapeID;
/** The C4 element types, internal and external, that carry per-type config. */
export declare const C4_ELEMENT_TYPES: ("system" | "container" | "person" | "system_queue" | "external_system_queue" | "container_queue" | "external_container_queue" | "component_queue" | "external_component_queue" | "system_db" | "external_system_db" | "container_db" | "external_container_db" | "component_db" | "external_component_db" | "component" | "external_system" | "external_container" | "external_person" | "external_component")[];
/**
 * Converts a legacy C4 shape into a unified-renderer Node. `config` is the c4
 * diagram config, whose `<type>_bg_color`/`<type>_border_color` palette drives the fill and border.
 * `elementWidth` is the target shape width (`c4.width`); the label helper
 * derives its own text-wrapping width from it.
 */
export declare const buildC4Node: (shape: C4ShapeLike, config: C4DiagramConfig, padding: number, look: string, elementWidth: number) => NonClusterNode;
export {};
