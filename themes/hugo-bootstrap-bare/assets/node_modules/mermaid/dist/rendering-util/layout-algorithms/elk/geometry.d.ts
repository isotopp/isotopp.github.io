export interface P {
    x: number;
    y: number;
}
export interface RectLike {
    x: number;
    y: number;
    width: number;
    height: number;
    padding?: number;
}
export interface NodeLike {
    intersect?: (p: P) => P | null;
}
export declare const EPS = 1;
export declare const PUSH_OUT = 10;
export declare const onBorder: (bounds: RectLike, p: P, tol?: number) => boolean;
/**
 * Compute intersection between a rectangle (center x/y, width/height) and the line
 * segment from insidePoint -\> outsidePoint. Returns the point on the rectangle border.
 *
 * This version avoids snapping to outsidePoint when certain variables evaluate to 0
 * (previously caused vertical top/bottom cases to miss the border). It only enforces
 * axis-constant behavior for purely vertical/horizontal approaches.
 */
export declare const intersection: (node: RectLike, outsidePoint: P, insidePoint: P) => P;
export declare const outsideNode: (node: RectLike, point: P) => boolean;
export declare const ensureTrulyOutside: (bounds: RectLike, p: P, push?: number) => P;
export declare const makeInsidePoint: (bounds: RectLike, outside: P, center: P) => P;
export declare const tryNodeIntersect: (node: NodeLike, bounds: RectLike, outside: P) => P | null;
export declare const fallbackIntersection: (bounds: RectLike, outside: P, center: P) => P;
/**
 * Where the node's outline meets the ray that runs into the node from `port`,
 * against the direction the edge departs in.
 *
 * ELK routes to ports on the node's BOUNDING BOX, and always leaves one
 * perpendicular to the side it sits on. For a rectangle that port is already
 * the attachment point. For anything else the outline is inside the box, so the
 * attachment has to move inwards — and the direction it moves in decides
 * whether the edge stays orthogonal.
 *
 * Moving along the centre ray (what `intersect` does on its own) lands on the
 * outline at a DIFFERENT offset along the side than the port, so the opening
 * segment comes out diagonal and the edge visibly kinks as it leaves the shape.
 * Moving along the departure axis instead keeps the attachment collinear with
 * ELK's own stub: the edge leaves the outline, crosses the box, and carries on
 * in one straight line.
 *
 * Returns null when the ray cannot be resolved — no `intersect`, a departure
 * direction that is not axis-aligned, or an interior sample that is not
 * actually inside — leaving the caller on its existing path.
 */
export declare const outlineAttachPoint: (node: NodeLike, bounds: RectLike, port: P, next: P) => P | null;
export declare const computeNodeIntersection: (node: NodeLike, bounds: RectLike, outside: P, center: P) => P;
export declare const replaceEndpoint: (points: P[], which: "start" | "end", value: P | null | undefined, tol?: number) => void;
