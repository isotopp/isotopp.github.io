import type { SVG } from '../diagram-api/types.js';
import type { InternalHelpers } from '../internals.js';
import type { LayoutData } from './types.js';
export interface RenderOptions {
    algorithm?: string;
}
export interface LayoutAlgorithm {
    render(layoutData: LayoutData, svg: SVG, helpers: InternalHelpers, options?: RenderOptions): Promise<void>;
}
export type LayoutLoader = () => Promise<LayoutAlgorithm>;
export interface LayoutLoaderDefinition {
    name: string;
    loader: LayoutLoader;
    algorithm?: string;
}
export declare const registerLayoutLoaders: (loaders: LayoutLoaderDefinition[]) => void;
/**
 * Look up a registered layout by name.
 *
 * @internal Not part of the public API; it exists so the registration of the
 * built-in layouts can be asserted on directly.
 */
export declare const getLayoutLoaderDefinition: (name: string) => LayoutLoaderDefinition;
export declare const render: (data4Layout: LayoutData, svg: SVG) => Promise<void>;
/**
 * Get the registered layout algorithm, falling back when it is not available -- `elk` and
 * `cose-bilkent` ship only in large-feature builds (the tiny build omits them), so a diagram
 * type may name either as its default. `fallback` may itself be absent, so `dagre` closes the chain.
 */
export declare const getRegisteredLayoutAlgorithm: (algorithm?: string, { fallback }?: {
    fallback?: string | undefined;
}) => string;
