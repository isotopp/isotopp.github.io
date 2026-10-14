import {
  db,
  getStyles,
  renderer
} from "./chunk-7JZUCHNI.mjs";
import {
  populateCommonDb
} from "./chunk-X67BZSRO.mjs";
import {
  MermaidParseError
} from "./chunk-UOLPKQDX.mjs";
import "./chunk-GSKXJ5HP.mjs";
import "./chunk-ZNVHHPUW.mjs";
import "./chunk-UWAP2SB3.mjs";
import "./chunk-N4MLXEYH.mjs";
import "./chunk-35LWCMBR.mjs";
import "./chunk-OG2W3CY3.mjs";
import "./chunk-PFLNU6FT.mjs";
import {
  createRailroadServices
} from "./chunk-OYEFJUKB.mjs";
import "./chunk-DFH22MUF.mjs";
import "./chunk-GM6EOIBZ.mjs";
import "./chunk-PVJZUHH5.mjs";
import "./chunk-HNEZ3WHL.mjs";
import "./chunk-L2LWOXJX.mjs";
import "./chunk-5B6E75V7.mjs";
import "./chunk-II7VFZ6N.mjs";
import "./chunk-LKH355KK.mjs";
import "./chunk-CI7DDXBJ.mjs";
import "./chunk-DLUCIBNR.mjs";
import {
  log
} from "./chunk-OHNBJXQ2.mjs";
import {
  __name
} from "./chunk-35ZOQMXA.mjs";

// src/diagrams/railroad/parser/railroadParser.ts
var langiumParser = createRailroadServices().Railroad.parser.LangiumParser;
var transformExpression = /* @__PURE__ */ __name((expr) => {
  switch (expr.$type) {
    case "RailroadTerminalExpr":
      return {
        type: "terminal",
        value: expr.value
      };
    case "RailroadNonTerminalExpr":
      return {
        type: "nonterminal",
        name: expr.name
      };
    case "RailroadSpecialExpr":
      return {
        type: "special",
        text: expr.text
      };
    case "RailroadSequenceExpr": {
      const elements = expr.elements.map(transformExpression);
      return elements.length === 1 ? elements[0] : { type: "sequence", elements };
    }
    case "RailroadChoiceExpr": {
      const alternatives = expr.alternatives.map(transformExpression);
      return alternatives.length === 1 ? alternatives[0] : { type: "choice", alternatives };
    }
    case "RailroadOptionalExpr":
      return {
        type: "optional",
        element: transformExpression(expr.element)
      };
    case "RailroadOneOrMoreExpr":
      return {
        type: "repetition",
        element: transformExpression(expr.element),
        min: 1,
        max: Infinity
      };
    case "RailroadZeroOrMoreExpr":
      return {
        type: "repetition",
        element: transformExpression(expr.element),
        min: 0,
        max: Infinity
      };
    default:
      throw new Error(`Unsupported railroad expression: ${expr.$type}`);
  }
}, "transformExpression");
var transformRule = /* @__PURE__ */ __name((rule) => {
  return {
    name: rule.name,
    definition: transformExpression(rule.definition)
  };
}, "transformRule");
var populateDb = /* @__PURE__ */ __name((ast) => {
  populateCommonDb(ast, db);
  if (ast.title) {
    db.setTitle(ast.title);
  }
  ast.rules.map((rule) => db.addRule(transformRule(rule)));
}, "populateDb");
var parser = {
  parse: /* @__PURE__ */ __name((input) => {
    db.clear();
    log.debug("[Railroad Parser] Starting Langium parse");
    const result = langiumParser.parse(input);
    if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
      throw new MermaidParseError(result);
    }
    const ast = result.value;
    log.debug("[Railroad Parser] Parsed rules:", ast.rules.length);
    populateDb(ast);
    log.debug("[Railroad Parser] Parse complete");
  }, "parse"),
  parser: {
    yy: db
  }
};

// src/diagrams/railroad/railroadDiagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles: getStyles
};
var railroadDiagram_default = diagram;
export {
  railroadDiagram_default as default,
  diagram
};
