import { type UsecaseModelReader } from '../usecaseAst.js';
import type { Actor, ArrowType, ClassDef, Direction, GraphAST, GraphStatement, LabelType, MetadataOccurrence, Relationship, RelationshipType, Span, SystemBoundary, UseCase, UseCaseShape, UsecaseDB, UsecaseJsonNode, UsecaseNote } from '../usecaseTypes.js';
export interface DraftLocation {
    span: Span;
    line: number;
    column: number;
}
export interface DraftLabel {
    text: string;
    type: LabelType;
    span: Span;
}
export interface DraftMetadataProperty extends MetadataOccurrence {
    value: string | boolean;
    location: DraftLocation;
}
export interface DraftMetadata {
    properties: DraftMetadataProperty[];
    location: DraftLocation;
}
export interface DraftElement {
    id: string;
    kind: 'actor' | 'usecase';
    label: DraftLabel;
    location: DraftLocation;
    generated: boolean;
    parentId?: string;
    parentLocation?: DraftLocation;
    shape?: UseCaseShape;
    metadata?: DraftMetadata;
    stereotype?: string;
    stereotypeSpan?: Span;
    classes: string[];
}
export interface DraftBoundary {
    id: string;
    label: DraftLabel;
    location: DraftLocation;
    generated: boolean;
    classes: string[];
}
export interface DraftJson {
    id: string;
    value: Record<string, unknown>;
    propertyOrder: Record<string, string[]>;
    location: DraftLocation;
    classes: string[];
}
export interface DraftEndpoint {
    id: string;
    label: DraftLabel;
    location: DraftLocation;
    generated: boolean;
    declaration: boolean;
    classesOnReference: boolean;
}
export interface DraftRelationship {
    source: DraftEndpoint;
    target: DraftEndpoint;
    location: DraftLocation;
    explicitId?: string;
    explicitIdLocation?: DraftLocation;
    type: RelationshipType;
    arrowType: ArrowType;
    label?: DraftLabel;
    minlen: number;
}
export interface DraftNote {
    target: string;
    targetLocation: DraftLocation;
    label: DraftLabel;
    location: DraftLocation;
}
/** Collects detached CST drafts and atomically publishes a fully resolved model and AST. */
export declare class UsecaseModelBuilder implements UsecaseModelReader {
    private readonly db;
    private model;
    private source;
    private statements;
    private readonly elements;
    private readonly boundaries;
    private readonly jsonDrafts;
    private readonly relationshipDrafts;
    private readonly noteDrafts;
    private readonly metadataAssignments;
    private readonly classAssignments;
    private readonly styleAssignments;
    private readonly classDefinitions;
    private readonly directions;
    constructor(db: UsecaseDB);
    reset(source: string): void;
    addElement(value: DraftElement): void;
    addBoundary(value: DraftBoundary): void;
    addJson(value: DraftJson): void;
    addRelationship(value: DraftRelationship): void;
    addNote(value: DraftNote): void;
    addMetadataAssignment(target: string, targetLocation: DraftLocation, metadata: DraftMetadata, statement: GraphStatement): void;
    addClassDef(ids: string[], styles: string[]): void;
    addClassAssignment(targets: {
        id: string;
        location: DraftLocation;
    }[], classes: string[]): void;
    addStyleAssignment(target: string, location: DraftLocation, styles: string[]): void;
    setDirection(direction: Direction): void;
    setAccTitle(title: string): void;
    setAccDescription(description: string): void;
    setStatements(statements: GraphStatement[]): void;
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
    finalize(headerSpan: Span): GraphAST;
    private collectElement;
    private collectBoundary;
    private materializeElements;
    private materializeBoundaries;
    private materializeJson;
    private materializeRelationships;
    private resolveEndpoint;
    private reorderElements;
    private applyMetadataAssignments;
    private applyStandaloneElementMetadata;
    private applyDeclarationMetadata;
    private applyActorProperty;
    private validateAndRefreshElements;
    private refreshBoundaries;
    private materializeNotes;
    private applyClassDefinitions;
    private applyClassesAndStyles;
    private getStylable;
    private validateRelationship;
    private setElementModel;
    private inferMetadataKind;
    private invalidMetadata;
    private registerUnique;
    private recordFirst;
    private conflict;
}
