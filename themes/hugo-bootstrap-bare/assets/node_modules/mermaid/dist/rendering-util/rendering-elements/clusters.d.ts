export function getUsecaseSystemBoundaryGeometry(node: any, labelBBox: any): {
    boundaryType: any;
    width: number;
    height: any;
    x: number;
    y: number;
    bodyY: any;
    bodyHeight: number;
    tabHeight: any;
    tabWidth: number;
};
export function clusterPaintsTitle(shape: string | undefined): boolean;
export function insertCluster(elem: any, node: import("../types.js").ClusterNode): Promise<any>;
export function getClusterTitleWidth(elem: any, node: any): any;
export function clear(): void;
export function positionCluster(node: any): void;
export type ClusterShapeID = keyof typeof shapes;
declare namespace shapes {
    export { rect };
    export { squareRect };
    export { roundedWithTitle };
    export { noteGroup };
    export { divider };
    export { kanbanSection };
    export { flowGroup };
    export { usecaseSystemBoundary };
    export { swimlane };
}
declare function rect(parent: any, node: any): Promise<{
    cluster: any;
    labelBBox: DOMRect;
}>;
declare function squareRect(parent: any, node: any): Promise<{
    cluster: any;
    labelBBox: DOMRect;
}>;
declare function roundedWithTitle(parent: any, node: any): Promise<{
    cluster: any;
    labelBBox: DOMRect;
}>;
/**
 * Non visible cluster where the note is group with its
 *
 * @param {any} parent
 * @param {any} node
 * @returns {any} ShapeSvg
 */
declare function noteGroup(parent: any, node: any): any;
declare function divider(parent: any, node: any): {
    cluster: any;
    labelBBox: {};
};
declare function kanbanSection(parent: any, node: any): Promise<{
    cluster: any;
    labelBBox: DOMRect;
}>;
/** Flow group: organizational grouping. Transparent, solid 0.75px, rx=10. */
declare function flowGroup(parent: any, node: any): Promise<{
    cluster: any;
    labelBBox: {
        width: number;
        height: number;
    };
}>;
/**
 * Custom cluster shape for use-case system boundaries.
 * @param {any} parent
 * @param {any} node
 * @returns {any} ShapeSvg
 */
declare function usecaseSystemBoundary(parent: any, node: any): any;
import { swimlane } from './clusters/swimlane.js';
export {};
