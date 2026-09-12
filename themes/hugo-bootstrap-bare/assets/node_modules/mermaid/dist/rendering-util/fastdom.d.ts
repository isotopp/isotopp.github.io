import fastdomPromised from 'fastdom/extensions/fastdom-promised.js';
/**
 * Promisified version of {@link fastdom} that uses `queueMicrotask` instead of `requestAnimationFrame` for faster execution.
 *
 * @example
 * ```
 * const bbox = await fastdom.measure(() => div.node()!.getBoundingClientRect());
 * ```
 */
declare const fastdom: {
    extend: <T extends object>(props: T) => (Exclude<"clear", keyof T & keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }> | Exclude<"measure", keyof T & keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }> | Exclude<"extend", keyof T & keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }> | Exclude<"mutate", keyof T & keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }> | Exclude<"catch", keyof T & keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }> extends infer T_1 extends keyof {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    } ? { [P in T_1]: {
        clear<T_2 extends () => void>(task: T_2): boolean;
        extend<T extends object>(props: T): Pick & T;
        measure<T_2 extends () => void>(task: T_2, context?: any): T_2;
        mutate<T_2 extends () => void>(task: T_2, context?: any): T_2;
        catch: null | ((e: unknown) => any);
    }[P]; } : never) & T;
    catch: null | ((e: unknown) => any);
} & typeof fastdomPromised;
export default fastdom;
