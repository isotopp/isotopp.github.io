import type { Edge, Node } from '../../rendering-util/types.js';
import type { EntityNode, Attribute, Relationship, EntityClass, RelSpec } from './erTypes.js';
import type { DiagramDB } from '../../diagram-api/types.js';
import type { ErSubGraph } from './erTypes.js';
export declare class ErDB implements DiagramDB {
    private entities;
    private relationships;
    private classes;
    subgraphDepth: number;
    private subGraphs;
    private subGraphLookup;
    private subCount;
    private direction;
    private Cardinality;
    private Identification;
    constructor();
    /**
     * Add entity
     * @param name - The name of the entity
     * @param alias - The alias of the entity
     */
    addEntity(name: string, alias?: string): EntityNode;
    getEntity(name: string): EntityNode | undefined;
    getEntities(): Map<string, EntityNode>;
    getClasses(): Map<string, EntityClass>;
    addAttributes(entityName: string, attribs: Attribute[]): void;
    /**
     * Add a relationship
     *
     * @param entA - The first entity in the relationship
     * @param rolA - The role played by the first entity in relation to the second
     * @param entB - The second entity in the relationship
     * @param rSpec - The details of the relationship between the two entities
     */
    addRelationship(entA: string, rolA: string, entB: string, rSpec: RelSpec): void;
    getRelationships(): Relationship[];
    getDirection(): string;
    setDirection(dir: string): void;
    private getCompiledStyles;
    addCssStyles(ids: string[], styles: string[]): void;
    addClass(ids: string[], style: string[]): void;
    addSubGraph(_id: {
        text: string;
    }, list: string[], _title: {
        text: string;
        type: string;
    }): string;
    getSubGraphs(): ErSubGraph[];
    setClass(ids: string[], classNames: string[]): void;
    /**
     * Build a quick lookup for all node IDs already assigned to existing subgraphs.
     */
    private subgraphNodeCache;
    /**
     * Filter out nodes that are already part of another subgraph,
     * keeping subgraph membership unique.
     */
    private makeUniq;
    private sanitizeText;
    private sanitizeNodeLabelType;
    clear(): void;
    getData(): {
        nodes: Node[];
        edges: Edge[];
        other: {};
        config: import("../../config.type.js").MermaidConfig;
        direction: string;
    };
    setAccTitle: (txt: string) => void;
    getAccTitle: () => string;
    setAccDescription: (txt: string) => void;
    getAccDescription: () => string;
    setDiagramTitle: (txt: string) => void;
    getDiagramTitle: () => string;
    getConfig: () => import("../../config.type.js").ErDiagramConfig | undefined;
}
