import type { DrawDefinition } from '../../diagram-api/types.js';
import type { UsecaseLayoutData, UsecaseLayoutEdge, UsecaseLayoutNode } from './usecaseTypes.js';
export declare const USECASE_MARKERS: UsecaseLayoutData['markers'];
export declare const usecaseDomId: (diagramId: string, modelId: string) => string;
export declare const getUsecaseNodeAccessibleName: (node: UsecaseLayoutNode) => string;
export declare const getUsecaseBoundaryAccessibleName: (boundary: Extract<UsecaseLayoutData["nodes"][number], {
    isGroup: true;
}>) => string;
export declare const getUsecaseEdgeAccessibleName: (edge: UsecaseLayoutEdge) => string;
export declare const prepareUsecaseLayoutData: (data: UsecaseLayoutData, diagramId: string) => UsecaseLayoutData;
export declare const renderer: {
    draw: DrawDefinition;
};
