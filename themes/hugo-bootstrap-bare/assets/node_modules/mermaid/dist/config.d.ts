import type { MermaidConfig } from './config.type.js';
export declare const defaultConfig: MermaidConfig;
/**
 * Converts a string/boolean into a boolean
 *
 * @param val - String or boolean to convert
 * @returns The result from the input
 */
export declare const evaluate: (val?: string | boolean | null) => boolean;
/**
 * Sets the `siteConfig` to the desired values.
 *
 * The `siteConfig` is a protected configuration for repeat use. Calls
 * to {@link reset} will reset the `currentConfig` to `siteConfig`.
 *
 * @param conf - The config to use as `siteConfig`. This will be merged with the `defaultConfig`.
 * @returns The new siteConfig
 */
export declare const setSiteConfig: (conf: MermaidConfig) => MermaidConfig;
export declare const saveConfigFromInitialize: (conf: MermaidConfig) => void;
export declare const updateSiteConfig: (conf: MermaidConfig) => MermaidConfig;
/**
 * Returns a copy of the current `siteConfig` base configuration.
 *
 * @returns The siteConfig
 */
export declare const getSiteConfig: () => MermaidConfig;
/**
 * Updates the `currentConfig` with the provided `conf` after sanitization.
 *
 * @deprecated Any changes to the `currentConfig` would be overwritten by the
 *             next call to {@link addDirective} or {@link reset}.
 * @param conf - The potential currentConfig
 * @returns The currentConfig merged with the sanitized conf
 */
export declare const setConfig: (conf: MermaidConfig) => MermaidConfig;
/**
 * Returns a copy of the `currentConfig`.
 *
 * @remarks Avoid calling this function repeatedly.
 * Instead, store the result in a variable and use it, and pass it down to function calls.
 *
 * @returns The currentConfig
 */
export declare const getConfig: () => MermaidConfig;
/**
 * Ensures options parameter does not attempt to override `siteConfig` secure keys.
 *
 * @remarks Modifies options in-place.
 *
 * @param options - The potential `setConfig` parameter
 */
export declare const sanitize: (options: any) => void;
/**
 * Pushes in a directive to the configuration
 *
 * @param directive - The directive to push in
 */
export declare const addDirective: (directive: MermaidConfig) => void;
/**
 * Resets the current config and applied directives to the provided config.
 *
 * @param config - the value to reset the `currentConfig` to.
 * Defaults to the current `siteConfig` (e.g the value returned by {@link getSiteConfig}).
 */
export declare const reset: (config?: MermaidConfig) => void;
export declare const getUserDefinedConfig: () => MermaidConfig;
/**
 * Helper function to handle deprecated flowchart.htmlLabels
 * @param config - The configuration object (merged config with defaults)
 * @returns The effective htmlLabels value based on precedence: root flowchart  default
 */
export declare const getEffectiveHtmlLabels: (config: MermaidConfig) => boolean;
