/**
 * Lightweight, hierarchical render profiler.
 *
 * ## Zero production cost
 * Every call site is guarded by `injected.profiling`, a compile-time constant
 * that esbuild replaces with the literal `false` for normal builds. The guard
 * then folds away (`if (false) { … }`), every reference to {@link profiler}
 * disappears, and this whole module is tree-shaken out — zero bytes, zero
 * runtime cost. Dev and dedicated profiling builds set it to `true`.
 *
 * ## Two gates (hybrid)
 * 1. Build-time (`injected.profiling`): present only in dev/profiling builds.
 * 2. Runtime ({@link Profiler.enabled}): off by default even when compiled in,
 *    so a profiling build pays only a single boolean check until you opt in
 *    with `profiler.enable()` (or `__mermaidProfiler.enable()` in the console).
 *
 * ## Output
 * When enabled, each measured phase emits:
 *  1. A User Timing entry (`performance.measure`) so phases show up in the
 *     Chrome DevTools Performance panel "Timings" track — standard
 *     instrumentation, free visualization.
 *  2. A node in an in-memory tree ({@link ProfileSpan}) used for the structured
 *     console summary and for programmatic access via {@link Profiler.report}.
 */
export interface ProfileSpan {
    name: string;
    /** High-res start timestamp (`performance.now()`), relative to the time origin. */
    start: number;
    /** Wall-clock duration in milliseconds. `-1` until the span ends. */
    duration: number;
    children: ProfileSpan[];
}
export interface ProfileRecord {
    /** Label for this render (e.g. the layout name when comparing layouts). */
    label: string;
    /** The completed phase tree for the render. */
    tree: ProfileSpan;
    /**
     * Flat accumulators summed across the render — for sub-operations that run too
     * many times to be tree spans (e.g. per-node `getBBox`). See {@link Profiler.tickSync}.
     */
    buckets: Record<string, number>;
}
declare class Profiler {
    /** Runtime toggle. Off by default even in profiling builds. */
    enabled: boolean;
    /** Log a summary to the console automatically when each root span closes. */
    autoPrint: boolean;
    /**
     * Optional label applied to the next completed render's {@link ProfileRecord}.
     * A harness (e.g. the Dev Explorer's Profile tab) sets this before each
     * render to tag the resulting tree, e.g. with the layout name. Consumed and
     * cleared on {@link stop}.
     */
    runLabel?: string;
    /** Completed render trees, oldest first, capped at {@link maxRecords}. */
    readonly records: ProfileRecord[];
    private readonly maxRecords;
    private roots;
    private stack;
    private buckets;
    enable(): this;
    disable(): this;
    /** Begin a new top-level measurement (one per diagram render). */
    start(label: string): void;
    /**
     * Accumulate the wall-clock of a synchronous sub-operation into a named bucket,
     * summed over every call within the render — for hot operations that run too
     * often to be individual tree spans (e.g. per-node `getBBox`). Returns the
     * function's result. No-op (just calls `fn`) unless enabled.
     */
    tickSync<T>(name: string, fn: () => T): T;
    /**
     * Async variant of {@link tickSync}. WARNING: only meaningful for operations
     * that run one-at-a-time. Do NOT use it for calls awaited concurrently (e.g.
     * `Promise.all(nodes.map(...))`) — their wall-clocks overlap and the summed
     * bucket balloons far past the real elapsed time. For concurrent CPU
     * attribution use a DevTools CPU profile instead.
     */
    tick<T>(name: string, fn: () => T | Promise<T>): Promise<T>;
    /** End the current top-level measurement and optionally print a summary. */
    stop(): ProfileSpan | undefined;
    /** Open a child span. Pair with {@link end}. No-op unless enabled. */
    begin(name: string): void;
    /** Close the most recently opened span. No-op unless enabled. */
    end(): void;
    /**
     * Measure an async phase. Returns the wrapped function's result and rethrows
     * any error after closing the span, so instrumentation never swallows
     * failures or leaks an open span. No measurement overhead unless enabled.
     */
    span<T>(name: string, fn: () => T | Promise<T>): Promise<T>;
    /** The most recent completed render tree, or `undefined`. */
    report(): ProfileSpan | undefined;
    /** Drop all collected records and any in-progress spans. */
    clear(): void;
    reset(): void;
    printSummary(root?: ProfileSpan | undefined, label?: string): void;
}
export declare const profiler: Profiler;
export {};
