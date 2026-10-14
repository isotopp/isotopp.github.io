/**
 * A catalogue of the ELK options that affect layout, with every valid value
 * listed and one line saying what it does.
 *
 * THIS FILE IS LIVE. Uncomment an option below and it applies to every ELK
 * diagram on the next rebuild — no edit to `render.ts`, nothing to paste
 * anywhere. Re-comment it to switch it back off. That is the whole workflow.
 *
 * Each block is merged over the shipping `layoutOptions` as the LAST word, so
 * an entry beats the `elk.preset`, any `config.elk.*` key the diagram sets, and
 * the DDLT sweep. Each block has exactly ONE destination:
 *
 *   PLACEMENT_OPTIONS  ─┐
 *   EDGE_ROUTING_OPTIONS ├─→ root graph  (`createRootElkGraph`)
 *   ROOT_EXPERIMENT_OVERRIDES ─┘
 *   SUBGRAPH_EXPERIMENT_OVERRIDES → every container (`buildSubgraphLayoutOptions`)
 *
 * Root is right for layering, node placement, cycle breaking and edge routing:
 * `elk.hierarchyHandling` is `INCLUDE_CHILDREN`, so one pass governs nodes
 * inside frames too. It is WRONG for `spacing.*`, `elk.padding` and
 * `nodeLabels.placement` — containers get their own set, so those do nothing at
 * the root and belong in `SUBGRAPH_EXPERIMENT_OVERRIDES`. Several options here
 * were written off as "no effect" before anyone noticed that.
 *
 * Do not merge a block into both sides. The shipping config gives containers a
 * DIFFERENT node placement from the root (`preset.containerPlacement` vs
 * `preset.placement`); forcing one value on both measures a layout the product
 * can never produce.
 *
 * Two things to know before reading a result:
 *
 * - Most keys are listed several times, once per valid value. Uncomment TWO
 *   lines of the same key and it is a duplicate-key error, which is the
 *   intended guard rather than a silent last-one-wins.
 * - Anything here that names a key already wired to `config.elk.*` silently
 *   disables that config for every diagram while it is live. `elk.cycleBreakingStrategy`
 *   was dead this way, and it took a bisect against the raw ELK option to spot.
 *
 * Everything here MUST be commented out on `develop`. `elkOptionCatalogue.spec.ts`
 * asserts that, so an option left switched on fails the build instead of
 * shipping as a silent rendering change for every user.
 */
export declare const PLACEMENT_OPTIONS: Record<string, unknown>;
/**
 * Edge ROUTING options. Live, on the same terms as {@link PLACEMENT_OPTIONS} —
 * merged over root and subgraph alike, and spread after it so these win.
 *
 * Routing decides how an edge is drawn between the layers it was already
 * assigned to. It cannot change which way round the graph an edge travels — a
 * long detour is a back edge, and that is settled in cycle breaking and
 * layering, both of which live in {@link PLACEMENT_OPTIONS}.
 *
 * MUST be fully commented out on `develop`. The routing options actually in
 * force ship in `createRootElkGraph`: `edgeRouting.selfLoopDistribution`,
 * `unnecessaryBendpoints` and `mergeHierarchyEdges`.
 */
export declare const EDGE_ROUTING_OPTIONS: Record<string, unknown>;
/**
 * Scratch overrides merged last over the ROOT graph's `layoutOptions`, after
 * `elk.preset` and every `config.elk.*` key have been resolved — so an entry
 * here beats the shipping default AND the diagram's own config.
 *
 * Governs layering, node placement, cycle breaking and edge routing for the
 * top-level graph. MUST be empty on `develop`.
 */
export declare const ROOT_EXPERIMENT_OVERRIDES: Record<string, unknown>;
/**
 * Scratch overrides merged last over every SUBGRAPH's `layoutOptions`, after
 * the per-container algorithm branch — so an entry here also beats the
 * rectpacking and directional-subgraph blocks.
 *
 * This is the side that owns spacing, padding and label placement inside a
 * frame. MUST be empty on `develop`.
 */
export declare const SUBGRAPH_EXPERIMENT_OVERRIDES: Record<string, unknown>;
