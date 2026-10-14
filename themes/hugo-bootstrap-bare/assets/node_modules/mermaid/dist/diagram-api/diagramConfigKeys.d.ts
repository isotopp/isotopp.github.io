/**
 * Returns the `MermaidConfig` key holding the configuration for `diagramType`. The key is
 * not guaranteed to exist -- `info` and `error` have no section -- so treat a missing one
 * as "nothing configured for this type".
 */
export declare const getDiagramConfigKey: (diagramType: string) => string;
