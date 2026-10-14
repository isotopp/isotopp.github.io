import type { D3Selection } from '../../../types.js';
import type { Node } from '../../types.js';
export type UsecaseActorVariant = 'normal' | 'hollow' | 'awesome' | 'icon';
export type UsecaseActorNode = Node & {
    labelType?: 'text' | 'markdown';
    actorType?: UsecaseActorVariant;
    icon?: string;
    business?: boolean;
    stereotype?: string;
    accessibleName?: string;
};
type ActorGlyphRenderer = (group: D3Selection<SVGGElement>, node: UsecaseActorNode) => void | Promise<void>;
export declare const appendActorPath: (group: D3Selection<SVGGElement>, node: UsecaseActorNode, pathData: string, className: string, hollow?: boolean) => import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown> | import("d3-selection").Selection<SVGPathElement, unknown, Element | null, unknown>;
export declare const appendActorCircle: (group: D3Selection<SVGGElement>, node: UsecaseActorNode, cx: number, cy: number, radius: number, className: string, hollow?: boolean) => import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown> | import("d3-selection").Selection<SVGCircleElement, unknown, Element | null, unknown>;
export declare function renderUsecaseActor<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: UsecaseActorNode, variant: UsecaseActorVariant, drawGlyph: ActorGlyphRenderer): Promise<D3Selection<SVGGElement>>;
export declare function usecaseActor<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node): Promise<D3Selection<SVGGElement>>;
export {};
