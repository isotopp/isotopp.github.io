export interface OrderedJsonObject {
    value: Record<string, unknown>;
    propertyOrder: Record<string, string[]>;
}
export declare class UsecaseJsonError extends Error {
    readonly line: number;
    readonly column: number;
    constructor(message: string, line: number, column: number);
}
export declare function parseOrderedJsonObject(jsonText: string, startLine: number, startColumn: number): OrderedJsonObject;
