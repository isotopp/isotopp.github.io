import type { Node } from '../../rendering-util/types.js';
/**
 * Fixed slot per kind. Declaration order of this map is the palette order, so `tool` is
 * always the first palette colour, `task` the second, and so on.
 */
export declare const KIND_SLOT: ReadonlyMap<string, number>;
/** Slots reserved for kinds. Containers start above this. */
export declare const KIND_COUNT: number;
/** Class marking a node's kind, matched by the rules `styles.ts` emits. */
export declare const kindClass: (kind: string) => string;
/** Every kind, for the stylesheet to iterate. */
export declare const KINDS: readonly string[];
/**
 * How many slots containers may cycle through, given a palette length.
 *
 * At least one: a palette shorter than the kind range would otherwise yield a modulo by
 * zero, and one repeated container colour beats a crash.
 */
export declare const containerSlotCount: (paletteLength: number) => number;
/**
 * The palette slot for the `n`th container, given the palette length.
 *
 * The single source of truth for both sides. `stampColorSlot` reduces whatever index it is
 * given modulo the palette length, so the stylesheet has to name the slot the stamp will
 * actually produce — otherwise a palette shorter than the kind range assigns slot 7, the
 * stamp writes `color-1`, and the rule for `color-7` matches nothing. Measured before this
 * was shared: a 3-colour palette left every container unpainted.
 *
 * On such a short palette a container will land on a kind's colour. That is unavoidable —
 * seven kinds already collide among themselves below eight colours — and a shared colour
 * beats an unpainted frame.
 */
export declare const containerSlot: (n: number, paletteLength: number) => number;
/**
 * Tag every node with its kind class, and give every container its slot.
 *
 * Nodes are tagged rather than stamped with `data-color-id` because agentflow draws
 * through six different shapes — `subroutine`, `diamond`, `hexagon`, `lean-right`,
 * `lin-doc`, `roundedRect` — and of the shared shapes only `squareRect` stamps for
 * itself. A class travels through the shared pipeline on every one of them, and keeps this
 * change inside agentflow instead of editing six files other diagrams also draw with.
 *
 * Containers use `colorIndex` and nothing else — the same mechanism flowchart subgraphs,
 * block composites, state composites and usecase boundaries all use. Both forms are
 * covered: `createContainerGroup` stamps the expanded frame and `collapsedGroup.ts` stamps
 * the collapsed one, so collapsing a container keeps its colour.
 *
 * `containerOrder` carries declaration order, which the node array does not: `getData()`
 * walks `subGraphs` in reverse, and `subGraphs` is itself in completion order, so neither
 * it nor its reverse is the order the author wrote. The caller does that walk.
 */
export declare function assignColorSlots(nodes: Node[], kindOf: (id: string) => string | undefined, containerOrder: ReadonlyMap<string, number>): void;
