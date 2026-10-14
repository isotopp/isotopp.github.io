import type { Actor, ClassDef, Direction, GraphAST, GraphStatement, Relationship, Span, SystemBoundary, UseCase, UsecaseJsonNode, UsecaseNote } from './usecaseTypes.js';
export interface UsecaseModelReader {
    getActors(): ReadonlyMap<string, Actor>;
    getUseCases(): ReadonlyMap<string, UseCase>;
    getSystemBoundaries(): ReadonlyMap<string, SystemBoundary>;
    getRelationships(): readonly Relationship[];
    getNotes(): ReadonlyMap<string, UsecaseNote>;
    getJsonNodes(): ReadonlyMap<string, UsecaseJsonNode>;
    getClassDefs(): ReadonlyMap<string, ClassDef>;
    getDirection(): Direction;
    getAccTitle(): string;
    getAccDescription(): string;
}
export declare const buildUsecaseGraphAST: (model: UsecaseModelReader, source: string, headerSpan: Span, statements: GraphStatement[]) => GraphAST;
