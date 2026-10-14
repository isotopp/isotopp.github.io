import type { CstNode, CstParser, Lexer } from 'chevrotain';
interface ChevrotainParseConfig {
    diagramType: string;
    lexer: Lexer;
    parser: CstParser;
    entry: () => CstNode;
    visit: (cst: CstNode) => void;
}
/** Chevrotain marks missing locations (EOF, inserted tokens) with -1 (v13+) or NaN (older). */
export declare const isKnownLocation: (value: number | undefined) => value is number;
/** Runs a singleton lexer/parser pair and visits the resulting CST. */
export declare function runChevrotainParse(config: ChevrotainParseConfig, input: string): void;
export {};
