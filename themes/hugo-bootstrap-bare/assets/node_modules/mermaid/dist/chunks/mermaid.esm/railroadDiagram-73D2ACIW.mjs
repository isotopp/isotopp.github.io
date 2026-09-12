import {
  db,
  getStyles,
  renderer
} from "./chunk-C3UDNE5T.mjs";
import {
  populateCommonDb
} from "./chunk-6ZKBGPIT.mjs";
import {
  MermaidParseError
} from "./chunk-5EDX277H.mjs";
import "./chunk-WKU43CU3.mjs";
import "./chunk-2HS3KVXU.mjs";
import "./chunk-XOOU5E5Q.mjs";
import {
  createRailroadServices
} from "./chunk-SXDK7GA3.mjs";
import "./chunk-EQZMDKUZ.mjs";
import "./chunk-3MNNKFVW.mjs";
import "./chunk-X7XOBEZY.mjs";
import "./chunk-4H32FQV7.mjs";
import "./chunk-BDBCVAR5.mjs";
import "./chunk-ZD6PRSSI.mjs";
import "./chunk-FQ2WY6HO.mjs";
import "./chunk-MGNMQO6E.mjs";
import "./chunk-Z53TCUM2.mjs";
import "./chunk-AQRBQPRI.mjs";
import "./chunk-Z2I5LGMO.mjs";
import "./chunk-W5JXREIF.mjs";
import "./chunk-Y5RK4UJQ.mjs";
import "./chunk-AHS5MEEA.mjs";
import {
  log
} from "./chunk-X5WJYYCX.mjs";
import {
  __name
} from "./chunk-PTVI3W5X.mjs";

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
