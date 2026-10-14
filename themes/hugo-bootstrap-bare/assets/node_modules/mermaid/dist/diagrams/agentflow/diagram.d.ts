import type { MermaidConfig } from '../../config.type.js';
import { AgentFlowDB } from './agentflowDb.js';
export declare const diagram: {
    parser: any;
    readonly db: AgentFlowDB;
    renderer: {
        getClasses: (text: string, diagramObj: any) => Map<string, import("../../diagram-api/types.js").DiagramStyleClassDef>;
        draw: (text: string, id: string, _version: string, diag: any) => Promise<void>;
    };
    styles: (options: import("./styles.js").AgentflowStyleOptions) => string;
    init: (cnf: MermaidConfig) => void;
};
