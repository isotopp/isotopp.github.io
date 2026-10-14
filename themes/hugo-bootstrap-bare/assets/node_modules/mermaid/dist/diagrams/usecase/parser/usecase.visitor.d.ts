import type { CstNode, IToken } from 'chevrotain';
import type { ArrowType, GraphStatement, RelationshipType, Span, UseCaseShape } from '../usecaseTypes.js';
import { type DraftBoundary, type DraftLabel, type DraftLocation, type DraftMetadata, type DraftMetadataProperty } from './usecaseModelBuilder.js';
type Ctx = Record<string, (CstNode | IToken)[]>;
interface ParsedStereotype {
    value: string;
    span: Span;
}
interface ParsedClassSuffix {
    classes: string[];
    spans: Span[];
}
interface ParsedActorItem {
    id: string;
    label: DraftLabel;
    location: DraftLocation;
    generated: boolean;
    metadata?: DraftMetadata;
    stereotype?: ParsedStereotype;
    classes: string[];
    classSpans: Span[];
}
interface ParsedEntity extends ParsedActorItem {
    shape?: UseCaseShape;
    explicitDeclaration: boolean;
}
interface ParsedArrow {
    type: RelationshipType;
    arrowType: ArrowType;
    label?: DraftLabel;
    minlen: number;
}
interface ParsedRelationTail {
    explicitId?: string;
    explicitIdLocation?: DraftLocation;
    arrow: ParsedArrow;
    target: ParsedEntity;
}
declare const BaseVisitor: new (...args: any[]) => import("chevrotain").ICstVisitor<any, any>;
declare class UsecaseVisitor extends BaseVisitor {
    private readonly builder;
    private source;
    private parentBoundary;
    private anonymousEdge;
    private anonymousNote;
    constructor();
    build(cst: CstNode, source: string): void;
    start(ctx: Ctx): void;
    line(ctx: Ctx): GraphStatement;
    statement(ctx: Ctx): GraphStatement;
    lineEnd(_ctx: Ctx): undefined;
    blankLine(ctx: Ctx): GraphStatement;
    commentLine(ctx: Ctx): GraphStatement;
    accTitleStatement(ctx: Ctx): GraphStatement;
    accDescrStatement(ctx: Ctx): GraphStatement;
    actorStatement(ctx: Ctx): GraphStatement;
    actorItem(ctx: Ctx): ParsedActorItem;
    actorName(ctx: Ctx): ParsedActorItem;
    actorDeclarationOnly(ctx: Ctx): GraphStatement;
    entityStatement(ctx: Ctx): GraphStatement;
    entityName(ctx: Ctx): ParsedEntity;
    nodeLabel(ctx: Ctx): DraftLabel;
    useCaseMetadata(ctx: Ctx): DraftMetadata;
    relationTail(ctx: Ctx): ParsedRelationTail;
    arrow(ctx: Ctx): ParsedArrow;
    edgeLabel(ctx: Ctx): DraftLabel;
    semanticRelation(ctx: Ctx): ParsedArrow;
    metadata(ctx: Ctx): DraftMetadata;
    metadataProperty(ctx: Ctx): DraftMetadataProperty;
    metadataSeparator(_ctx: Ctx): undefined;
    systemBoundaryStatement(ctx: Ctx): GraphStatement;
    systemBoundaryName(ctx: Ctx): DraftBoundary;
    systemBoundaryContent(ctx: Ctx): GraphStatement[];
    boundaryElement(ctx: Ctx): GraphStatement;
    metadataAssignmentStatement(ctx: Ctx): GraphStatement;
    metadataAssignmentTarget(ctx: Ctx): {
        id: string;
        location: DraftLocation;
    };
    noteStatement(ctx: Ctx): GraphStatement;
    stereotype(ctx: Ctx): ParsedStereotype;
    classSuffix(ctx: Ctx): ParsedClassSuffix;
    jsonStatement(ctx: Ctx): GraphStatement;
    directionStatement(ctx: Ctx): GraphStatement;
    classDefStatement(ctx: Ctx): GraphStatement;
    classStatement(ctx: Ctx): GraphStatement;
    styleStatement(ctx: Ctx): GraphStatement;
    styles(ctx: Ctx): string[];
    styleValue(ctx: Ctx): string;
    styleComponent(ctx: Ctx): string;
    forwardSolidOperator(ctx: Ctx): ParsedArrow;
    backwardSolidOperator(ctx: Ctx): ParsedArrow;
    markerlessSolidOperator(ctx: Ctx): ParsedArrow;
    forwardCircleOperator(_ctx: Ctx): ParsedArrow;
    backwardCircleOperator(ctx: Ctx): ParsedArrow;
    forwardCrossOperator(_ctx: Ctx): ParsedArrow;
    backwardCrossOperator(ctx: Ctx): ParsedArrow;
    private actorDraft;
    private entityDraft;
    private endpoint;
    private relationshipDraft;
    private actorOccurrence;
    private entityOccurrence;
    private wrap;
    private tokenLabel;
    private decodePlain;
    private contentSpan;
    private generateId;
    private solidMinlen;
    private nodeLocation;
    private ctxLocation;
    private tokenLocation;
    private nodeSpan;
    private tokenSpan;
    private nodes;
    private tokens;
    private firstNode;
    private allTokens;
}
export declare const usecaseVisitor: UsecaseVisitor;
export {};
