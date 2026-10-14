import type { DiagramDefinition } from '../../diagram-api/types.js';
import flowStyles from './styles.js';
interface FlowDiagramOptions {
    styles?: typeof flowStyles;
}
export declare const createFlowDiagram: ({ styles, }?: FlowDiagramOptions) => DiagramDefinition;
export declare const diagram: DiagramDefinition;
export {};
