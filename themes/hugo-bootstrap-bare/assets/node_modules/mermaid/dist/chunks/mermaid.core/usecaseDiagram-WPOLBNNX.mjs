import {
  getDiagramElement
} from "./chunk-XXDRQBXY.mjs";
import {
  setupViewPortForSVG
} from "./chunk-VQ5W62QI.mjs";
import {
  getRegisteredLayoutAlgorithm,
  render
} from "./chunk-EJLWFMJV.mjs";
import "./chunk-DUW6YSOI.mjs";
import "./chunk-HNE4Q36P.mjs";
import "./chunk-WQQL4CDK.mjs";
import "./chunk-ZAUX2LTX.mjs";
import "./chunk-HAGFOTED.mjs";
import "./chunk-UHW7PFBP.mjs";
import {
  markdownToLines
} from "./chunk-AQDTSKZB.mjs";
import "./chunk-YZO67HFG.mjs";
import {
  hasPalette,
  isColorTheme,
  paletteSlotCount,
  safeLook
} from "./chunk-J5ZVWO5B.mjs";
import {
  utils_default
} from "./chunk-7S6XSTFO.mjs";
import {
  clear,
  defaultConfig_default,
  getAccDescription,
  getAccTitle,
  getConfig,
  getConfig2,
  getDiagramTitle,
  sanitizeText,
  setAccDescription,
  setAccTitle,
  setDiagramTitle
} from "./chunk-DSNLSHJZ.mjs";
import {
  log
} from "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/diagrams/common/parser/runChevrotainParse.ts
var isKnownLocation = /* @__PURE__ */ __name((value) => value !== void 0 && value >= 0, "isKnownLocation");
function runChevrotainParse(config, input) {
  const lexResult = config.lexer.tokenize(input);
  if (lexResult.errors.length > 0) {
    const lexError = lexResult.errors[0];
    const start = isKnownLocation(lexError.offset) ? lexError.offset : input.length;
    const end = start + (isKnownLocation(lexError.length) ? lexError.length : 0);
    throw new Error(
      `Error lexing ${config.diagramType} diagram: ${lexError.message} at line ${lexError.line ?? 1}, column ${lexError.column ?? 1} [${start},${end})`
    );
  }
  config.parser.input = lexResult.tokens;
  const cst = config.entry();
  if (config.parser.errors.length > 0) {
    throw new Error(
      `Error parsing ${config.diagramType} diagram: ${config.parser.errors[0].message}`
    );
  }
  config.visit(cst);
}
__name(runChevrotainParse, "runChevrotainParse");

// src/diagrams/usecase/usecaseTypes.ts
var ARROW_TYPE = {
  SOLID_ARROW: 0,
  BACK_ARROW: 1,
  LINE_SOLID: 2,
  CIRCLE_ARROW: 3,
  CROSS_ARROW: 4,
  CIRCLE_ARROW_REVERSED: 5,
  CROSS_ARROW_REVERSED: 6
};
var DEFAULT_DIRECTION = "LR";

// src/diagrams/usecase/usecaseDb.ts
var DEFAULT_USECASE_CONFIG = defaultConfig_default.usecase;
var createModel = /* @__PURE__ */ __name(() => ({
  actors: /* @__PURE__ */ new Map(),
  useCases: /* @__PURE__ */ new Map(),
  systemBoundaries: /* @__PURE__ */ new Map(),
  relationships: [],
  notes: /* @__PURE__ */ new Map(),
  jsonNodes: /* @__PURE__ */ new Map(),
  classDefs: /* @__PURE__ */ new Map(),
  symbols: /* @__PURE__ */ new Map(),
  direction: DEFAULT_DIRECTION,
  relationshipCounter: 0,
  noteCounter: 0,
  accTitle: "",
  accDescription: "",
  ast: void 0,
  config: structuredClone(DEFAULT_USECASE_CONFIG)
}), "createModel");
var assertCompleteModel = /* @__PURE__ */ __name((model) => {
  if (!(model.actors instanceof Map) || !(model.useCases instanceof Map) || !(model.systemBoundaries instanceof Map) || !Array.isArray(model.relationships) || !(model.notes instanceof Map) || !(model.jsonNodes instanceof Map) || !(model.classDefs instanceof Map) || !(model.symbols instanceof Map) || !["TB", "TD", "BT", "RL", "LR"].includes(model.direction) || !Number.isSafeInteger(model.relationshipCounter) || model.relationshipCounter < 0 || !Number.isSafeInteger(model.noteCounter) || model.noteCounter < 0 || typeof model.accTitle !== "string" || typeof model.accDescription !== "string" || !model.config) {
    throw new Error("Cannot commit an incomplete usecase model");
  }
}, "assertCompleteModel");
var state = createModel();
var getConfig3 = /* @__PURE__ */ __name(() => structuredClone(state.config), "getConfig");
var getAST = /* @__PURE__ */ __name(() => state.ast, "getAST");
var commit = /* @__PURE__ */ __name((model) => {
  const nextState = structuredClone(model);
  assertCompleteModel(nextState);
  const previousAccTitle = getAccTitle();
  const previousAccDescription = getAccDescription();
  try {
    setAccTitle(nextState.accTitle);
    setAccDescription(nextState.accDescription);
    state = nextState;
  } catch (error) {
    setAccTitle(previousAccTitle);
    setAccDescription(previousAccDescription);
    throw error;
  }
}, "commit");
var clear2 = /* @__PURE__ */ __name(() => {
  state = createModel();
  clear();
}, "clear");
var getActors = /* @__PURE__ */ __name(() => state.actors, "getActors");
var getActor = /* @__PURE__ */ __name((id) => state.actors.get(id), "getActor");
var getUseCases = /* @__PURE__ */ __name(() => state.useCases, "getUseCases");
var getUseCase = /* @__PURE__ */ __name((id) => state.useCases.get(id), "getUseCase");
var getSystemBoundaries = /* @__PURE__ */ __name(() => state.systemBoundaries, "getSystemBoundaries");
var getSystemBoundary = /* @__PURE__ */ __name((id) => state.systemBoundaries.get(id), "getSystemBoundary");
var getRelationships = /* @__PURE__ */ __name(() => state.relationships, "getRelationships");
var getNotes = /* @__PURE__ */ __name(() => state.notes, "getNotes");
var getNote = /* @__PURE__ */ __name((id) => state.notes.get(id), "getNote");
var getJsonNodes = /* @__PURE__ */ __name(() => state.jsonNodes, "getJsonNodes");
var getJsonNode = /* @__PURE__ */ __name((id) => state.jsonNodes.get(id), "getJsonNode");
var getClassDefs = /* @__PURE__ */ __name(() => state.classDefs, "getClassDefs");
var getClassDef = /* @__PURE__ */ __name((id) => state.classDefs.get(id), "getClassDef");
var getDirection = /* @__PURE__ */ __name(() => state.direction, "getDirection");
var getCompiledStyles = /* @__PURE__ */ __name((classNames2) => {
  const compiled = /* @__PURE__ */ new Map();
  for (const className of ["default", ...classNames2]) {
    const definition = state.classDefs.get(className);
    if (!definition) {
      continue;
    }
    for (const rawStyle of definition.styles) {
      const style = rawStyle.trim();
      const separator = style.indexOf(":");
      const property = (separator === -1 ? style : style.slice(0, separator)).trim();
      if (property) {
        compiled.set(property, style);
      }
    }
  }
  return [...compiled.values()];
}, "getCompiledStyles");
var escapeJsonPointerPart = /* @__PURE__ */ __name((part) => part.replaceAll("~", "~0").replaceAll("/", "~1"), "escapeJsonPointerPart");
var displayJsonScalar = /* @__PURE__ */ __name((value) => typeof value === "string" ? value : value === null ? "null" : String(value), "displayJsonScalar");
var flattenJsonRows = /* @__PURE__ */ __name((value, propertyOrder, sanitize = (cell) => cell) => {
  const rows = [];
  const append = /* @__PURE__ */ __name((key, accessibleKey, cellValue) => {
    rows.push({
      key: sanitize(key),
      accessibleKey: sanitize(accessibleKey),
      value: sanitize(cellValue)
    });
  }, "append");
  const visit = /* @__PURE__ */ __name((current, path, pointer) => {
    if (Array.isArray(current)) {
      if (current.length === 0) {
        append(path, path, "[]");
        return;
      }
      const scalarArray = current.every(
        (item) => item === null || ["string", "number", "boolean"].includes(typeof item)
      );
      if (scalarArray) {
        for (const [index, element] of current.entries()) {
          append(
            index === 0 ? path : "",
            path,
            displayJsonScalar(element)
          );
        }
        return;
      }
      for (const [index, element] of current.entries()) {
        visit(element, `${path}[${index}]`, `${pointer}/${index}`);
      }
      return;
    }
    if (current !== null && typeof current === "object") {
      const object = current;
      const keys = propertyOrder[pointer] ?? Object.keys(object);
      if (keys.length === 0) {
        append(path, path, "{}");
        return;
      }
      for (const key of keys) {
        const childPath = path ? `${path}.${key}` : key;
        visit(object[key], childPath, `${pointer}/${escapeJsonPointerPart(key)}`);
      }
      return;
    }
    append(path, path, displayJsonScalar(current));
  }, "visit");
  visit(value, "", "");
  return rows;
}, "flattenJsonRows");
var actorShape = /* @__PURE__ */ __name((actor) => {
  switch (actor.type) {
    case "hollow":
      return "usecaseActorHollow";
    case "awesome":
      return "usecaseActorAwesome";
    case "icon":
      return "usecaseActorIcon";
    case "normal":
      return "usecaseActor";
  }
}, "actorShape");
var useCaseShape = /* @__PURE__ */ __name((useCase) => {
  if (useCase.shape === "ellipse") {
    return useCase.business ? "usecaseBusiness" : "usecaseEllipse";
  }
  return useCase.shape;
}, "useCaseShape");
var associationMarkers = /* @__PURE__ */ __name((arrowType) => {
  switch (arrowType) {
    case ARROW_TYPE.SOLID_ARROW:
      return { arrowTypeStart: "none", arrowTypeEnd: "arrow_point" };
    case ARROW_TYPE.BACK_ARROW:
      return { arrowTypeStart: "arrow_point", arrowTypeEnd: "none" };
    case ARROW_TYPE.CIRCLE_ARROW:
      return { arrowTypeStart: "none", arrowTypeEnd: "arrow_circle" };
    case ARROW_TYPE.CROSS_ARROW:
      return { arrowTypeStart: "none", arrowTypeEnd: "arrow_cross" };
    case ARROW_TYPE.CIRCLE_ARROW_REVERSED:
      return { arrowTypeStart: "arrow_circle", arrowTypeEnd: "none" };
    case ARROW_TYPE.CROSS_ARROW_REVERSED:
      return { arrowTypeStart: "arrow_cross", arrowTypeEnd: "none" };
    case ARROW_TYPE.LINE_SOLID:
      return { arrowTypeStart: "none", arrowTypeEnd: "none" };
  }
}, "associationMarkers");
var relationshipVisuals = /* @__PURE__ */ __name((relationship) => {
  switch (relationship.type) {
    case "include":
    case "extend":
      return {
        arrowTypeStart: "none",
        arrowTypeEnd: "arrow_point",
        pattern: "dotted",
        label: relationship.type,
        labelType: "text"
      };
    case "generalization":
      return {
        arrowTypeStart: "none",
        arrowTypeEnd: "extension",
        pattern: "solid"
      };
    case "association":
      return {
        ...associationMarkers(relationship.arrowType),
        pattern: "solid",
        ...relationship.label ? { label: relationship.label } : {},
        ...relationship.labelType ? { labelType: relationship.labelType } : {}
      };
  }
}, "relationshipVisuals");
var animationClasses = /* @__PURE__ */ __name((relationship) => relationship.animate || relationship.animation ? [`edge-animation-${relationship.animation ?? "fast"}`] : [], "animationClasses");
var classNames = /* @__PURE__ */ __name((...names) => names.filter((name) => Boolean(name)).join(" "), "classNames");
var getData = /* @__PURE__ */ __name(() => {
  const globalConfig = getConfig2();
  const config = {
    ...state.config,
    ...globalConfig.usecase
  };
  const sanitize = /* @__PURE__ */ __name((value) => sanitizeText(value, globalConfig), "sanitize");
  const endpointLabel = /* @__PURE__ */ __name((id) => sanitize(
    state.actors.get(id)?.label ?? state.useCases.get(id)?.label ?? state.jsonNodes.get(id)?.id ?? state.notes.get(id)?.label ?? id
  ), "endpointLabel");
  const nodes = [];
  const edges = [];
  let colorIndex = 0;
  let boundaryColorIndex = 0;
  for (const actor of state.actors.values()) {
    nodes.push({
      id: actor.id,
      label: sanitize(actor.label),
      labelType: actor.labelType,
      shape: actorShape(actor),
      isGroup: false,
      padding: 10,
      look: globalConfig.look,
      colorIndex: colorIndex++,
      cssClasses: classNames(
        "default",
        "usecase-actor",
        `usecase-actor-${actor.type}`,
        actor.business && "usecase-business",
        ...actor.classes
      ),
      cssStyles: [...actor.styles],
      cssCompiledStyles: getCompiledStyles(actor.classes),
      actorType: actor.type,
      business: actor.business,
      ...actor.icon ? { icon: actor.icon } : {},
      ...actor.stereotype ? { stereotype: sanitize(actor.stereotype) } : {},
      ...actor.parentId ? { parentId: actor.parentId } : {}
    });
  }
  for (const useCase of state.useCases.values()) {
    nodes.push({
      id: useCase.id,
      label: sanitize(useCase.label),
      labelType: useCase.labelType,
      shape: useCaseShape(useCase),
      isGroup: false,
      padding: useCase.shape === "ellipse" ? 20 : 10,
      look: globalConfig.look,
      colorIndex: colorIndex++,
      cssClasses: classNames(
        "default",
        "usecase-element",
        `usecase-${useCase.shape}`,
        useCase.business && "usecase-business",
        ...useCase.classes
      ),
      cssStyles: [...useCase.styles],
      cssCompiledStyles: getCompiledStyles(useCase.classes),
      business: useCase.business,
      ...useCase.stereotype ? { stereotype: sanitize(useCase.stereotype) } : {},
      ...useCase.parentId ? { parentId: useCase.parentId } : {}
    });
  }
  for (const note of state.notes.values()) {
    nodes.push({
      id: note.id,
      label: sanitize(note.label),
      labelType: note.labelType,
      shape: "note",
      isGroup: false,
      padding: 10,
      look: globalConfig.look,
      cssClasses: "default usecase-note",
      cssStyles: [],
      cssCompiledStyles: getCompiledStyles([]),
      noteTarget: note.target,
      noteTargetLabel: sanitize(
        state.actors.get(note.target)?.label ?? state.useCases.get(note.target)?.label ?? state.jsonNodes.get(note.target)?.id ?? note.target
      )
    });
  }
  for (const json of state.jsonNodes.values()) {
    nodes.push({
      id: json.id,
      label: sanitize(json.id),
      labelType: "text",
      shape: "usecaseJsonTable",
      isGroup: false,
      padding: 10,
      look: globalConfig.look,
      cssClasses: classNames("default", "usecase-json-table", ...json.classes),
      cssStyles: [...json.styles],
      cssCompiledStyles: getCompiledStyles(json.classes),
      jsonRows: flattenJsonRows(json.value, json.propertyOrder, sanitize)
    });
  }
  for (const boundary of state.systemBoundaries.values()) {
    nodes.push({
      id: boundary.id,
      label: sanitize(boundary.label),
      labelType: boundary.labelType,
      shape: "usecaseSystemBoundary",
      isGroup: true,
      padding: 20,
      look: globalConfig.look,
      colorIndex: boundaryColorIndex++,
      cssClasses: classNames(
        "default",
        "system-boundary",
        `system-boundary-${boundary.type}`,
        ...boundary.classes
      ),
      cssStyles: [...boundary.styles],
      cssCompiledStyles: getCompiledStyles(boundary.classes),
      boundaryType: boundary.type
    });
  }
  for (const relationship of state.relationships) {
    const { label: rawLabel, ...visual } = relationshipVisuals(relationship);
    edges.push({
      id: relationship.id,
      start: relationship.source,
      end: relationship.target,
      source: relationship.source,
      target: relationship.target,
      sourceLabel: endpointLabel(relationship.source),
      targetLabel: endpointLabel(relationship.target),
      type: "edge",
      relationshipType: relationship.type,
      internal: false,
      ...visual,
      ...rawLabel !== void 0 ? { label: sanitize(rawLabel) } : {},
      labelpos: "c",
      classes: classNames(
        "default",
        "relationship",
        `relationship-${relationship.type}`,
        ...relationship.classes,
        ...animationClasses(relationship)
      ),
      style: [...relationship.styles],
      cssCompiledStyles: getCompiledStyles(relationship.classes),
      animate: relationship.animate,
      ...relationship.animation ? { animation: relationship.animation } : {},
      look: globalConfig.look,
      thickness: "normal",
      minlen: relationship.minlen,
      isUserDefinedId: relationship.explicitId
    });
  }
  for (const note of state.notes.values()) {
    edges.push({
      id: `${note.id}-edge`,
      start: note.id,
      end: note.target,
      source: note.id,
      target: note.target,
      type: "edge",
      relationshipType: "note",
      sourceLabel: endpointLabel(note.id),
      targetLabel: endpointLabel(note.target),
      internal: true,
      pattern: "dotted",
      arrowTypeStart: "none",
      arrowTypeEnd: "none",
      labelpos: "c",
      classes: "default relationship relationship-note",
      style: [],
      cssCompiledStyles: getCompiledStyles([]),
      animate: false,
      look: globalConfig.look,
      thickness: "normal",
      minlen: 1,
      isUserDefinedId: false
    });
  }
  for (const node of nodes) {
    node.wrappingWidth ??= config.wrappingWidth;
    if (!node.isGroup && !node.shape.startsWith("usecaseActor")) {
      node.minWidth ??= config.minNodeWidth;
    }
    if (node.shape === "usecaseEllipse" || node.shape === "usecaseBusiness") {
      node.spreadPorts = true;
    }
  }
  return {
    nodes,
    edges,
    config: globalConfig,
    type: "usecase",
    layoutAlgorithm: "dagre",
    direction: getDirection(),
    nodeSpacing: config.nodeSpacing,
    rankSpacing: config.rankSpacing,
    actorFontSize: config.actorFontSize,
    actorFontFamily: config.actorFontFamily,
    actorFontWeight: config.actorFontWeight,
    usecaseFontSize: config.usecaseFontSize,
    usecaseFontFamily: config.usecaseFontFamily,
    usecaseFontWeight: config.usecaseFontWeight,
    diagramPadding: config.diagramPadding,
    useMaxWidth: config.useMaxWidth,
    markers: ["point", "circle", "cross", "extension"]
  };
}, "getData");
var db = {
  getConfig: getConfig3,
  createModel,
  commit,
  getAST,
  clear: clear2,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,
  getActors,
  getActor,
  getUseCases,
  getUseCase,
  getSystemBoundaries,
  getSystemBoundary,
  getRelationships,
  getNotes,
  getNote,
  getJsonNodes,
  getJsonNode,
  getClassDefs,
  getClassDef,
  getDirection,
  getData
};

// src/diagrams/usecase/parser/usecase.lexer.ts
import { Lexer as Lexer2 } from "chevrotain";

// src/diagrams/usecase/parser/usecase.tokens.ts
import { createToken, Lexer } from "chevrotain";
function customMatch(text, offset, image) {
  const match = [image];
  match.index = offset;
  match.input = text;
  return match;
}
__name(customMatch, "customMatch");
var matchMarkdownString = /* @__PURE__ */ __name((text, offset) => {
  if (text[offset] !== '"' || text[offset + 1] !== "`") {
    return null;
  }
  for (let index = offset + 2; index < text.length - 1; index++) {
    if (text[index] === "`" && text[index + 1] === '"') {
      return customMatch(text, offset, text.slice(offset, index + 2));
    }
  }
  return null;
}, "matchMarkdownString");
var matchComment = /* @__PURE__ */ __name((text, offset) => {
  if (text[offset] !== "%" || text[offset + 1] !== "%") {
    return null;
  }
  for (let index = offset - 1; index >= 0; index--) {
    const character = text[index];
    if (character === "\n" || character === "\r") {
      break;
    }
    if (character !== " " && character !== "	") {
      return null;
    }
  }
  let end = offset + 2;
  while (end < text.length && text[end] !== "\n" && text[end] !== "\r") {
    end++;
  }
  return customMatch(text, offset, text.slice(offset, end));
}, "matchComment");
var isIndentedLineStart = /* @__PURE__ */ __name((text, offset) => {
  for (let index = offset - 1; index >= 0; index--) {
    const character = text[index];
    if (character === "\n" || character === "\r") {
      return true;
    }
    if (character !== " " && character !== "	") {
      return false;
    }
  }
  return true;
}, "isIndentedLineStart");
var matchAccessibilityLine = /* @__PURE__ */ __name((text, offset, pattern) => {
  if (!isIndentedLineStart(text, offset)) {
    return null;
  }
  const match = pattern.exec(text.slice(offset));
  return match ? customMatch(text, offset, match[0]) : null;
}, "matchAccessibilityLine");
var matchAccDescrBlock = /* @__PURE__ */ __name((text, offset) => {
  if (!isIndentedLineStart(text, offset)) {
    return null;
  }
  const opening = /^accDescr[\t ]*{/.exec(text.slice(offset));
  if (!opening) {
    return null;
  }
  const end = text.indexOf("}", offset + opening[0].length);
  return end === -1 ? null : customMatch(text, offset, text.slice(offset, end + 1));
}, "matchAccDescrBlock");
var matchJsonObject = /* @__PURE__ */ __name((text, offset) => {
  if (text[offset] !== "{") {
    return null;
  }
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = offset; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        quoted = false;
      }
      continue;
    }
    if (character === '"') {
      quoted = true;
    } else if (character === "{") {
      depth++;
    } else if (character === "}" && --depth === 0) {
      return customMatch(text, offset, text.slice(offset, index + 1));
    }
  }
  return null;
}, "matchJsonObject");
var matchStereotypeText = /* @__PURE__ */ __name((text, offset) => {
  const end = text.indexOf(">>", offset);
  if (end === -1 || /[\n\r]/.test(text.slice(offset, end))) {
    return null;
  }
  const image = text.slice(offset, end);
  return image.trim() ? customMatch(text, offset, image) : null;
}, "matchStereotypeText");
var LabelText = createToken({ name: "LABEL_TEXT", pattern: Lexer.NA });
var Word = createToken({ name: "WORD", pattern: Lexer.NA, categories: LabelText });
var NumberLiteral = createToken({
  name: "NUMBER",
  pattern: /(?:\d+\.\d+|\d+|\.\d+)(?:[A-Za-z]+)?/,
  categories: LabelText
});
var Identifier = createToken({
  name: "IDENTIFIER",
  pattern: /\w+/,
  longer_alt: NumberLiteral,
  categories: Word
});
var WhiteSpace = createToken({
  name: "HWS",
  pattern: /[\t ]+/,
  group: Lexer.SKIPPED
});
var MarkdownString = createToken({
  name: "MARKDOWN_STRING",
  pattern: matchMarkdownString,
  start_chars_hint: ['"'],
  line_breaks: true
});
var UnclosedMarkdownString = createToken({
  name: "UNCLOSED_MARKDOWN_STRING",
  pattern: /"`[^]*/,
  line_breaks: true
});
var Comment = createToken({
  name: "COMMENT",
  pattern: matchComment,
  start_chars_hint: ["%"],
  line_breaks: false
});
var NewLine = createToken({
  name: "NEWLINE",
  pattern: /\r\n|\n|\r/,
  line_breaks: true
});
var AccDescrBlock = createToken({
  name: "ACC_DESCR_BLOCK",
  pattern: matchAccDescrBlock,
  start_chars_hint: ["a"],
  line_breaks: true
});
var accTitleLinePattern = /^accTitle[\t ]*:[^\n\r]*/;
var accDescrLinePattern = /^accDescr[\t ]*:[^\n\r]*/;
var AccTitleLine = createToken({
  name: "ACC_TITLE_LINE",
  pattern: /* @__PURE__ */ __name((text, offset) => matchAccessibilityLine(text, offset, accTitleLinePattern), "pattern"),
  start_chars_hint: ["a"],
  line_breaks: false
});
var AccDescrLine = createToken({
  name: "ACC_DESCR_LINE",
  pattern: /* @__PURE__ */ __name((text, offset) => matchAccessibilityLine(text, offset, accDescrLinePattern), "pattern"),
  start_chars_hint: ["a"],
  line_breaks: false
});
var JsonDeclarationStart = createToken({
  name: "JSON_DECLARATION_START",
  pattern: /json[\t ]+\w+[\t ]*@[\t ]*(?={)/,
  push_mode: "jsonBody"
});
var JsonObjectLiteral = createToken({
  name: "JSON_OBJECT_LITERAL",
  pattern: matchJsonObject,
  start_chars_hint: ["{"],
  line_breaks: true,
  pop_mode: true
});
var UnclosedJsonObjectLiteral = createToken({
  name: "UNCLOSED_JSON_OBJECT_LITERAL",
  pattern: /{[^]*/,
  line_breaks: true,
  pop_mode: true
});
var keyword = /* @__PURE__ */ __name((name, pattern) => createToken({ name, pattern, longer_alt: Identifier, categories: Word }), "keyword");
var Usecase = keyword("USECASE", /usecase-beta/);
var Actor = keyword("ACTOR", /actor/);
var SystemBoundary = keyword("SYSTEM_BOUNDARY", /systemBoundary/);
var End = keyword("END", /end/);
var Direction = keyword("DIRECTION", /direction/);
var Td = keyword("TD", /TD/);
var Tb = keyword("TB", /TB/);
var Bt = keyword("BT", /BT/);
var Lr = keyword("LR", /LR/);
var Rl = keyword("RL", /RL/);
var Note = keyword("NOTE", /note/);
var For = keyword("FOR", /for/);
var Json = keyword("JSON", /json/);
var ClassDef = keyword("CLASS_DEF", /classDef/);
var Class = keyword("CLASS", /class/);
var Style = keyword("STYLE", /style/);
var Include = keyword("INCLUDE", /include/i);
var Extend = keyword("EXTEND", /extend/i);
var True = keyword("TRUE", /true/);
var False = keyword("FALSE", /false/);
var Generalization = createToken({ name: "GENERALIZATION", pattern: /--\|>/ });
var DependencyArrow = createToken({ name: "DEPENDENCY_ARROW", pattern: /\.\.>/ });
var StereotypeStart = createToken({
  name: "STEREOTYPE_START",
  pattern: /<</,
  push_mode: "stereotype"
});
var StereotypeEnd = createToken({
  name: "STEREOTYPE_END",
  pattern: />>/,
  pop_mode: true
});
var StereotypeText = createToken({
  name: "STEREOTYPE_TEXT",
  pattern: matchStereotypeText,
  line_breaks: false
});
var UnclosedStereotypeText = createToken({
  name: "UNCLOSED_STEREOTYPE_TEXT",
  pattern: /[^\n\r]+/,
  line_breaks: false,
  pop_mode: true
});
var ClassSeparator = createToken({ name: "CLASS_SEPARATOR", pattern: /:::/ });
var ForwardSolid = createToken({ name: "FORWARD_SOLID", pattern: /--+>/ });
var BackwardSolid = createToken({ name: "BACKWARD_SOLID", pattern: /<--+/ });
var ForwardCircle = createToken({ name: "FORWARD_CIRCLE", pattern: /--o/ });
var BackwardCircle = createToken({ name: "BACKWARD_CIRCLE", pattern: /o--/ });
var ForwardCross = createToken({ name: "FORWARD_CROSS", pattern: /--x/ });
var BackwardCross = createToken({ name: "BACKWARD_CROSS", pattern: /x--/ });
var MarkerlessSolid = createToken({ name: "MARKERLESS_SOLID", pattern: /--+/ });
var MetadataStart = createToken({ name: "METADATA_START", pattern: /@{/ });
var At = createToken({ name: "AT", pattern: /@/, categories: LabelText });
var LeftBrace = createToken({ name: "LBRACE", pattern: /{/ });
var RightBrace = createToken({ name: "RBRACE", pattern: /}/ });
var LeftBracket = createToken({ name: "LBRACKET", pattern: /\[/ });
var RightBracket = createToken({ name: "RBRACKET", pattern: /]/ });
var LeftParen = createToken({ name: "LPAREN", pattern: /\(/ });
var RightParen = createToken({ name: "RPAREN", pattern: /\)/ });
var Comma = createToken({ name: "COMMA", pattern: /,/, categories: LabelText });
var Colon = createToken({ name: "COLON", pattern: /:/, categories: LabelText });
var HashColor = createToken({
  name: "HASH_COLOR",
  pattern: /#[\dA-Fa-f]+/,
  categories: LabelText
});
var PlainString = createToken({
  name: "PLAIN_STRING",
  pattern: /"[^\n\r"]*"|'[^\n\r']*'/
});
var CssIdentifier = createToken({
  name: "CSS_IDENTIFIER",
  pattern: /--[A-Z_a-z][\w-]*|[A-Z_a-z]\w*(?:-\w+)+/,
  categories: LabelText
});
var CssEscapedComma = createToken({
  name: "CSS_ESCAPED_COMMA",
  pattern: /\\,/,
  categories: LabelText
});
var Dash = createToken({ name: "DASH", pattern: /-/, categories: LabelText });
var Dot = createToken({ name: "DOT", pattern: /\./, categories: LabelText });
var Percent = createToken({ name: "PERCENT", pattern: /%/, categories: LabelText });
var CssPunctuation = createToken({
  name: "CSS_PUNCTUATION",
  pattern: /[!#$&*+/=?^_|~]/,
  categories: LabelText
});
var LabelPunctuation = createToken({
  name: "LABEL_PUNCTUATION",
  pattern: /[;<>\\`]/,
  categories: LabelText
});
var LabelSymbol = createToken({
  name: "LABEL_SYMBOL",
  pattern: /[^\t\n\r !-~]+/,
  categories: LabelText
});
var defaultModeTokens = [
  LabelText,
  Word,
  WhiteSpace,
  MarkdownString,
  UnclosedMarkdownString,
  Comment,
  NewLine,
  AccDescrBlock,
  AccTitleLine,
  AccDescrLine,
  JsonDeclarationStart,
  Usecase,
  Actor,
  SystemBoundary,
  End,
  Direction,
  Td,
  Tb,
  Bt,
  Lr,
  Rl,
  Note,
  For,
  Json,
  ClassDef,
  Class,
  Style,
  Include,
  Extend,
  True,
  False,
  Generalization,
  DependencyArrow,
  StereotypeStart,
  ClassSeparator,
  ForwardSolid,
  BackwardSolid,
  ForwardCircle,
  BackwardCircle,
  ForwardCross,
  BackwardCross,
  MarkerlessSolid,
  MetadataStart,
  At,
  LeftBrace,
  RightBrace,
  LeftBracket,
  RightBracket,
  LeftParen,
  RightParen,
  Comma,
  Colon,
  HashColor,
  PlainString,
  CssIdentifier,
  // IDENTIFIER precedes NUMBER so `1mg` lexes as one id; its longer_alt still hands
  // decimals like `1.5px` to NUMBER.
  Identifier,
  NumberLiteral,
  CssEscapedComma,
  Dash,
  Dot,
  Percent,
  CssPunctuation,
  // Both fallbacks stay last so every operator, delimiter, and string form wins first.
  LabelPunctuation,
  LabelSymbol
];
var usecaseLexerModes = {
  defaultMode: "defaultMode",
  modes: {
    defaultMode: [...defaultModeTokens],
    jsonBody: [JsonObjectLiteral, UnclosedJsonObjectLiteral],
    stereotype: [StereotypeEnd, StereotypeText, UnclosedStereotypeText]
  }
};
var usecaseTokens = [
  ...defaultModeTokens,
  JsonObjectLiteral,
  UnclosedJsonObjectLiteral,
  StereotypeEnd,
  StereotypeText,
  UnclosedStereotypeText
];

// src/diagrams/usecase/parser/usecase.lexer.ts
var usecaseLexer = new Lexer2(usecaseLexerModes);

// src/diagrams/usecase/parser/usecase.parser.ts
import { CstParser, EOF, tokenMatcher } from "chevrotain";
var isLabelToken = /* @__PURE__ */ __name((token) => tokenMatcher(token, LabelText) || token.tokenType === PlainString || token.tokenType === MarkdownString, "isLabelToken");
var forbiddenPlantUmlStatements = {
  allowmixing: true,
  newpage: true,
  package: true,
  rectangle: true,
  skinparam: true
};
var UsecaseParser = class extends CstParser {
  static {
    __name(this, "UsecaseParser");
  }
  constructor() {
    super(usecaseTokens, { nodeLocationTracking: "full" });
    this.RULE("start", () => {
      this.CONSUME(Usecase);
      this.SUBRULE(this.lineEnd);
      this.MANY(() => this.SUBRULE(this.line));
    });
    this.RULE("line", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.blankLine), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.commentLine), "ALT") },
        {
          GATE: /* @__PURE__ */ __name(() => this.isStatementStart(), "GATE"),
          ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.statement), "ALT")
        }
      ]);
    });
    this.RULE("statement", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.accTitleStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.accDescrStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.directionStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.actorStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.systemBoundaryStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.noteStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.jsonStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.classDefStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.classStatement), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.styleStatement), "ALT") },
        {
          GATE: /* @__PURE__ */ __name(() => this.isMetadataAssignment(), "GATE"),
          ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.metadataAssignmentStatement), "ALT")
        },
        {
          GATE: /* @__PURE__ */ __name(() => !this.isForbiddenPlantUmlStatement(), "GATE"),
          ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.entityStatement), "ALT")
        }
      ]);
    });
    this.RULE("lineEnd", () => {
      this.OR([{ ALT: /* @__PURE__ */ __name(() => this.CONSUME(NewLine), "ALT") }, { ALT: /* @__PURE__ */ __name(() => this.CONSUME(EOF), "ALT") }]);
    });
    this.RULE("blankLine", () => {
      this.CONSUME(NewLine);
    });
    this.RULE("commentLine", () => {
      this.CONSUME(Comment);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("accTitleStatement", () => {
      this.CONSUME(AccTitleLine);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("accDescrStatement", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(AccDescrLine), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(AccDescrBlock), "ALT") }
      ]);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("actorStatement", () => {
      this.CONSUME(Actor);
      this.SUBRULE(this.actorItem);
      this.OPTION(() => {
        this.OR([
          {
            ALT: /* @__PURE__ */ __name(() => this.AT_LEAST_ONE(() => {
              this.CONSUME(Comma);
              this.SUBRULE2(this.actorItem);
            }), "ALT")
          },
          { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.relationTail), "ALT") }
        ]);
      });
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("actorItem", () => {
      this.SUBRULE(this.actorName);
      this.OPTION(() => this.SUBRULE(this.metadata));
      this.OPTION2(() => this.SUBRULE(this.stereotype));
      this.OPTION3(() => this.SUBRULE(this.classSuffix));
    });
    this.RULE("actorName", () => {
      this.OR([
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(Identifier);
            this.OPTION(() => {
              this.CONSUME(LeftParen);
              this.SUBRULE(this.nodeLabel);
              this.CONSUME(RightParen);
            });
          }, "ALT")
        },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") }
      ]);
    });
    this.RULE("actorDeclarationOnly", () => {
      this.CONSUME(Actor);
      this.SUBRULE(this.actorItem);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.actorItem);
      });
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("entityStatement", () => {
      this.SUBRULE(this.entityName);
      this.OPTION(() => this.SUBRULE(this.relationTail));
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("entityName", () => {
      this.OR([
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(Identifier);
            this.OPTION(() => {
              this.OR2([
                {
                  ALT: /* @__PURE__ */ __name(() => {
                    this.CONSUME(LeftParen);
                    this.SUBRULE(this.nodeLabel);
                    this.CONSUME(RightParen);
                  }, "ALT")
                },
                {
                  ALT: /* @__PURE__ */ __name(() => {
                    this.CONSUME(LeftBracket);
                    this.SUBRULE2(this.nodeLabel);
                    this.CONSUME(RightBracket);
                  }, "ALT")
                }
              ]);
            });
          }, "ALT")
        },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") }
      ]);
      this.OPTION2(() => this.SUBRULE(this.useCaseMetadata));
      this.OPTION3(() => this.SUBRULE(this.stereotype));
      this.OPTION4(() => this.SUBRULE(this.classSuffix));
    });
    this.RULE("nodeLabel", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") },
        // Unquoted labels run until a delimiter, operator, or suffix marker, none of
        // which belong to `LabelText`. The visitor rebuilds the text from the source
        // slice, so the internal token split never reaches the model.
        { ALT: /* @__PURE__ */ __name(() => this.AT_LEAST_ONE(() => this.CONSUME(LabelText)), "ALT") }
      ]);
    });
    this.RULE("useCaseMetadata", () => {
      this.SUBRULE(this.metadata);
    });
    this.RULE("relationTail", () => {
      this.OPTION({
        GATE: /* @__PURE__ */ __name(() => this.LA(1).tokenType === Identifier && this.LA(2).tokenType === At, "GATE"),
        DEF: /* @__PURE__ */ __name(() => {
          this.CONSUME(Identifier);
          this.CONSUME(At);
        }, "DEF")
      });
      this.SUBRULE(this.arrow);
      this.SUBRULE(this.entityName);
    });
    this.RULE("arrow", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.semanticRelation), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.forwardSolidOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.backwardSolidOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.markerlessSolidOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.forwardCircleOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.backwardCircleOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.forwardCrossOperator), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.backwardCrossOperator), "ALT") }
      ]);
    });
    this.RULE("forwardSolidOperator", () => {
      this.CONSUME(ForwardSolid);
    });
    this.RULE("backwardSolidOperator", () => {
      this.CONSUME(BackwardSolid);
      this.OPTION({
        GATE: /* @__PURE__ */ __name(() => this.LA(0).image === "<--" && this.hasLabeledRight([MarkerlessSolid]), "GATE"),
        DEF: /* @__PURE__ */ __name(() => {
          this.SUBRULE(this.edgeLabel);
          this.CONSUME(MarkerlessSolid);
        }, "DEF")
      });
    });
    this.RULE("markerlessSolidOperator", () => {
      this.CONSUME(MarkerlessSolid);
      this.OPTION({
        GATE: /* @__PURE__ */ __name(() => this.LA(0).image === "--" && this.hasLabeledRight([ForwardSolid, MarkerlessSolid, ForwardCircle, ForwardCross]), "GATE"),
        DEF: /* @__PURE__ */ __name(() => {
          this.SUBRULE(this.edgeLabel);
          this.OR([
            { ALT: /* @__PURE__ */ __name(() => this.CONSUME(ForwardSolid), "ALT") },
            { ALT: /* @__PURE__ */ __name(() => this.CONSUME2(MarkerlessSolid), "ALT") },
            { ALT: /* @__PURE__ */ __name(() => this.CONSUME(ForwardCircle), "ALT") },
            { ALT: /* @__PURE__ */ __name(() => this.CONSUME(ForwardCross), "ALT") }
          ]);
        }, "DEF")
      });
    });
    this.RULE("forwardCircleOperator", () => {
      this.CONSUME(ForwardCircle);
    });
    this.RULE("backwardCircleOperator", () => {
      this.CONSUME(BackwardCircle);
      this.OPTION({
        GATE: /* @__PURE__ */ __name(() => this.hasLabeledRight([MarkerlessSolid]), "GATE"),
        DEF: /* @__PURE__ */ __name(() => {
          this.SUBRULE(this.edgeLabel);
          this.CONSUME(MarkerlessSolid);
        }, "DEF")
      });
    });
    this.RULE("forwardCrossOperator", () => {
      this.CONSUME(ForwardCross);
    });
    this.RULE("backwardCrossOperator", () => {
      this.CONSUME(BackwardCross);
      this.OPTION({
        GATE: /* @__PURE__ */ __name(() => this.hasLabeledRight([MarkerlessSolid]), "GATE"),
        DEF: /* @__PURE__ */ __name(() => {
          this.SUBRULE(this.edgeLabel);
          this.CONSUME(MarkerlessSolid);
        }, "DEF")
      });
    });
    this.RULE("edgeLabel", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.AT_LEAST_ONE(() => this.CONSUME(LabelText)), "ALT") }
      ]);
    });
    this.RULE("semanticRelation", () => {
      this.OR([
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(DependencyArrow);
            this.CONSUME(Colon);
            this.OR2([{ ALT: /* @__PURE__ */ __name(() => this.CONSUME(Include), "ALT") }, { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Extend), "ALT") }]);
          }, "ALT")
        },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Generalization), "ALT") }
      ]);
    });
    this.RULE("metadata", () => {
      this.CONSUME(MetadataStart);
      this.MANY(() => this.CONSUME(NewLine));
      this.OPTION(() => {
        this.SUBRULE(this.metadataProperty);
        this.MANY2(() => {
          this.SUBRULE(this.metadataSeparator);
          this.SUBRULE2(this.metadataProperty);
        });
        this.OPTION2(() => this.CONSUME(Comma));
        this.MANY3(() => this.CONSUME2(NewLine));
      });
      this.CONSUME(RightBrace);
    });
    this.RULE("metadataProperty", () => {
      this.OR([{ ALT: /* @__PURE__ */ __name(() => this.CONSUME(Identifier), "ALT") }, { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") }]);
      this.CONSUME(Colon);
      this.OR2([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME2(Identifier), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME2(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(True), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(False), "ALT") }
      ]);
    });
    this.RULE("metadataSeparator", () => {
      this.OR([
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(Comma);
            this.MANY(() => this.CONSUME(NewLine));
          }, "ALT")
        },
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.AT_LEAST_ONE(() => this.CONSUME2(NewLine));
            this.OPTION(() => this.CONSUME2(Comma));
            this.MANY2(() => this.CONSUME3(NewLine));
          }, "ALT")
        }
      ]);
    });
    this.RULE("systemBoundaryStatement", () => {
      this.CONSUME(SystemBoundary);
      this.SUBRULE(this.systemBoundaryName);
      this.OPTION(() => this.SUBRULE(this.metadata));
      this.OPTION2(() => this.SUBRULE(this.classSuffix));
      this.SUBRULE(this.lineEnd);
      this.SUBRULE(this.systemBoundaryContent);
      this.CONSUME(End);
      this.SUBRULE2(this.lineEnd);
    });
    this.RULE("systemBoundaryName", () => {
      this.OR([
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(Identifier);
            this.OPTION(() => {
              this.OR2([
                {
                  ALT: /* @__PURE__ */ __name(() => {
                    this.CONSUME(LeftParen);
                    this.SUBRULE(this.nodeLabel);
                    this.CONSUME(RightParen);
                  }, "ALT")
                },
                {
                  ALT: /* @__PURE__ */ __name(() => {
                    this.CONSUME(LeftBracket);
                    this.SUBRULE2(this.nodeLabel);
                    this.CONSUME(RightBracket);
                  }, "ALT")
                }
              ]);
            });
          }, "ALT")
        },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") }
      ]);
    });
    this.RULE("systemBoundaryContent", () => {
      this.MANY(() => {
        this.OR([
          { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.blankLine), "ALT") },
          { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.commentLine), "ALT") },
          { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.boundaryElement), "ALT") }
        ]);
      });
    });
    this.RULE("boundaryElement", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.SUBRULE(this.actorDeclarationOnly), "ALT") },
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.SUBRULE(this.entityName);
            this.SUBRULE(this.lineEnd);
          }, "ALT")
        }
      ]);
    });
    this.RULE("metadataAssignmentStatement", () => {
      this.SUBRULE(this.metadataAssignmentTarget);
      this.SUBRULE(this.metadata);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("metadataAssignmentTarget", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Identifier), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkdownString), "ALT") }
      ]);
    });
    this.RULE("noteStatement", () => {
      this.CONSUME(Note);
      this.CONSUME(For);
      this.CONSUME(Identifier);
      this.SUBRULE(this.nodeLabel);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("stereotype", () => {
      this.CONSUME(StereotypeStart);
      this.CONSUME(StereotypeText);
      this.CONSUME(StereotypeEnd);
    });
    this.RULE("classSuffix", () => {
      this.CONSUME(ClassSeparator);
      this.CONSUME(Identifier);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.CONSUME2(Identifier);
      });
    });
    this.RULE("jsonStatement", () => {
      this.CONSUME(JsonDeclarationStart);
      this.CONSUME(JsonObjectLiteral);
      this.OPTION(() => this.SUBRULE(this.classSuffix));
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("directionStatement", () => {
      this.CONSUME(Direction);
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Td), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Tb), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Bt), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Lr), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Rl), "ALT") }
      ]);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("classDefStatement", () => {
      this.CONSUME(ClassDef);
      this.CONSUME(Identifier);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.CONSUME2(Identifier);
      });
      this.SUBRULE(this.styles);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("classStatement", () => {
      this.CONSUME(Class);
      this.CONSUME(Identifier);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.CONSUME2(Identifier);
      });
      this.CONSUME3(Identifier);
      this.MANY2(() => {
        this.CONSUME2(Comma);
        this.CONSUME4(Identifier);
      });
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("styleStatement", () => {
      this.CONSUME(Style);
      this.CONSUME(Identifier);
      this.SUBRULE(this.styles);
      this.SUBRULE(this.lineEnd);
    });
    this.RULE("styles", () => {
      this.SUBRULE(this.styleValue);
      this.MANY(() => {
        this.CONSUME(Comma);
        this.SUBRULE2(this.styleValue);
      });
    });
    this.RULE("styleValue", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Word), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(CssIdentifier), "ALT") },
        {
          ALT: /* @__PURE__ */ __name(() => {
            this.CONSUME(MarkerlessSolid);
            this.CONSUME2(Word);
          }, "ALT")
        }
      ]);
      this.CONSUME(Colon);
      this.AT_LEAST_ONE(() => this.SUBRULE(this.styleComponent));
    });
    this.RULE("styleComponent", () => {
      this.OR([
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Word), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(PlainString), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(NumberLiteral), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(HashColor), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(CssIdentifier), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(CssEscapedComma), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Dash), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Dot), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Percent), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(CssPunctuation), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(Colon), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(LeftParen), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(RightParen), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(LeftBracket), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(RightBracket), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(LeftBrace), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(RightBrace), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(At), "ALT") },
        { ALT: /* @__PURE__ */ __name(() => this.CONSUME(MarkerlessSolid), "ALT") }
      ]);
    });
    this.performSelfAnalysis();
  }
  isMetadataAssignment() {
    const target = this.LA(1).tokenType;
    return (target === Identifier || target === PlainString || target === MarkdownString) && this.LA(2).tokenType === MetadataStart;
  }
  isStatementStart() {
    const tokenType = this.LA(1).tokenType;
    return tokenType !== EOF && tokenType !== NewLine && tokenType !== Comment;
  }
  isForbiddenPlantUmlStatement() {
    return this.LA(1).tokenType === Identifier && forbiddenPlantUmlStatements[this.LA(1).image.toLowerCase()] === true;
  }
  hasLabeledRight(allowed) {
    if (!isLabelToken(this.LA(1))) {
      return false;
    }
    for (let index = 2; ; index++) {
      const token = this.LA(index);
      if (allowed.includes(token.tokenType)) {
        return true;
      }
      if (!isLabelToken(token)) {
        return false;
      }
    }
  }
};
var usecaseParser = new UsecaseParser();

// src/diagrams/usecase/parser/usecaseJson.ts
var UsecaseJsonError = class extends Error {
  constructor(message, line, column) {
    super(`${message} (line ${line}, column ${column})`);
    this.line = line;
    this.column = column;
    this.name = "UsecaseJsonError";
  }
  static {
    __name(this, "UsecaseJsonError");
  }
};
var locationAtOffset = /* @__PURE__ */ __name((text, offset, startLine, startColumn) => {
  let line = startLine;
  let column = startColumn;
  const end = Math.min(Math.max(offset, 0), text.length);
  for (let index = 0; index < end; index++) {
    const character = text[index];
    if (character === "\r") {
      line++;
      column = 1;
    } else if (character === "\n") {
      if (index === 0 || text[index - 1] !== "\r") {
        line++;
        column = 1;
      }
    } else {
      column++;
    }
  }
  return { line, column };
}, "locationAtOffset");
var locationFromErrorMessage = /* @__PURE__ */ __name((message, text, startLine, startColumn) => {
  const position = /\bposition (\d+)\b/u.exec(message);
  if (position) {
    return locationAtOffset(text, Number.parseInt(position[1], 10), startLine, startColumn);
  }
  const localLocation = /\bline (\d+) column (\d+)\b/u.exec(message);
  if (localLocation) {
    const localLine = Number.parseInt(localLocation[1], 10);
    const localColumn = Number.parseInt(localLocation[2], 10);
    return {
      line: startLine + localLine - 1,
      column: localLine === 1 ? startColumn + localColumn - 1 : localColumn
    };
  }
  if (/unexpected end|end of json input/iu.test(message)) {
    return locationAtOffset(text, text.length, startLine, startColumn);
  }
  return void 0;
}, "locationFromErrorMessage");
var JsonWalkError = class extends Error {
  constructor(offset) {
    super("Invalid JSON token");
    this.offset = offset;
  }
  static {
    __name(this, "JsonWalkError");
  }
};
var PropertyOrderCollector = class {
  constructor(text) {
    this.text = text;
    this.offset = 0;
    this.propertyOrder = {};
  }
  static {
    __name(this, "PropertyOrderCollector");
  }
  collect() {
    this.skipWhitespace();
    this.collectValue("");
    this.skipWhitespace();
    if (this.offset !== this.text.length) {
      throw new JsonWalkError(this.offset);
    }
    return this.propertyOrder;
  }
  collectValue(pointer) {
    this.skipWhitespace();
    const character = this.text[this.offset];
    if (character === "{") {
      this.collectObject(pointer);
    } else if (character === "[") {
      this.collectArray(pointer);
    } else if (character === '"') {
      this.readString(false);
    } else if (character === "t") {
      this.consumeLiteral("true");
    } else if (character === "f") {
      this.consumeLiteral("false");
    } else if (character === "n") {
      this.consumeLiteral("null");
    } else if (character === "-" || character >= "0" && character <= "9") {
      this.consumeNumber();
    } else {
      throw new JsonWalkError(this.offset);
    }
  }
  collectObject(pointer) {
    this.offset++;
    const order = [];
    const seen = /* @__PURE__ */ new Set();
    this.propertyOrder[pointer] = order;
    this.skipWhitespace();
    if (this.text[this.offset] === "}") {
      this.offset++;
      return;
    }
    while (this.offset < this.text.length) {
      if (this.text[this.offset] !== '"') {
        throw new JsonWalkError(this.offset);
      }
      const property = this.readString(true);
      const propertyPointer = `${pointer}/${property.replaceAll("~", "~0").replaceAll("/", "~1")}`;
      if (seen.has(property)) {
        this.deletePointerSubtree(propertyPointer);
      } else {
        seen.add(property);
        order.push(property);
      }
      this.skipWhitespace();
      if (this.text[this.offset] !== ":") {
        throw new JsonWalkError(this.offset);
      }
      this.offset++;
      this.collectValue(propertyPointer);
      this.skipWhitespace();
      if (this.text[this.offset] === "}") {
        this.offset++;
        return;
      }
      if (this.text[this.offset] !== ",") {
        throw new JsonWalkError(this.offset);
      }
      this.offset++;
      this.skipWhitespace();
    }
    throw new JsonWalkError(this.offset);
  }
  collectArray(pointer) {
    this.offset++;
    this.skipWhitespace();
    if (this.text[this.offset] === "]") {
      this.offset++;
      return;
    }
    let index = 0;
    while (this.offset < this.text.length) {
      this.collectValue(`${pointer}/${index}`);
      index++;
      this.skipWhitespace();
      if (this.text[this.offset] === "]") {
        this.offset++;
        return;
      }
      if (this.text[this.offset] !== ",") {
        throw new JsonWalkError(this.offset);
      }
      this.offset++;
      this.skipWhitespace();
    }
    throw new JsonWalkError(this.offset);
  }
  readString(decode) {
    this.offset++;
    let value = "";
    while (this.offset < this.text.length) {
      const characterOffset = this.offset;
      const character = this.text[this.offset++];
      if (character === '"') {
        return value;
      }
      if (character.charCodeAt(0) < 32) {
        throw new JsonWalkError(characterOffset);
      }
      if (character !== "\\") {
        if (decode) {
          value += character;
        }
        continue;
      }
      const escapeOffset = this.offset;
      const escape = this.text[this.offset++];
      switch (escape) {
        case '"':
        case "\\":
        case "/":
          if (decode) {
            value += escape;
          }
          break;
        case "b":
          if (decode) {
            value += "\b";
          }
          break;
        case "f":
          if (decode) {
            value += "\f";
          }
          break;
        case "n":
          if (decode) {
            value += "\n";
          }
          break;
        case "r":
          if (decode) {
            value += "\r";
          }
          break;
        case "t":
          if (decode) {
            value += "	";
          }
          break;
        case "u": {
          const codeUnit = this.text.slice(this.offset, this.offset + 4);
          if (!/^[\dA-Fa-f]{4}$/u.test(codeUnit)) {
            throw new JsonWalkError(this.offset);
          }
          if (decode) {
            value += String.fromCharCode(Number.parseInt(codeUnit, 16));
          }
          this.offset += 4;
          break;
        }
        default:
          throw new JsonWalkError(escapeOffset);
      }
    }
    throw new JsonWalkError(this.offset);
  }
  consumeLiteral(literal) {
    let index = 0;
    for (const element of literal) {
      if (this.text[this.offset + index] !== element) {
        throw new JsonWalkError(this.offset + index);
      }
      index++;
    }
    this.offset += literal.length;
  }
  consumeNumber() {
    if (this.text[this.offset] === "-") {
      this.offset++;
    }
    if (this.text[this.offset] === "0") {
      this.offset++;
    } else if (this.text[this.offset] >= "1" && this.text[this.offset] <= "9") {
      while (this.text[this.offset] >= "0" && this.text[this.offset] <= "9") {
        this.offset++;
      }
    } else {
      throw new JsonWalkError(this.offset);
    }
    if (this.text[this.offset] === ".") {
      this.offset++;
      if (this.text[this.offset] < "0" || this.text[this.offset] > "9") {
        throw new JsonWalkError(this.offset);
      }
      while (this.text[this.offset] >= "0" && this.text[this.offset] <= "9") {
        this.offset++;
      }
    }
    if (this.text[this.offset] === "e" || this.text[this.offset] === "E") {
      this.offset++;
      if (this.text[this.offset] === "+" || this.text[this.offset] === "-") {
        this.offset++;
      }
      if (this.text[this.offset] < "0" || this.text[this.offset] > "9") {
        throw new JsonWalkError(this.offset);
      }
      while (this.text[this.offset] >= "0" && this.text[this.offset] <= "9") {
        this.offset++;
      }
    }
  }
  skipWhitespace() {
    while (this.offset < this.text.length) {
      const character = this.text[this.offset];
      if (character !== " " && character !== "	" && character !== "\n" && character !== "\r") {
        return;
      }
      this.offset++;
    }
  }
  deletePointerSubtree(pointer) {
    const descendantPrefix = `${pointer}/`;
    for (const existingPointer of Object.keys(this.propertyOrder)) {
      if (existingPointer === pointer || existingPointer.startsWith(descendantPrefix)) {
        delete this.propertyOrder[existingPointer];
      }
    }
  }
};
function parseOrderedJsonObject(jsonText, startLine, startColumn) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    let location = locationFromErrorMessage(message, jsonText, startLine, startColumn);
    if (!location) {
      let invalidOffset = 0;
      try {
        new PropertyOrderCollector(jsonText).collect();
      } catch (walkError) {
        if (walkError instanceof JsonWalkError) {
          invalidOffset = walkError.offset;
        }
      }
      location = locationAtOffset(jsonText, invalidOffset, startLine, startColumn);
    }
    throw new UsecaseJsonError(`Invalid JSON: ${message}`, location.line, location.column);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new UsecaseJsonError("JSON value must have an object root", startLine, startColumn);
  }
  return {
    value: parsed,
    propertyOrder: new PropertyOrderCollector(jsonText).collect()
  };
}
__name(parseOrderedJsonObject, "parseOrderedJsonObject");

// src/diagrams/usecase/usecaseAst.ts
var actorNode = /* @__PURE__ */ __name((actor) => ({
  shape: actor.type === "normal" ? "actor" : actor.type === "hollow" ? "actor-hollow" : actor.type === "awesome" ? "actor-awesome" : "actor-icon",
  ...actor.label === actor.id ? {} : { label: actor.label },
  ...actor.classes.length ? { classes: [...actor.classes] } : {},
  ...actor.styles.length ? { styles: [...actor.styles] } : {},
  attrs: {
    kind: "actor",
    actorType: actor.type,
    business: actor.business,
    labelType: actor.labelType,
    ...actor.icon ? { icon: actor.icon } : {},
    ...actor.stereotype ? { stereotype: actor.stereotype } : {},
    ...actor.parentId ? { parentId: actor.parentId } : {}
  }
}), "actorNode");
var useCaseNode = /* @__PURE__ */ __name((useCase) => ({
  shape: useCase.shape,
  ...useCase.label === useCase.id ? {} : { label: useCase.label },
  ...useCase.classes.length ? { classes: [...useCase.classes] } : {},
  ...useCase.styles.length ? { styles: [...useCase.styles] } : {},
  attrs: {
    kind: "usecase",
    useCaseShape: useCase.shape,
    business: useCase.business,
    labelType: useCase.labelType,
    ...useCase.stereotype ? { stereotype: useCase.stereotype } : {},
    ...useCase.parentId ? { parentId: useCase.parentId } : {}
  }
}), "useCaseNode");
var noteNode = /* @__PURE__ */ __name((note) => ({
  label: note.label,
  shape: "note",
  attrs: { kind: "note", target: note.target, labelType: note.labelType }
}), "noteNode");
var jsonNode = /* @__PURE__ */ __name((json) => ({
  label: json.id,
  shape: "json-table",
  ...json.classes.length ? { classes: [...json.classes] } : {},
  ...json.styles.length ? { styles: [...json.styles] } : {},
  attrs: { kind: "json", value: json.value, propertyOrder: json.propertyOrder, labelType: "text" }
}), "jsonNode");
var relationshipEdge = /* @__PURE__ */ __name((relationship) => ({
  id: relationship.id,
  source: relationship.source,
  target: relationship.target,
  ...relationship.label ? { label: relationship.label } : {},
  ...relationship.classes.length ? { classes: [...relationship.classes] } : {},
  ...relationship.styles.length ? { styles: [...relationship.styles] } : {},
  attrs: {
    relationshipType: relationship.type,
    arrowType: relationship.arrowType,
    minlen: relationship.minlen,
    explicitId: relationship.explicitId,
    animate: relationship.animate,
    ...relationship.animation ? { animation: relationship.animation } : {},
    ...relationship.labelType ? { labelType: relationship.labelType } : {}
  }
}), "relationshipEdge");
var noteEdge = /* @__PURE__ */ __name((note) => ({
  id: `${note.id}-edge`,
  source: note.id,
  target: note.target,
  attrs: {
    relationshipType: "note",
    arrowType: ARROW_TYPE.LINE_SOLID,
    pattern: "dotted",
    minlen: 1,
    explicitId: false,
    animate: false,
    internal: true
  }
}), "noteEdge");
var buildUsecaseGraphAST = /* @__PURE__ */ __name((model, source, headerSpan, statements) => {
  const nodes = {};
  for (const actor of model.getActors().values()) {
    nodes[actor.id] = actorNode(actor);
  }
  for (const useCase of model.getUseCases().values()) {
    nodes[useCase.id] = useCaseNode(useCase);
  }
  for (const note of model.getNotes().values()) {
    nodes[note.id] = noteNode(note);
  }
  for (const json of model.getJsonNodes().values()) {
    nodes[json.id] = jsonNode(json);
  }
  const groups = {};
  for (const boundary of model.getSystemBoundaries().values()) {
    groups[boundary.id] = {
      ...boundary.label === boundary.id ? {} : { title: boundary.label },
      nodes: [...boundary.members],
      ...boundary.classes.length ? { classes: [...boundary.classes] } : {},
      ...boundary.styles.length ? { styles: [...boundary.styles] } : {},
      attrs: {
        kind: "systemBoundary",
        boundaryType: boundary.type,
        labelType: boundary.labelType
      }
    };
  }
  const classDefs = {};
  for (const definition of model.getClassDefs().values()) {
    classDefs[definition.id] = { styles: [...definition.styles] };
  }
  const direction = model.getDirection();
  return {
    version: 1,
    diagramType: "usecase",
    source,
    header: {
      keyword: "usecase",
      direction: direction === "TD" ? "TB" : direction,
      span: headerSpan
    },
    ...model.getAccTitle() ? { accTitle: model.getAccTitle() } : {},
    ...model.getAccDescription() ? { accDescr: model.getAccDescription() } : {},
    nodes,
    edges: [
      ...model.getRelationships().map(relationshipEdge),
      ...[...model.getNotes().values()].map(noteEdge)
    ],
    groups,
    classDefs,
    statements
  };
}, "buildUsecaseGraphAST");

// src/diagrams/usecase/parser/usecaseModelBuilder.ts
var locationText = /* @__PURE__ */ __name((location) => `line ${location.line}, column ${location.column} [${location.span[0]},${location.span[1]})`, "locationText");
var labelSuffix = /* @__PURE__ */ __name((label) => label === void 0 ? "" : ` (label "${label}")`, "labelSuffix");
var generatedFrom = /* @__PURE__ */ __name((origin) => origin.generated ? origin.label : void 0, "generatedFrom");
var pushUnique = /* @__PURE__ */ __name((target, values) => {
  for (const value of values) {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}, "pushUnique");
var UsecaseModelBuilder = class {
  constructor(db2) {
    this.db = db2;
    this.source = "";
    this.statements = [];
    this.elements = [];
    this.boundaries = [];
    this.jsonDrafts = [];
    this.relationshipDrafts = [];
    this.noteDrafts = [];
    this.metadataAssignments = [];
    this.classAssignments = [];
    this.styleAssignments = [];
    this.classDefinitions = [];
    this.directions = [];
    this.model = db2.createModel();
  }
  static {
    __name(this, "UsecaseModelBuilder");
  }
  reset(source) {
    this.model = this.db.createModel();
    this.source = source;
    this.statements = [];
    this.elements.length = 0;
    this.boundaries.length = 0;
    this.jsonDrafts.length = 0;
    this.relationshipDrafts.length = 0;
    this.noteDrafts.length = 0;
    this.metadataAssignments.length = 0;
    this.classAssignments.length = 0;
    this.styleAssignments.length = 0;
    this.classDefinitions.length = 0;
    this.directions.length = 0;
  }
  addElement(value) {
    this.elements.push(value);
  }
  addBoundary(value) {
    this.boundaries.push(value);
  }
  addJson(value) {
    this.jsonDrafts.push(value);
  }
  addRelationship(value) {
    this.relationshipDrafts.push(value);
  }
  addNote(value) {
    this.noteDrafts.push(value);
  }
  addMetadataAssignment(target, targetLocation, metadata, statement) {
    this.metadataAssignments.push({ target, targetLocation, metadata, statement });
  }
  addClassDef(ids, styles) {
    this.classDefinitions.push({ ids, styles });
  }
  addClassAssignment(targets, classes) {
    this.classAssignments.push({ targets, classes });
  }
  addStyleAssignment(target, location, styles) {
    this.styleAssignments.push({ target, location, styles });
  }
  setDirection(direction) {
    this.directions.push(direction === "TD" ? "TB" : direction);
  }
  setAccTitle(title) {
    this.model.accTitle = title;
  }
  setAccDescription(description) {
    this.model.accDescription = description;
  }
  setStatements(statements) {
    this.statements = statements;
  }
  getActors() {
    return this.model.actors;
  }
  getUseCases() {
    return this.model.useCases;
  }
  getSystemBoundaries() {
    return this.model.systemBoundaries;
  }
  getRelationships() {
    return this.model.relationships;
  }
  getNotes() {
    return this.model.notes;
  }
  getJsonNodes() {
    return this.model.jsonNodes;
  }
  getClassDefs() {
    return this.model.classDefs;
  }
  getDirection() {
    return this.model.direction;
  }
  getAccTitle() {
    return this.model.accTitle;
  }
  getAccDescription() {
    return this.model.accDescription;
  }
  finalize(headerSpan) {
    const symbols = /* @__PURE__ */ new Map();
    const elements = /* @__PURE__ */ new Map();
    const boundaries = /* @__PURE__ */ new Map();
    const first = /* @__PURE__ */ new Map();
    for (const relation of this.relationshipDrafts) {
      this.recordFirst(first, relation.source.id, relation.source.location.span[0]);
      this.recordFirst(first, relation.target.id, relation.target.location.span[0]);
    }
    for (const draft of this.elements) {
      this.recordFirst(first, draft.id, draft.location.span[0]);
    }
    for (const draft of this.boundaries) {
      this.recordFirst(first, draft.id, draft.location.span[0]);
    }
    for (const draft of this.jsonDrafts) {
      this.recordFirst(first, draft.id, draft.location.span[0]);
    }
    const declarations = [
      ...this.elements.map((value) => ({
        offset: value.location.span[0],
        type: "element",
        value
      })),
      ...this.boundaries.map((value) => ({
        offset: value.location.span[0],
        type: "boundary",
        value
      })),
      ...this.jsonDrafts.map((value) => ({
        offset: value.location.span[0],
        type: "json",
        value
      })),
      ...this.relationshipDrafts.filter((value) => value.explicitId).map((value) => ({
        offset: value.explicitIdLocation.span[0],
        type: "edge",
        value
      }))
    ].sort((a, b) => a.offset - b.offset);
    for (const item of declarations) {
      if (item.type === "element") {
        this.collectElement(item.value, symbols, elements);
      } else if (item.type === "boundary") {
        this.collectBoundary(item.value, symbols, boundaries);
      } else if (item.type === "json") {
        this.registerUnique(symbols, item.value.id, "json", item.value.location, false);
      } else {
        this.registerUnique(
          symbols,
          item.value.explicitId,
          "edge",
          item.value.explicitIdLocation,
          false
        );
      }
    }
    this.materializeElements(elements, first);
    this.materializeBoundaries(boundaries, first);
    this.materializeJson(first);
    const edges = this.materializeRelationships(symbols, elements, first);
    this.reorderElements(elements, first);
    this.applyMetadataAssignments(symbols, elements, boundaries, edges);
    this.validateAndRefreshElements(elements);
    this.refreshBoundaries(boundaries, elements);
    this.materializeNotes(symbols);
    this.applyClassDefinitions();
    this.applyClassesAndStyles(symbols, edges);
    this.model.direction = this.directions.at(-1) ?? this.model.direction;
    this.model.symbols = new Map([...symbols].map(([id, origin]) => [id, origin.kind]));
    const ast = buildUsecaseGraphAST(this, this.source, headerSpan, this.statements);
    this.model.ast = ast;
    this.db.commit(this.model);
    return ast;
  }
  collectElement(draft, symbols, states) {
    const origin = symbols.get(draft.id);
    const draftLabel = generatedFrom({ generated: draft.generated, label: draft.label.text });
    if (origin && origin.kind !== draft.kind) {
      this.conflict(
        `ID '${draft.id}' is declared as both ${origin.kind} and ${draft.kind}`,
        draft.location,
        origin.location,
        draftLabel,
        generatedFrom(origin)
      );
    }
    if (origin && (origin.generated || draft.generated)) {
      this.conflict(
        `Generated ID '${draft.id}' collides with another declaration`,
        draft.location,
        origin.location,
        draftLabel,
        generatedFrom(origin)
      );
    }
    const existing = states.get(draft.id);
    if (!existing) {
      const state2 = {
        kind: draft.kind,
        id: draft.id,
        label: draft.label,
        location: draft.location,
        generated: draft.generated,
        classes: [...draft.classes],
        ...draft.parentId ? { parentId: draft.parentId, parentLocation: draft.parentLocation } : {},
        ...draft.shape ? { shape: draft.shape } : {},
        ...draft.stereotype ? { stereotype: draft.stereotype, stereotypeLocation: draft.location } : {}
      };
      this.applyDeclarationMetadata(state2, draft.metadata);
      states.set(draft.id, state2);
      symbols.set(draft.id, {
        kind: draft.kind,
        location: draft.location,
        generated: draft.generated,
        label: draft.label.text
      });
      return;
    }
    if (existing.label.text !== draft.label.text || existing.label.type !== draft.label.type) {
      this.conflict(`ID '${draft.id}' has conflicting labels`, draft.location, existing.location);
    }
    if (draft.shape && existing.shape && draft.shape !== existing.shape) {
      this.conflict(
        `Use case '${draft.id}' has conflicting shapes`,
        draft.location,
        existing.location
      );
    }
    if (draft.parentId && existing.parentId && draft.parentId !== existing.parentId) {
      this.conflict(
        `Element '${draft.id}' belongs to more than one system boundary`,
        draft.parentLocation ?? draft.location,
        existing.parentLocation ?? existing.location
      );
    }
    if (draft.stereotype && existing.stereotype && draft.stereotype !== existing.stereotype) {
      this.conflict(
        `Element '${draft.id}' has conflicting stereotypes`,
        draft.location,
        existing.stereotypeLocation ?? existing.location
      );
    }
    existing.shape ??= draft.shape;
    existing.parentId ??= draft.parentId;
    existing.parentLocation ??= draft.parentLocation;
    existing.stereotype ??= draft.stereotype;
    existing.stereotypeLocation ??= draft.stereotype ? draft.location : void 0;
    pushUnique(existing.classes, draft.classes);
    this.applyDeclarationMetadata(existing, draft.metadata);
  }
  collectBoundary(draft, symbols, states) {
    const origin = symbols.get(draft.id);
    const draftLabel = generatedFrom({ generated: draft.generated, label: draft.label.text });
    if (origin && origin.kind !== "boundary") {
      this.conflict(
        `ID '${draft.id}' is declared as both ${origin.kind} and boundary`,
        draft.location,
        origin.location,
        draftLabel,
        generatedFrom(origin)
      );
    }
    if (origin && (origin.generated || draft.generated)) {
      this.conflict(
        `Generated ID '${draft.id}' collides with another declaration`,
        draft.location,
        origin.location,
        draftLabel,
        generatedFrom(origin)
      );
    }
    const existing = states.get(draft.id);
    if (existing) {
      if (existing.label.text !== draft.label.text || existing.label.type !== draft.label.type) {
        this.conflict(
          `Boundary '${draft.id}' has conflicting titles`,
          draft.location,
          existing.location
        );
      }
      pushUnique(existing.classes, draft.classes);
      return;
    }
    states.set(draft.id, {
      id: draft.id,
      label: draft.label,
      location: draft.location,
      generated: draft.generated,
      classes: [...draft.classes],
      styles: [],
      members: []
    });
    symbols.set(draft.id, {
      kind: "boundary",
      location: draft.location,
      generated: draft.generated,
      label: draft.label.text
    });
  }
  materializeElements(states, first) {
    for (const state2 of [...states.values()].sort(
      (a, b) => (first.get(a.id) ?? 0) - (first.get(b.id) ?? 0)
    )) {
      this.setElementModel(state2);
    }
  }
  materializeBoundaries(states, first) {
    for (const state2 of [...states.values()].sort(
      (a, b) => (first.get(a.id) ?? 0) - (first.get(b.id) ?? 0)
    )) {
      this.model.systemBoundaries.set(state2.id, {
        id: state2.id,
        label: state2.label.text,
        labelType: state2.label.type,
        type: state2.type ?? "rect",
        members: [],
        classes: [...state2.classes],
        styles: [...state2.styles]
      });
    }
  }
  materializeJson(first) {
    for (const draft of [...this.jsonDrafts].sort(
      (a, b) => (first.get(a.id) ?? 0) - (first.get(b.id) ?? 0)
    )) {
      this.model.jsonNodes.set(draft.id, {
        id: draft.id,
        value: draft.value,
        propertyOrder: draft.propertyOrder,
        classes: [...draft.classes],
        styles: []
      });
    }
  }
  materializeRelationships(symbols, states, first) {
    const edges = /* @__PURE__ */ new Map();
    let anonymous = 0;
    for (const draft of this.relationshipDrafts) {
      const sourceKind = this.resolveEndpoint(draft.source, symbols, states, first);
      const targetKind = this.resolveEndpoint(draft.target, symbols, states, first);
      this.validateRelationship(draft, sourceKind, targetKind, symbols);
      const id = draft.explicitId ?? `edge-${anonymous++}`;
      const relationship = {
        id,
        explicitId: Boolean(draft.explicitId),
        source: draft.source.id,
        target: draft.target.id,
        type: draft.type,
        arrowType: draft.arrowType,
        ...draft.label ? { label: draft.label.text, labelType: draft.label.type } : {},
        minlen: draft.minlen,
        classes: [],
        styles: [],
        animate: false
      };
      this.model.relationships.push(relationship);
      edges.set(id, { draft, relationship });
    }
    this.model.relationshipCounter = anonymous;
    return edges;
  }
  resolveEndpoint(endpoint, symbols, states, first) {
    if (endpoint.classesOnReference && !endpoint.declaration) {
      throw new Error(
        `Relationship endpoint '${endpoint.id}' uses ::: without declaring the node at ${locationText(endpoint.location)}`
      );
    }
    const origin = symbols.get(endpoint.id);
    if (origin) {
      return origin.kind;
    }
    states.set(endpoint.id, {
      kind: "usecase",
      id: endpoint.id,
      label: endpoint.label,
      location: endpoint.location,
      generated: endpoint.generated,
      shape: "ellipse",
      classes: []
    });
    symbols.set(endpoint.id, {
      kind: "usecase",
      location: endpoint.location,
      generated: endpoint.generated,
      label: endpoint.label.text
    });
    this.recordFirst(first, endpoint.id, endpoint.location.span[0]);
    return "usecase";
  }
  reorderElements(states, first) {
    const actors = new Map(this.model.actors);
    const useCases = new Map(this.model.useCases);
    this.model.actors.clear();
    this.model.useCases.clear();
    for (const state2 of [...states.values()].sort(
      (a, b) => (first.get(a.id) ?? 0) - (first.get(b.id) ?? 0)
    )) {
      if (!actors.has(state2.id) && !useCases.has(state2.id)) {
        this.setElementModel(state2);
      }
      const actor = actors.get(state2.id) ?? this.model.actors.get(state2.id);
      const useCase = useCases.get(state2.id) ?? this.model.useCases.get(state2.id);
      if (actor) {
        this.model.actors.set(state2.id, actor);
      } else if (useCase) {
        this.model.useCases.set(state2.id, useCase);
      }
    }
  }
  applyMetadataAssignments(symbols, elements, boundaries, edges) {
    for (const assignment of this.metadataAssignments) {
      const origin = symbols.get(assignment.target);
      if (!origin) {
        const inferred = this.inferMetadataKind(assignment.metadata);
        throw new Error(
          `Metadata target '${assignment.target}' is unresolved${inferred ? ` (metadata implies ${inferred})` : ""} at ${locationText(assignment.targetLocation)}`
        );
      }
      if (origin.kind === "actor" || origin.kind === "usecase") {
        this.applyStandaloneElementMetadata(elements.get(assignment.target), assignment.metadata);
      } else if (origin.kind === "boundary") {
        const boundary = boundaries.get(assignment.target);
        for (const property of assignment.metadata.properties) {
          if (property.key !== "type" || property.value !== "rect" && property.value !== "package") {
            this.invalidMetadata(assignment.target, origin.kind, property);
          }
          boundary.type = property.value;
        }
      } else if (origin.kind === "edge") {
        const edge = edges.get(assignment.target);
        if (!edge) {
          throw new Error(
            `Metadata target '${assignment.target}' is not an explicit edge at ${locationText(assignment.targetLocation)}`
          );
        }
        assignment.statement.kind = "edgeMetadata";
        assignment.statement.edges = [
          {
            id: assignment.target,
            span: assignment.statement.span,
            idSpan: assignment.targetLocation.span,
            ...assignment.statement.metadata ? { metadata: assignment.statement.metadata } : {}
          }
        ];
        delete assignment.statement.nodes;
        for (const property of assignment.metadata.properties) {
          if (property.key === "animate" && typeof property.value === "boolean") {
            edge.relationship.animate = property.value;
          } else if (property.key === "animation" && (property.value === "fast" || property.value === "slow")) {
            edge.relationship.animation = property.value;
            edge.relationship.animate = true;
          } else {
            this.invalidMetadata(assignment.target, origin.kind, property);
          }
        }
      } else {
        for (const property of assignment.metadata.properties) {
          this.invalidMetadata(assignment.target, origin.kind, property);
        }
      }
    }
    for (const { relationship } of edges.values()) {
      if (relationship.animation) {
        relationship.animate = true;
      }
    }
  }
  applyStandaloneElementMetadata(state2, metadata) {
    for (const property of metadata.properties) {
      if (state2.kind === "actor") {
        this.applyActorProperty(state2, property, true);
      } else if (property.key === "business" && typeof property.value === "boolean") {
        state2.business = property.value;
      } else {
        this.invalidMetadata(state2.id, state2.kind, property);
      }
    }
  }
  applyDeclarationMetadata(state2, metadata) {
    if (!metadata) {
      return;
    }
    for (const property of metadata.properties) {
      if (state2.kind === "actor") {
        this.applyActorProperty(state2, property, false);
      } else if (property.key === "business" && typeof property.value === "boolean") {
        if (state2.business !== void 0 && state2.business !== property.value) {
          this.conflict(
            `Use case '${state2.id}' has conflicting business metadata`,
            property.location,
            state2.location
          );
        }
        state2.business = property.value;
      } else {
        this.invalidMetadata(state2.id, state2.kind, property);
      }
    }
  }
  applyActorProperty(state2, property, replace) {
    if (property.key === "type" && (property.value === "normal" || property.value === "hollow" || property.value === "awesome")) {
      if (!replace && state2.actorType !== void 0 && state2.actorType !== property.value) {
        this.conflict(
          `Actor '${state2.id}' has conflicting type metadata`,
          property.location,
          state2.location
        );
      }
      state2.actorType = property.value;
    } else if (property.key === "icon" && typeof property.value === "string") {
      if (!replace && state2.icon !== void 0 && state2.icon !== property.value) {
        this.conflict(
          `Actor '${state2.id}' has conflicting icon metadata`,
          property.location,
          state2.location
        );
      }
      state2.icon = property.value;
    } else if (property.key === "business" && typeof property.value === "boolean") {
      if (!replace && state2.business !== void 0 && state2.business !== property.value) {
        this.conflict(
          `Actor '${state2.id}' has conflicting business metadata`,
          property.location,
          state2.location
        );
      }
      state2.business = property.value;
    } else {
      this.invalidMetadata(state2.id, state2.kind, property);
    }
  }
  validateAndRefreshElements(states) {
    for (const state2 of states.values()) {
      const type = state2.icon ? "icon" : state2.actorType ?? "normal";
      if (state2.kind === "actor") {
        if (state2.icon && state2.actorType && state2.actorType !== "normal") {
          throw new Error(
            `Actor '${state2.id}' cannot combine icon with type '${state2.actorType}' at ${locationText(state2.location)}`
          );
        }
        if (state2.business && (type === "icon" || type === "awesome")) {
          throw new Error(
            `Business actor '${state2.id}' must use normal or hollow geometry at ${locationText(state2.location)}`
          );
        }
      } else if ((state2.shape ?? "ellipse") === "rect" && state2.business) {
        throw new Error(
          `Rectangular use case '${state2.id}' cannot be a business use case at ${locationText(state2.location)}`
        );
      }
      this.setElementModel(state2);
    }
  }
  refreshBoundaries(boundaries, elements) {
    for (const boundary of boundaries.values()) {
      boundary.members.length = 0;
    }
    for (const draft of [...this.elements].sort(
      (a, b) => a.location.span[0] - b.location.span[0]
    )) {
      if (!draft.parentId) {
        continue;
      }
      const boundary = boundaries.get(draft.parentId);
      if (!boundary) {
        throw new Error(
          `Parent boundary '${draft.parentId}' for '${draft.id}' is unresolved at ${locationText(draft.parentLocation ?? draft.location)}`
        );
      }
      if (!boundary.members.includes(draft.id)) {
        boundary.members.push(draft.id);
      }
    }
    for (const state2 of elements.values()) {
      if (state2.parentId && !boundaries.has(state2.parentId)) {
        throw new Error(
          `Parent boundary '${state2.parentId}' for '${state2.id}' is unresolved at ${locationText(state2.parentLocation ?? state2.location)}`
        );
      }
    }
    for (const state2 of boundaries.values()) {
      const model = this.model.systemBoundaries.get(state2.id);
      model.type = state2.type ?? "rect";
      model.members = [...state2.members];
      model.classes = [...state2.classes];
      model.styles = [...state2.styles];
    }
  }
  materializeNotes(symbols) {
    let counter = 0;
    for (const draft of this.noteDrafts) {
      const origin = symbols.get(draft.target);
      if (!origin) {
        throw new Error(
          `Note target '${draft.target}' is unresolved at ${locationText(draft.targetLocation)}`
        );
      }
      if (origin.kind !== "actor" && origin.kind !== "usecase") {
        this.conflict(
          `Note target '${draft.target}' must be an actor or use case, not ${origin.kind}`,
          draft.targetLocation,
          origin.location
        );
      }
      const id = `note-${counter++}`;
      this.model.notes.set(id, {
        id,
        target: draft.target,
        label: draft.label.text,
        labelType: draft.label.type
      });
    }
    this.model.noteCounter = counter;
  }
  applyClassDefinitions() {
    for (const definition of this.classDefinitions) {
      for (const id of definition.ids) {
        this.model.classDefs.set(id, { id, styles: [...definition.styles] });
      }
    }
  }
  applyClassesAndStyles(symbols, edges) {
    for (const assignment of this.classAssignments) {
      for (const target of assignment.targets) {
        pushUnique(
          this.getStylable(target.id, symbols, edges, target.location).classes,
          assignment.classes
        );
      }
    }
    for (const assignment of this.styleAssignments) {
      this.getStylable(assignment.target, symbols, edges, assignment.location).styles.push(
        ...assignment.styles
      );
    }
  }
  getStylable(id, symbols, edges, location) {
    const kind = symbols.get(id)?.kind;
    const target = kind === "actor" ? this.model.actors.get(id) : kind === "usecase" ? this.model.useCases.get(id) : kind === "boundary" ? this.model.systemBoundaries.get(id) : kind === "json" ? this.model.jsonNodes.get(id) : kind === "edge" ? edges.get(id)?.relationship : void 0;
    if (!target) {
      throw new Error(
        `Class/style target '${id}' is unresolved or anonymous at ${locationText(location)}`
      );
    }
    return target;
  }
  validateRelationship(draft, sourceKind, targetKind, symbols) {
    const allowed = /* @__PURE__ */ __name((kind) => kind === "actor" || kind === "usecase" || kind === "json", "allowed");
    if (!allowed(sourceKind)) {
      this.conflict(
        `Relationship source '${draft.source.id}' cannot be ${sourceKind}`,
        draft.source.location,
        symbols.get(draft.source.id).location
      );
    }
    if (!allowed(targetKind)) {
      this.conflict(
        `Relationship target '${draft.target.id}' cannot be ${targetKind}`,
        draft.target.location,
        symbols.get(draft.target.id).location
      );
    }
    if ((draft.type === "include" || draft.type === "extend") && (sourceKind !== "usecase" || targetKind !== "usecase")) {
      throw new Error(
        `${draft.type} relationship requires use-case endpoints at ${locationText(draft.location)}`
      );
    }
    if (draft.type === "generalization" && (sourceKind !== "actor" && sourceKind !== "usecase" || sourceKind !== targetKind)) {
      throw new Error(
        `Generalization requires actor-to-actor or use-case-to-use-case endpoints at ${locationText(draft.location)}`
      );
    }
    if (draft.type === "association" && (sourceKind === "json" || targetKind === "json") && ![0, 1, 2].includes(draft.arrowType)) {
      throw new Error(
        `JSON relationship '${draft.source.id}' to '${draft.target.id}' permits only point, reversed-point, or markerless solid association at ${locationText(draft.location)}`
      );
    }
  }
  setElementModel(state2) {
    if (state2.kind === "actor") {
      const type = state2.icon ? "icon" : state2.actorType ?? "normal";
      this.model.useCases.delete(state2.id);
      this.model.actors.set(state2.id, {
        id: state2.id,
        label: state2.label.text,
        labelType: state2.label.type,
        type,
        ...state2.icon ? { icon: state2.icon } : {},
        business: state2.business ?? false,
        ...state2.stereotype ? { stereotype: state2.stereotype } : {},
        ...state2.parentId ? { parentId: state2.parentId } : {},
        classes: [...state2.classes],
        styles: this.model.actors.get(state2.id)?.styles ?? []
      });
    } else {
      this.model.actors.delete(state2.id);
      this.model.useCases.set(state2.id, {
        id: state2.id,
        label: state2.label.text,
        labelType: state2.label.type,
        shape: state2.shape ?? "ellipse",
        business: state2.business ?? false,
        ...state2.stereotype ? { stereotype: state2.stereotype } : {},
        ...state2.parentId ? { parentId: state2.parentId } : {},
        classes: [...state2.classes],
        styles: this.model.useCases.get(state2.id)?.styles ?? []
      });
    }
  }
  inferMetadataKind(metadata) {
    const possible = /* @__PURE__ */ new Set(["actor", "usecase", "boundary", "edge"]);
    for (const property of metadata.properties) {
      if (property.key === "icon") {
        possible.clear();
        possible.add("actor");
      } else if (property.key === "animate" || property.key === "animation") {
        possible.clear();
        possible.add("edge");
      } else if (property.key === "type") {
        possible.clear();
        if (property.value === "rect" || property.value === "package") {
          possible.add("boundary");
        } else if (property.value === "normal" || property.value === "hollow" || property.value === "awesome") {
          possible.add("actor");
        }
      } else if (property.key === "business") {
        possible.delete("boundary");
        possible.delete("edge");
      } else {
        return void 0;
      }
    }
    return possible.size === 1 ? [...possible][0] : void 0;
  }
  invalidMetadata(id, kind, property) {
    throw new Error(
      `Metadata property '${property.key}' is invalid for ${kind} '${id}' at ${locationText(property.location)}`
    );
  }
  registerUnique(symbols, id, kind, location, generated) {
    const previous = symbols.get(id);
    if (previous) {
      this.conflict(
        `ID '${id}' is declared more than once (${previous.kind} and ${kind})`,
        location,
        previous.location,
        void 0,
        generatedFrom(previous)
      );
    }
    symbols.set(id, { kind, location, generated });
  }
  recordFirst(map, id, offset) {
    const previous = map.get(id);
    if (previous === void 0 || offset < previous) {
      map.set(id, offset);
    }
  }
  conflict(message, current, previous, currentLabel, previousLabel) {
    throw new Error(
      `${message} at ${locationText(current)}${labelSuffix(currentLabel)}; previous declaration at ${locationText(previous)}${labelSuffix(previousLabel)}`
    );
  }
};

// src/diagrams/usecase/parser/usecase.visitor.ts
var BaseVisitor = usecaseParser.getBaseCstVisitorConstructor();
var UsecaseVisitor = class extends BaseVisitor {
  constructor() {
    super();
    this.builder = new UsecaseModelBuilder(db);
    this.source = "";
    this.anonymousEdge = 0;
    this.anonymousNote = 0;
    this.validateVisitor();
  }
  static {
    __name(this, "UsecaseVisitor");
  }
  build(cst, source) {
    this.source = source;
    this.parentBoundary = void 0;
    this.anonymousEdge = 0;
    this.anonymousNote = 0;
    this.builder.reset(source);
    this.visit(cst);
  }
  start(ctx) {
    const header = this.tokens(ctx, "USECASE")[0];
    const statements = [];
    for (const line of this.nodes(ctx, "line")) {
      statements.push(this.visit(line));
    }
    this.builder.setStatements(statements);
    this.builder.finalize(this.tokenSpan(header));
  }
  line(ctx) {
    const child = this.firstNode(ctx, "blankLine", "commentLine", "statement");
    return this.wrap(child, this.visit(child));
  }
  statement(ctx) {
    return this.visit(
      this.firstNode(
        ctx,
        "accTitleStatement",
        "accDescrStatement",
        "directionStatement",
        "actorStatement",
        "systemBoundaryStatement",
        "noteStatement",
        "jsonStatement",
        "classDefStatement",
        "classStatement",
        "styleStatement",
        "metadataAssignmentStatement",
        "entityStatement"
      )
    );
  }
  lineEnd(_ctx) {
    return void 0;
  }
  blankLine(ctx) {
    return { kind: "blank", span: this.tokenSpan(this.tokens(ctx, "NEWLINE")[0]) };
  }
  commentLine(ctx) {
    return { kind: "comment", span: this.tokenSpan(this.tokens(ctx, "COMMENT")[0]) };
  }
  accTitleStatement(ctx) {
    const image = this.tokens(ctx, "ACC_TITLE_LINE")[0].image;
    this.builder.setAccTitle(image.slice(image.indexOf(":") + 1).trim());
    return { kind: "accTitle", span: [0, 0] };
  }
  accDescrStatement(ctx) {
    const line = this.tokens(ctx, "ACC_DESCR_LINE")[0];
    const block = this.tokens(ctx, "ACC_DESCR_BLOCK")[0];
    const description = line ? line.image.slice(line.image.indexOf(":") + 1).trim() : block.image.slice(block.image.indexOf("{") + 1, block.image.lastIndexOf("}")).trim();
    this.builder.setAccDescription(description);
    return { kind: "accDescr", span: [0, 0] };
  }
  actorStatement(ctx) {
    const nodes = this.nodes(ctx, "actorItem");
    const items = nodes.map((node) => this.visit(node));
    const relationNode = this.nodes(ctx, "relationTail")[0];
    const occurrences = items.map((item, index) => this.actorOccurrence(nodes[index], item, true));
    for (const item of items) {
      this.builder.addElement(this.actorDraft(item));
    }
    if (!relationNode) {
      return { kind: "node", span: [0, 0], nodes: occurrences };
    }
    const relation = this.visit(relationNode);
    if (relation.target.explicitDeclaration) {
      this.builder.addElement(this.entityDraft(relation.target));
    }
    const draft = this.relationshipDraft(items[0], relation, this.nodeLocation(relationNode));
    this.builder.addRelationship(draft);
    const id = draft.explicitId ?? `edge-${this.anonymousEdge++}`;
    occurrences.push(
      this.entityOccurrence(
        this.nodes(relationNode.children, "entityName")[0],
        relation.target,
        relation.target.explicitDeclaration
      )
    );
    return {
      kind: "edge",
      span: [0, 0],
      nodes: occurrences,
      edges: [
        {
          id,
          span: [0, 0],
          ...draft.explicitIdLocation ? { idSpan: draft.explicitIdLocation.span } : {},
          ...draft.label ? { labelSpan: draft.label.span } : {}
        }
      ]
    };
  }
  actorItem(ctx) {
    const base = this.visit(this.nodes(ctx, "actorName")[0]);
    const metadataNode = this.nodes(ctx, "metadata")[0];
    const stereotypeNode = this.nodes(ctx, "stereotype")[0];
    const classNode = this.nodes(ctx, "classSuffix")[0];
    const classes = classNode ? this.visit(classNode) : { classes: [], spans: [] };
    return {
      ...base,
      ...metadataNode ? { metadata: this.visit(metadataNode) } : {},
      ...stereotypeNode ? { stereotype: this.visit(stereotypeNode) } : {},
      classes: classes.classes,
      classSpans: classes.spans
    };
  }
  actorName(ctx) {
    const identifier = this.tokens(ctx, "IDENTIFIER")[0];
    const string = this.tokens(ctx, "PLAIN_STRING")[0] ?? this.tokens(ctx, "MARKDOWN_STRING")[0];
    if (identifier) {
      const labelNode = this.nodes(ctx, "nodeLabel")[0];
      const label2 = labelNode ? this.visit(labelNode) : this.tokenLabel(identifier);
      return {
        id: identifier.image,
        label: label2,
        location: this.tokenLocation(identifier),
        generated: false,
        classes: [],
        classSpans: []
      };
    }
    const label = this.tokenLabel(string);
    return {
      id: this.generateId(label.text),
      label,
      location: this.tokenLocation(string),
      generated: true,
      classes: [],
      classSpans: []
    };
  }
  actorDeclarationOnly(ctx) {
    const nodes = this.nodes(ctx, "actorItem");
    const items = nodes.map((node) => this.visit(node));
    for (const item of items) {
      this.builder.addElement(this.actorDraft(item));
    }
    return {
      kind: "node",
      span: [0, 0],
      nodes: items.map((item, index) => this.actorOccurrence(nodes[index], item, true))
    };
  }
  entityStatement(ctx) {
    const entityNodes = this.nodes(ctx, "entityName");
    const source = this.visit(entityNodes[0]);
    const relationNode = this.nodes(ctx, "relationTail")[0];
    if (!relationNode) {
      source.explicitDeclaration = true;
      source.shape ??= "ellipse";
      this.builder.addElement(this.entityDraft(source));
      return {
        kind: "node",
        span: [0, 0],
        nodes: [this.entityOccurrence(entityNodes[0], source, true)]
      };
    }
    if (source.explicitDeclaration) {
      this.builder.addElement(this.entityDraft(source));
    }
    const relation = this.visit(relationNode);
    if (relation.target.explicitDeclaration) {
      this.builder.addElement(this.entityDraft(relation.target));
    }
    const draft = {
      source: this.endpoint(source),
      target: this.endpoint(relation.target),
      location: this.nodeLocation(relationNode),
      ...relation.explicitId ? { explicitId: relation.explicitId, explicitIdLocation: relation.explicitIdLocation } : {},
      ...relation.arrow
    };
    this.builder.addRelationship(draft);
    const id = draft.explicitId ?? `edge-${this.anonymousEdge++}`;
    return {
      kind: "edge",
      span: [0, 0],
      nodes: [
        this.entityOccurrence(entityNodes[0], source, source.explicitDeclaration),
        this.entityOccurrence(
          this.nodes(relationNode.children, "entityName")[0],
          relation.target,
          relation.target.explicitDeclaration
        )
      ],
      edges: [
        {
          id,
          span: [0, 0],
          ...draft.explicitIdLocation ? { idSpan: draft.explicitIdLocation.span } : {},
          ...draft.label ? { labelSpan: draft.label.span } : {}
        }
      ]
    };
  }
  entityName(ctx) {
    const identifier = this.tokens(ctx, "IDENTIFIER")[0];
    const string = this.tokens(ctx, "PLAIN_STRING")[0] ?? this.tokens(ctx, "MARKDOWN_STRING")[0];
    const labelNode = this.nodes(ctx, "nodeLabel")[0];
    const metadataNode = this.nodes(ctx, "useCaseMetadata")[0];
    const stereotypeNode = this.nodes(ctx, "stereotype")[0];
    const classNode = this.nodes(ctx, "classSuffix")[0];
    const classes = classNode ? this.visit(classNode) : { classes: [], spans: [] };
    if (identifier) {
      const label2 = labelNode ? this.visit(labelNode) : this.tokenLabel(identifier);
      const shape = labelNode ? this.tokens(ctx, "LBRACKET").length ? "rect" : "ellipse" : void 0;
      return {
        id: identifier.image,
        label: label2,
        location: this.tokenLocation(identifier),
        generated: false,
        ...shape ? { shape } : {},
        ...metadataNode ? { metadata: this.visit(metadataNode) } : {},
        ...stereotypeNode ? { stereotype: this.visit(stereotypeNode) } : {},
        classes: classes.classes,
        classSpans: classes.spans,
        explicitDeclaration: Boolean(shape || metadataNode || stereotypeNode)
      };
    }
    const label = this.tokenLabel(string);
    return {
      id: this.generateId(label.text),
      label,
      location: this.tokenLocation(string),
      generated: true,
      ...metadataNode ? { metadata: this.visit(metadataNode) } : {},
      ...stereotypeNode ? { stereotype: this.visit(stereotypeNode) } : {},
      classes: classes.classes,
      classSpans: classes.spans,
      explicitDeclaration: Boolean(metadataNode || stereotypeNode)
    };
  }
  nodeLabel(ctx) {
    const tokens = this.allTokens(ctx);
    if (tokens.length === 1 && (tokens[0].tokenType.name === "PLAIN_STRING" || tokens[0].tokenType.name === "MARKDOWN_STRING")) {
      return this.tokenLabel(tokens[0]);
    }
    const span = [
      tokens[0].startOffset,
      (tokens.at(-1).endOffset ?? tokens.at(-1).startOffset) + 1
    ];
    return { text: this.source.slice(span[0], span[1]), type: "text", span };
  }
  useCaseMetadata(ctx) {
    return this.visit(this.nodes(ctx, "metadata")[0]);
  }
  relationTail(ctx) {
    const explicitId = this.tokens(ctx, "IDENTIFIER")[0];
    return {
      ...explicitId ? { explicitId: explicitId.image, explicitIdLocation: this.tokenLocation(explicitId) } : {},
      arrow: this.visit(this.nodes(ctx, "arrow")[0]),
      target: this.visit(this.nodes(ctx, "entityName")[0])
    };
  }
  arrow(ctx) {
    return this.visit(
      this.firstNode(
        ctx,
        "semanticRelation",
        "forwardSolidOperator",
        "backwardSolidOperator",
        "markerlessSolidOperator",
        "forwardCircleOperator",
        "backwardCircleOperator",
        "forwardCrossOperator",
        "backwardCrossOperator"
      )
    );
  }
  edgeLabel(ctx) {
    return this.nodeLabel(ctx);
  }
  semanticRelation(ctx) {
    if (this.tokens(ctx, "GENERALIZATION").length) {
      return { type: "generalization", arrowType: ARROW_TYPE.SOLID_ARROW, minlen: 1 };
    }
    const type = this.tokens(ctx, "INCLUDE").length ? "include" : "extend";
    const token = this.tokens(ctx, type === "include" ? "INCLUDE" : "EXTEND")[0];
    return {
      type,
      arrowType: ARROW_TYPE.SOLID_ARROW,
      label: { text: type, type: "text", span: this.tokenSpan(token) },
      minlen: 1
    };
  }
  metadata(ctx) {
    return {
      properties: this.nodes(ctx, "metadataProperty").map(
        (node) => this.visit(node)
      ),
      location: this.ctxLocation(ctx)
    };
  }
  metadataProperty(ctx) {
    const tokens = this.allTokens(ctx).filter((token) => token.tokenType.name !== "COLON");
    const keyToken = tokens[0];
    const valueToken = tokens[1];
    const value = valueToken.tokenType.name === "TRUE" ? true : valueToken.tokenType.name === "FALSE" ? false : this.decodePlain(valueToken);
    const span = [keyToken.startOffset, (valueToken.endOffset ?? valueToken.startOffset) + 1];
    return {
      key: this.decodePlain(keyToken),
      value,
      span,
      keySpan: this.contentSpan(keyToken),
      valueSpan: this.contentSpan(valueToken),
      location: this.tokenLocation(keyToken)
    };
  }
  metadataSeparator(_ctx) {
    return void 0;
  }
  systemBoundaryStatement(ctx) {
    const boundary = this.visit(this.nodes(ctx, "systemBoundaryName")[0]);
    const classNode = this.nodes(ctx, "classSuffix")[0];
    const classes = classNode ? this.visit(classNode) : { classes: [], spans: [] };
    boundary.classes = classes.classes;
    this.builder.addBoundary(boundary);
    const previous = this.parentBoundary;
    this.parentBoundary = { id: boundary.id, location: boundary.location };
    const contentNode = this.nodes(ctx, "systemBoundaryContent")[0];
    const children = contentNode ? this.visit(contentNode) : [];
    this.parentBoundary = previous;
    const end = this.tokens(ctx, "END")[0];
    const metadataNode = this.nodes(ctx, "metadata")[0];
    const metadata = metadataNode ? this.visit(metadataNode) : void 0;
    const statement = {
      kind: "group",
      span: [0, 0],
      group: boundary.id,
      idSpan: boundary.location.span,
      titleSpan: boundary.label.span,
      endSpan: this.tokenSpan(end),
      classSpans: classes.spans,
      ...metadata ? {
        metadata: metadata.properties.map(({ key, span, keySpan, valueSpan }) => ({
          key,
          span,
          keySpan,
          valueSpan
        }))
      } : {},
      ...children.length ? { children } : {}
    };
    if (metadata) {
      this.builder.addMetadataAssignment(boundary.id, boundary.location, metadata, statement);
    }
    return statement;
  }
  systemBoundaryName(ctx) {
    const identifier = this.tokens(ctx, "IDENTIFIER")[0];
    if (identifier) {
      const labelNode = this.nodes(ctx, "nodeLabel")[0];
      return {
        id: identifier.image,
        label: labelNode ? this.visit(labelNode) : this.tokenLabel(identifier),
        location: this.tokenLocation(identifier),
        generated: false,
        classes: []
      };
    }
    const token = this.tokens(ctx, "PLAIN_STRING")[0] ?? this.tokens(ctx, "MARKDOWN_STRING")[0];
    const label = this.tokenLabel(token);
    return {
      id: this.generateId(label.text),
      label,
      location: this.tokenLocation(token),
      generated: true,
      classes: []
    };
  }
  systemBoundaryContent(ctx) {
    const children = [
      ...this.nodes(ctx, "blankLine"),
      ...this.nodes(ctx, "commentLine"),
      ...this.nodes(ctx, "boundaryElement")
    ].sort((a, b) => (a.location?.startOffset ?? 0) - (b.location?.startOffset ?? 0));
    return children.map((node) => this.wrap(node, this.visit(node)));
  }
  boundaryElement(ctx) {
    const actorNode2 = this.nodes(ctx, "actorDeclarationOnly")[0];
    if (actorNode2) {
      return this.visit(actorNode2);
    }
    const entityNode = this.nodes(ctx, "entityName")[0];
    const entity = this.visit(entityNode);
    entity.explicitDeclaration = true;
    entity.shape ??= "ellipse";
    this.builder.addElement(this.entityDraft(entity));
    return { kind: "node", span: [0, 0], nodes: [this.entityOccurrence(entityNode, entity, true)] };
  }
  metadataAssignmentStatement(ctx) {
    const target = this.visit(this.nodes(ctx, "metadataAssignmentTarget")[0]);
    const metadata = this.visit(this.nodes(ctx, "metadata")[0]);
    const statement = {
      kind: "metadata",
      span: [0, 0],
      nodes: [{ id: target.id, span: target.location.span, idSpan: target.location.span }],
      metadata: metadata.properties.map(({ key, span, keySpan, valueSpan }) => ({
        key,
        span,
        keySpan,
        valueSpan
      }))
    };
    this.builder.addMetadataAssignment(target.id, target.location, metadata, statement);
    return statement;
  }
  metadataAssignmentTarget(ctx) {
    const token = this.allTokens(ctx)[0];
    const label = this.tokenLabel(token);
    return {
      id: token.tokenType.name === "IDENTIFIER" ? token.image : this.generateId(label.text),
      location: this.tokenLocation(token)
    };
  }
  noteStatement(ctx) {
    const target = this.tokens(ctx, "IDENTIFIER")[0];
    const label = this.visit(this.nodes(ctx, "nodeLabel")[0]);
    this.builder.addNote({
      target: target.image,
      targetLocation: this.tokenLocation(target),
      label,
      location: this.ctxLocation(ctx)
    });
    return {
      kind: "note",
      span: [0, 0],
      ref: `note-${this.anonymousNote++}`,
      refSpan: label.span,
      nodes: [{ id: target.image, span: this.tokenSpan(target), idSpan: this.tokenSpan(target) }]
    };
  }
  stereotype(ctx) {
    const token = this.tokens(ctx, "STEREOTYPE_TEXT")[0];
    return { value: token.image.trim(), span: this.tokenSpan(token) };
  }
  classSuffix(ctx) {
    const tokens = this.tokens(ctx, "IDENTIFIER");
    return {
      classes: tokens.map((token) => token.image),
      spans: tokens.map((token) => this.tokenSpan(token))
    };
  }
  jsonStatement(ctx) {
    const start = this.tokens(ctx, "JSON_DECLARATION_START")[0];
    const literal = this.tokens(ctx, "JSON_OBJECT_LITERAL")[0];
    const match = /^json[\t ]+(\w+)/.exec(start.image);
    const id = match[1];
    const relative = match[0].length - id.length;
    const idLocation = {
      span: [start.startOffset + relative, start.startOffset + relative + id.length],
      line: start.startLine ?? 1,
      column: (start.startColumn ?? 1) + relative
    };
    const parsed = parseOrderedJsonObject(
      literal.image,
      literal.startLine ?? 1,
      literal.startColumn ?? 1
    );
    const classNode = this.nodes(ctx, "classSuffix")[0];
    const classes = classNode ? this.visit(classNode) : { classes: [], spans: [] };
    const draft = {
      id,
      value: parsed.value,
      propertyOrder: parsed.propertyOrder,
      location: idLocation,
      classes: classes.classes
    };
    this.builder.addJson(draft);
    return {
      kind: "json",
      span: [0, 0],
      nodes: [
        {
          id,
          span: idLocation.span,
          idSpan: idLocation.span,
          defines: true,
          classSpans: classes.spans
        }
      ],
      classSpans: classes.spans
    };
  }
  directionStatement(ctx) {
    const token = this.allTokens(ctx).find(
      (value) => ["TD", "TB", "BT", "RL", "LR"].includes(value.tokenType.name)
    );
    this.builder.setDirection(token.image);
    return { kind: "direction", span: [0, 0] };
  }
  classDefStatement(ctx) {
    const ids = this.tokens(ctx, "IDENTIFIER");
    const styles = this.visit(this.nodes(ctx, "styles")[0]);
    this.builder.addClassDef(
      ids.map((token) => token.image),
      styles
    );
    return { kind: "classDef", span: [0, 0], ref: ids[0].image, refSpan: this.tokenSpan(ids[0]) };
  }
  classStatement(ctx) {
    const ids = this.tokens(ctx, "IDENTIFIER");
    let split = 1;
    for (; split < ids.length; split++) {
      const between = this.source.slice(
        (ids[split - 1].endOffset ?? ids[split - 1].startOffset) + 1,
        ids[split].startOffset
      );
      if (!between.includes(",")) {
        break;
      }
    }
    const targets = ids.slice(0, split).map((token) => ({ id: token.image, location: this.tokenLocation(token) }));
    const classes = ids.slice(split).map((token) => token.image);
    this.builder.addClassAssignment(targets, classes);
    return {
      kind: "classAssign",
      span: [0, 0],
      ref: classes[0],
      refSpan: this.tokenSpan(ids[split]),
      nodes: targets.map(({ id, location }) => ({
        id,
        span: location.span,
        idSpan: location.span
      }))
    };
  }
  styleStatement(ctx) {
    const target = this.tokens(ctx, "IDENTIFIER")[0];
    const styles = this.visit(this.nodes(ctx, "styles")[0]);
    this.builder.addStyleAssignment(target.image, this.tokenLocation(target), styles);
    return {
      kind: "style",
      span: [0, 0],
      nodes: [{ id: target.image, span: this.tokenSpan(target), idSpan: this.tokenSpan(target) }]
    };
  }
  styles(ctx) {
    return this.nodes(ctx, "styleValue").map((node) => this.visit(node));
  }
  styleValue(ctx) {
    const tokens = this.allTokens(ctx);
    const span = [
      tokens[0].startOffset,
      (tokens.at(-1).endOffset ?? tokens.at(-1).startOffset) + 1
    ];
    return this.source.slice(span[0], span[1]).replaceAll("\\,", ",");
  }
  styleComponent(ctx) {
    return this.allTokens(ctx).map((token) => token.image).join("");
  }
  forwardSolidOperator(ctx) {
    const token = this.tokens(ctx, "FORWARD_SOLID")[0];
    return {
      type: "association",
      arrowType: ARROW_TYPE.SOLID_ARROW,
      minlen: this.solidMinlen(token)
    };
  }
  backwardSolidOperator(ctx) {
    const token = this.tokens(ctx, "BACKWARD_SOLID")[0];
    const labelNode = this.nodes(ctx, "edgeLabel")[0];
    const lengthToken = labelNode ? this.tokens(ctx, "MARKERLESS_SOLID").at(-1) : token;
    return {
      type: "association",
      arrowType: ARROW_TYPE.BACK_ARROW,
      minlen: this.solidMinlen(lengthToken),
      ...labelNode ? { label: this.visit(labelNode) } : {}
    };
  }
  markerlessSolidOperator(ctx) {
    const labelNode = this.nodes(ctx, "edgeLabel")[0];
    const tokens = this.allTokens(ctx);
    if (!labelNode) {
      return {
        type: "association",
        arrowType: ARROW_TYPE.LINE_SOLID,
        minlen: this.solidMinlen(this.tokens(ctx, "MARKERLESS_SOLID")[0])
      };
    }
    const last = tokens.at(-1);
    const arrowType = last.tokenType.name === "FORWARD_SOLID" ? ARROW_TYPE.SOLID_ARROW : last.tokenType.name === "FORWARD_CIRCLE" ? ARROW_TYPE.CIRCLE_ARROW : last.tokenType.name === "FORWARD_CROSS" ? ARROW_TYPE.CROSS_ARROW : ARROW_TYPE.LINE_SOLID;
    return {
      type: "association",
      arrowType,
      label: this.visit(labelNode),
      minlen: arrowType === ARROW_TYPE.SOLID_ARROW || arrowType === ARROW_TYPE.LINE_SOLID ? this.solidMinlen(last) : 1
    };
  }
  forwardCircleOperator(_ctx) {
    return { type: "association", arrowType: ARROW_TYPE.CIRCLE_ARROW, minlen: 1 };
  }
  backwardCircleOperator(ctx) {
    const labelNode = this.nodes(ctx, "edgeLabel")[0];
    return {
      type: "association",
      arrowType: ARROW_TYPE.CIRCLE_ARROW_REVERSED,
      minlen: 1,
      ...labelNode ? { label: this.visit(labelNode) } : {}
    };
  }
  forwardCrossOperator(_ctx) {
    return { type: "association", arrowType: ARROW_TYPE.CROSS_ARROW, minlen: 1 };
  }
  backwardCrossOperator(ctx) {
    const labelNode = this.nodes(ctx, "edgeLabel")[0];
    return {
      type: "association",
      arrowType: ARROW_TYPE.CROSS_ARROW_REVERSED,
      minlen: 1,
      ...labelNode ? { label: this.visit(labelNode) } : {}
    };
  }
  actorDraft(item) {
    return {
      id: item.id,
      kind: "actor",
      label: item.label,
      location: item.location,
      generated: item.generated,
      ...this.parentBoundary ? { parentId: this.parentBoundary.id, parentLocation: this.parentBoundary.location } : {},
      ...item.metadata ? { metadata: item.metadata } : {},
      ...item.stereotype ? { stereotype: item.stereotype.value, stereotypeSpan: item.stereotype.span } : {},
      classes: item.classes
    };
  }
  entityDraft(entity) {
    return {
      id: entity.id,
      kind: "usecase",
      label: entity.label,
      location: entity.location,
      generated: entity.generated,
      ...this.parentBoundary ? { parentId: this.parentBoundary.id, parentLocation: this.parentBoundary.location } : {},
      ...entity.shape ? { shape: entity.shape } : {},
      ...entity.metadata ? { metadata: entity.metadata } : {},
      ...entity.stereotype ? { stereotype: entity.stereotype.value, stereotypeSpan: entity.stereotype.span } : {},
      classes: entity.classes
    };
  }
  endpoint(entity, declaration = entity.explicitDeclaration ?? true) {
    return {
      id: entity.id,
      label: entity.label,
      location: entity.location,
      generated: entity.generated,
      declaration,
      classesOnReference: entity.classes.length > 0
    };
  }
  relationshipDraft(source, tail, location) {
    return {
      source: this.endpoint(source, true),
      target: this.endpoint(tail.target),
      location,
      ...tail.explicitId ? { explicitId: tail.explicitId, explicitIdLocation: tail.explicitIdLocation } : {},
      ...tail.arrow
    };
  }
  actorOccurrence(node, item, defines) {
    return {
      id: item.id,
      span: this.nodeSpan(node),
      idSpan: item.location.span,
      labelSpan: item.label.span,
      ...defines ? { defines: true } : {},
      ...item.stereotype ? { stereotypeSpan: item.stereotype.span } : {},
      ...item.metadata ? {
        metadata: item.metadata.properties.map(({ key, span, keySpan, valueSpan }) => ({
          key,
          span,
          keySpan,
          valueSpan
        }))
      } : {},
      ...item.classSpans.length ? { classSpans: item.classSpans } : {}
    };
  }
  entityOccurrence(node, item, defines) {
    return this.actorOccurrence(node, item, defines);
  }
  wrap(node, statement) {
    if (statement.kind === "blank" || statement.kind === "comment") {
      return statement;
    }
    statement.span = this.nodeSpan(node);
    for (const edge of statement.edges ?? []) {
      edge.span = statement.span;
    }
    return statement;
  }
  tokenLabel(token) {
    const type = token.tokenType.name === "MARKDOWN_STRING" ? "markdown" : "text";
    const trim = type === "markdown" ? 2 : token.tokenType.name === "PLAIN_STRING" ? 1 : 0;
    const span = this.tokenSpan(token, trim);
    return { text: this.source.slice(span[0], span[1]), type, span };
  }
  decodePlain(token) {
    return token.tokenType.name === "PLAIN_STRING" ? token.image.slice(1, -1) : token.image;
  }
  contentSpan(token) {
    return this.tokenSpan(
      token,
      token.tokenType.name === "PLAIN_STRING" ? 1 : token.tokenType.name === "MARKDOWN_STRING" ? 2 : 0
    );
  }
  generateId(label) {
    return label.replace(/\W/g, "_");
  }
  solidMinlen(token) {
    return Math.max(1, (token.image.match(/-/g)?.length ?? 2) - 1);
  }
  nodeLocation(node) {
    const first = this.allTokens(node.children)[0];
    return {
      span: this.nodeSpan(node),
      line: first.startLine ?? 1,
      column: first.startColumn ?? 1
    };
  }
  ctxLocation(ctx) {
    const tokens = this.allTokens(ctx).filter(
      (token) => token.tokenType.name !== "NEWLINE" && token.tokenType.name !== "EOF"
    );
    const first = tokens[0];
    const last = tokens.at(-1);
    return {
      span: [
        first.startOffset,
        Math.min(
          this.source.length,
          (last.endOffset ?? last.startOffset + last.image.length - 1) + 1
        )
      ],
      line: first.startLine ?? 1,
      column: first.startColumn ?? 1
    };
  }
  tokenLocation(token) {
    const trim = token.tokenType.name === "PLAIN_STRING" ? 1 : token.tokenType.name === "MARKDOWN_STRING" ? 2 : 0;
    return {
      span: this.tokenSpan(token, trim),
      line: token.startLine ?? 1,
      column: (token.startColumn ?? 1) + trim
    };
  }
  nodeSpan(node) {
    const tokens = this.allTokens(node.children).filter(
      (token) => token.tokenType.name !== "NEWLINE" && token.tokenType.name !== "EOF"
    );
    const first = tokens[0];
    const last = tokens.at(-1);
    if (!first || !last) {
      throw new Error("Usecase CST node has no source token");
    }
    return [
      first.startOffset,
      Math.min(
        this.source.length,
        (last.endOffset ?? last.startOffset + last.image.length - 1) + 1
      )
    ];
  }
  tokenSpan(token, trim = 0) {
    return [
      token.startOffset + trim,
      Math.min(
        this.source.length,
        (token.endOffset ?? token.startOffset + token.image.length - 1) + 1 - trim
      )
    ];
  }
  nodes(ctx, key) {
    return (ctx[key] ?? []).filter((item) => "children" in item);
  }
  tokens(ctx, key) {
    return (ctx[key] ?? []).filter((item) => "tokenTypeIdx" in item);
  }
  firstNode(ctx, ...keys) {
    for (const key of keys) {
      const node = this.nodes(ctx, key)[0];
      if (node) {
        return node;
      }
    }
    throw new Error(`Usecase CST is missing one of: ${keys.join(", ")}`);
  }
  allTokens(ctx) {
    const result = [];
    for (const values of Object.values(ctx)) {
      for (const value of values) {
        if ("tokenTypeIdx" in value) {
          result.push(value);
        } else {
          result.push(...this.allTokens(value.children));
        }
      }
    }
    return result.sort((a, b) => a.startOffset - b.startOffset);
  }
};
var usecaseVisitor = new UsecaseVisitor();

// src/diagrams/usecase/parser/usecase.chevrotain.ts
var parser = {
  // eslint-disable-next-line @typescript-eslint/require-await -- normalizes synchronous parser errors into rejected promises
  parse: /* @__PURE__ */ __name(async (input) => {
    db.clear();
    usecaseParser.input = [];
    try {
      runChevrotainParse(
        {
          diagramType: "usecase",
          lexer: usecaseLexer,
          parser: usecaseParser,
          entry: /* @__PURE__ */ __name(() => usecaseParser.start(), "entry"),
          visit: /* @__PURE__ */ __name((cst) => usecaseVisitor.build(cst, input), "visit")
        },
        input
      );
    } catch (error) {
      db.clear();
      const parseError = usecaseParser.errors[0];
      if (parseError) {
        const { token } = parseError;
        const start = isKnownLocation(token.startOffset) ? token.startOffset : input.length;
        const end = isKnownLocation(token.endOffset) ? token.endOffset + 1 : start;
        const line = isKnownLocation(token.startLine) ? token.startLine : input.slice(0, start).split(/\r\n|\r|\n/).length;
        const lineStart = Math.max(
          input.lastIndexOf("\n", start - 1),
          input.lastIndexOf("\r", start - 1)
        );
        const column = isKnownLocation(token.startColumn) ? token.startColumn : start - lineStart;
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message} at line ${line}, column ${column} [${start},${end})`);
      }
      throw error;
    }
  }, "parse")
};

// src/diagrams/usecase/usecaseRenderer.ts
import { select } from "d3";
var USECASE_MARKERS = [
  "point",
  "circle",
  "cross",
  "extension"
];
var ACTOR_SHAPES = {
  usecaseActor: true,
  usecaseActorHollow: true,
  usecaseActorAwesome: true,
  usecaseActorIcon: true
};
var usecaseDomId = /* @__PURE__ */ __name((diagramId, modelId) => {
  const [safeDiagramId, safeModelId] = [diagramId, modelId].map(
    (value) => value.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "") || "element"
  );
  return `usecase-${safeDiagramId}-${safeModelId}`;
}, "usecaseDomId");
var usecaseNodeDomId = /* @__PURE__ */ __name((modelId) => `usecase-${modelId.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "") || "element"}`, "usecaseNodeDomId");
var getAccessibleLabel = /* @__PURE__ */ __name((label, labelType) => {
  if (labelType !== "markdown") {
    return label;
  }
  return markdownToLines(label).map((line) => line.map((word) => word.content).join(" ")).join("\n");
}, "getAccessibleLabel");
var getUsecaseNodeAccessibleName = /* @__PURE__ */ __name((node) => {
  const label = getAccessibleLabel(node.label ?? node.id, node.labelType);
  if (ACTOR_SHAPES[node.shape]) {
    const variant = node.actorType && node.actorType !== "normal" ? `${node.actorType} ` : "";
    const business = node.business ? "business " : "";
    const stereotype2 = node.stereotype ? `, stereotype ${node.stereotype}` : "";
    return `${business}${variant}actor ${label}${stereotype2}`;
  }
  if (node.shape === "note") {
    return `Note for ${node.noteTargetLabel ?? node.noteTarget ?? ""}: ${label}`;
  }
  if (node.shape === "usecaseJsonTable") {
    const rows = (node.jsonRows ?? []).map((row) => `${row.accessibleKey}: ${row.value}`).join("; ");
    return rows ? `${label}: ${rows}` : label;
  }
  const stereotype = node.stereotype ? `, stereotype ${node.stereotype}` : "";
  return `${node.business ? "business " : ""}use case ${label}${stereotype}`;
}, "getUsecaseNodeAccessibleName");
var getUsecaseBoundaryAccessibleName = /* @__PURE__ */ __name((boundary) => `${boundary.boundaryType} system boundary ${getAccessibleLabel(
  boundary.label ?? boundary.id,
  boundary.labelType
)}`, "getUsecaseBoundaryAccessibleName");
var getUsecaseEdgeAccessibleName = /* @__PURE__ */ __name((edge) => {
  if (edge.relationshipType === "note") {
    return "";
  }
  const relation = edge.relationshipType === "association" && edge.label ? `association ${getAccessibleLabel(edge.label, edge.labelType)}` : edge.relationshipType;
  return `${relation} from ${edge.sourceLabel} to ${edge.targetLabel}`;
}, "getUsecaseEdgeAccessibleName");
var escapePlainLabel = /* @__PURE__ */ __name((label) => label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "escapePlainLabel");
var escapeMarkdownMarkers = /* @__PURE__ */ __name((label) => label.replace(/([*[\\\]_`])/g, "\\$1"), "escapeMarkdownMarkers");
var prepareUsecaseLayoutData = /* @__PURE__ */ __name((data, diagramId) => {
  data.diagramId = diagramId;
  data.markers = [...USECASE_MARKERS];
  for (const node of data.nodes) {
    const renderingNode = node;
    renderingNode.domId = usecaseNodeDomId(node.id);
    if (node.label !== void 0 && node.labelType === "text") {
      node.label = escapePlainLabel(node.label);
    }
    if (node.stereotype) {
      node.stereotype = escapePlainLabel(node.stereotype);
    }
    if (!node.isGroup && node.shape === "usecaseJsonTable") {
      node.jsonRows = node.jsonRows?.map((row) => ({
        ...row,
        key: escapePlainLabel(row.key),
        value: escapePlainLabel(row.value)
      }));
    }
    if (!node.isGroup && (node.shape === "usecaseEllipse" || node.shape === "rect") && node.stereotype) {
      const label = node.label ?? escapePlainLabel(node.id);
      node.label = `\xAB${escapeMarkdownMarkers(node.stereotype)}\xBB<br/>${node.labelType === "text" ? escapeMarkdownMarkers(label) : label}`;
      node.labelType = "markdown";
      renderingNode.hasFoldedStereotype = true;
      delete node.stereotype;
    }
  }
  for (const edge of data.edges) {
    if (edge.label !== void 0 && edge.labelType === "text") {
      edge.label = escapePlainLabel(edge.label);
    }
  }
  return data;
}, "prepareUsecaseLayoutData");
var annotateUsecaseElements = /* @__PURE__ */ __name((svg, data, accessibleNames) => {
  for (const node of data.nodes) {
    const stableDomId = typeof node.domId === "string" ? node.domId : usecaseDomId(data.diagramId, node.id);
    const element = svg.select(`#${stableDomId}`);
    const kind = node.isGroup ? "boundary" : ACTOR_SHAPES[node.shape] ? "actor" : node.shape === "note" ? "note" : node.shape === "usecaseJsonTable" ? "json" : "usecase";
    const accessibleName = accessibleNames.nodes.get(node.id) ?? node.id;
    element.attr("data-usecase-id", node.id).attr("data-usecase-kind", kind).attr("role", "img").attr("aria-label", accessibleName);
    if (!node.isGroup && (node.shape === "usecaseEllipse" || node.shape === "rect") && "hasFoldedStereotype" in node && node.hasFoldedStereotype === true) {
      const root = element.node();
      const htmlLabel = root?.querySelector(".nodeLabel");
      const container = htmlLabel?.querySelector("p") ?? htmlLabel;
      const firstLabelNode = container?.firstChild;
      if (container && firstLabelNode?.nodeType === 3) {
        const stereotype = container.ownerDocument.createElement("span");
        stereotype.className = "usecase-stereotype";
        container.insertBefore(stereotype, firstLabelNode);
        stereotype.appendChild(firstLabelNode);
      } else {
        root?.querySelector(".label tspan tspan, .label tspan")?.classList.add("usecase-stereotype");
      }
    }
  }
  const edgesById = new Map(data.edges.map((edge) => [edge.id, edge]));
  svg.selectAll('path[data-et="edge"]').each(function() {
    const edge = edgesById.get(this.getAttribute("data-id") ?? "");
    if (!edge) {
      return;
    }
    const path = select(this);
    path.attr("id", usecaseDomId(data.diagramId, edge.id)).attr("data-usecase-id", edge.id).attr("data-usecase-kind", edge.internal ? "note-connector" : "relationship");
    if (edge.internal) {
      path.attr("aria-hidden", "true");
    } else {
      path.attr("role", "img").attr("aria-label", accessibleNames.edges.get(edge.id) ?? edge.id);
    }
  });
}, "annotateUsecaseElements");
var applyUsecaseFonts = /* @__PURE__ */ __name((svg, data) => {
  svg.style("--mermaid-usecase-actor-font-size", `${data.actorFontSize}px`).style("--mermaid-usecase-actor-font-family", data.actorFontFamily).style("--mermaid-usecase-actor-font-weight", data.actorFontWeight).style("--mermaid-usecase-font-size", `${data.usecaseFontSize}px`).style("--mermaid-usecase-font-family", data.usecaseFontFamily).style("--mermaid-usecase-font-weight", data.usecaseFontWeight);
}, "applyUsecaseFonts");
var draw = /* @__PURE__ */ __name(async (_text, id, _version, diag) => {
  log.info("Drawing usecase diagram (unified)", id);
  const { layout } = getConfig2();
  const usecaseDb = diag.db;
  const data4Layout = usecaseDb.getData();
  const accessibleLabels = new Map(
    data4Layout.nodes.map((node) => [
      node.id,
      getAccessibleLabel(node.label ?? node.id, node.labelType)
    ])
  );
  const accessibleNames = {
    nodes: new Map(
      data4Layout.nodes.map((node) => [
        node.id,
        node.isGroup ? getUsecaseBoundaryAccessibleName(node) : getUsecaseNodeAccessibleName(
          node.shape === "note" ? { ...node, noteTargetLabel: accessibleLabels.get(node.noteTarget ?? "") } : node
        )
      ])
    ),
    edges: new Map(
      data4Layout.edges.map((edge) => [
        edge.id,
        getUsecaseEdgeAccessibleName({
          ...edge,
          sourceLabel: accessibleLabels.get(edge.source) ?? edge.sourceLabel,
          targetLabel: accessibleLabels.get(edge.target) ?? edge.targetLabel
        })
      ])
    )
  };
  const svg = getDiagramElement(id, data4Layout.config.securityLevel);
  data4Layout.layoutAlgorithm = getRegisteredLayoutAlgorithm(layout);
  prepareUsecaseLayoutData(data4Layout, id);
  applyUsecaseFonts(svg, data4Layout);
  await render(data4Layout, svg);
  annotateUsecaseElements(svg, data4Layout, accessibleNames);
  const padding = data4Layout.diagramPadding;
  utils_default.insertTitle(
    svg,
    "usecaseDiagramTitleText",
    0,
    // Default title top margin
    usecaseDb.getDiagramTitle?.() ?? ""
  );
  setupViewPortForSVG(svg, padding, "usecaseDiagram", data4Layout.useMaxWidth);
  applyUsecaseFonts(svg, data4Layout);
}, "draw");
var renderer = { draw };

// src/diagrams/usecase/styles.ts
var roleColors = /* @__PURE__ */ __name((options) => ({
  actorBkg: options.usecaseActorBkg ?? options.actorBkg ?? options.mainBkg,
  actorBorder: options.usecaseActorBorder ?? options.actorBorder ?? options.primaryColor,
  bkg: options.usecaseBkg ?? options.mainBkg,
  border: options.usecaseBorder ?? options.nodeBorder ?? options.primaryColor,
  boundaryBkg: options.usecaseBoundaryBkg ?? options.clusterBkg,
  boundaryBorder: options.usecaseBoundaryBorder ?? options.clusterBorder,
  includeLine: options.usecaseIncludeLine ?? options.lineColor,
  extendLine: options.usecaseExtendLine ?? options.lineColor
}), "roleColors");
var genColor = /* @__PURE__ */ __name((options) => {
  const { theme, bkgColorArray, borderColorArray } = options;
  if (!isColorTheme(theme, borderColorArray)) {
    return "";
  }
  const rotate = getConfig().usecase?.colorScheme === "rotate";
  const look = safeLook(options.look);
  const isHandDrawn = look === "handDrawn";
  const hasBkgColors = hasPalette(bkgColorArray);
  let sections = "";
  for (let i = 0; i < paletteSlotCount(borderColorArray); i++) {
    const borderColor = borderColorArray[i];
    const fill = hasBkgColors ? `fill: ${bkgColorArray[i % bkgColorArray.length]};` : "";
    const slot = `[data-look="${look}"][data-color-id="color-${i}"]`;
    sections += `

    & ${slot}.system-boundary rect.boundary-body,
    & ${slot}.system-boundary rect.boundary-tab,
    & ${slot}.system-boundary .boundary-body path,
    & ${slot}.system-boundary .boundary-tab path {
      stroke: ${borderColor};
      ${fill}
    }
    `;
    if (!rotate) {
      continue;
    }
    sections += `

    /* Use case bodies -- \`.usecase-element\` covers the ellipse form, the \`[Rect]\` form and
       the business variant.

       Element selectors only, never a bare \`path\`. Under the handDrawn look roughjs draws
       the body as a *pair* of paths, an outline stroked in the border colour and a hachure
       fill stroked in the background colour, with no class to tell them apart. Stroking
       both repaints the fill lines as border colour and the shape collapses into a solid
       block -- which is what \`.usecase-element path\` did. So handDrawn bodies keep the
       theme's uniform colours, exactly as handDrawn flowchart nodes do. */
    & ${slot}.usecase-element ellipse,
    & ${slot}.usecase-element rect {
      stroke: ${borderColor};
      ${fill}
    }

    /* The business marker is a single classed path, so it can be reached safely by name --
       without it the marker keeps the uniform border beside a palette-coloured body. No
       \`fill\`: the marker is drawn with \`fill="none"\` and has to stay that way. */
    & ${slot}.usecase-element .usecase-business-marker {
      stroke: ${borderColor};
    }

    /* Actor glyphs, mirroring the uniform rule further down. The fill goes on the glyph
       group, never on its children, so the hollow variant's own \`fill="none"\` keeps
       winning and a hollow actor stays hollow. Same reason as above for not descending
       into the handDrawn paths. */
    & ${slot}.usecase-actor .usecase-actor-shape,
    & ${slot}.usecase-actor .usecase-actor-hollow,
    & ${slot}.usecase-actor .usecase-actor-awesome,
    & ${slot}.usecase-actor .usecase-actor-icon {
      stroke: ${borderColor};
      ${fill}
    }
${isHandDrawn ? "" : `
    /* The group rule above reaches the glyph by inheritance, which the neo look breaks: it
       ships a \`[data-look="neo"].node path { stroke }\` rule that hits the glyph's own paths,
       and a value set directly on the child always beats one inherited from the parent,
       whatever the parent rule's specificity. So name the children too.

       Emitted for every look *except* handDrawn, where roughjs draws the glyph as an
       outline path plus a hachure fill path stroked in the fill colour, indistinguishable
       in CSS -- stroking both turns a hollow actor into a solid disc. Deliberately no
       \`fill\` either way, so the hollow variant's own \`fill="none"\` keeps winning. */
    & ${slot}.usecase-actor .usecase-actor-glyph path,
    & ${slot}.usecase-actor .usecase-actor-glyph circle {
      stroke: ${borderColor};
    }
`}
    `;
  }
  return sections;
}, "genColor");
var getStyles = /* @__PURE__ */ __name((options) => {
  const role = roleColors(options);
  const isHandDrawn = safeLook(options.look) === "handDrawn";
  return `
  ${genColor(options)}
  & .usecase-actor {
    color: ${options.actorTextColor ?? options.primaryTextColor};
  }

  & .usecase-actor-shape,
  & .usecase-actor-hollow,
  & .usecase-actor-awesome,
  & .usecase-actor-icon {
    fill: ${role.actorBkg};
    stroke: ${role.actorBorder};
    stroke-width: 2px;
  }
${isHandDrawn ? "" : `
  /* The rule above colours the glyph group and lets its children inherit, which the neo
     look breaks: it ships a \`[data-look="neo"].node path { stroke }\` rule that lands on
     the glyph's own paths, and a value set directly on a child always beats one inherited
     from its parent, whatever the parent rule's specificity. Since neo is the default look,
     without this every actor renders in the node border colour rather than the actor
     colour the rule above asks for.

     \`.node\` is in the selector to outrank that neo rule rather than tie with it: both
     would otherwise be one attribute plus one class plus one element, leaving the winner to
     depend on which stylesheet is concatenated last.

     Stroke only: the hollow variant's own \`fill="none"\` has to keep winning. */
  & .node.usecase-actor .usecase-actor-glyph path,
  & .node.usecase-actor .usecase-actor-glyph circle {
    stroke: ${role.actorBorder};
  }
`}
  & .usecase-actor .nodeLabel,
  & .actor-label {
    color: ${options.actorTextColor ?? options.primaryTextColor};
    fill: ${options.actorTextColor ?? options.primaryTextColor};
    font-family: var(--mermaid-usecase-actor-font-family, ${options.fontFamily});
    font-size: var(--mermaid-usecase-actor-font-size, 14px);
    font-weight: var(--mermaid-usecase-actor-font-weight, normal);
  }

  & .usecase-element ellipse,
  & .usecase-element rect,
  & .usecase-business ellipse,
  & .usecase-business rect {
    fill: ${role.bkg};
    stroke: ${role.border};
    stroke-width: 2px;
  }
${isHandDrawn ? "" : `
  /* The same interception the actor glyph hits, one element down: neo ships
     \`[data-look="neo"].node rect { stroke: nodeBorder }\`, which outranks the plain
     \`.usecase-element rect\` above, so a use case written in the \`[Rect]\` form kept the node
     border colour while its ellipse siblings took the role colour. An \`<ellipse>\` has no
     equivalent neo rule and is already correct; restating it here costs nothing and means
     the two forms cannot drift apart again.

     Qualified with \`[data-look]\` *and* \`.node\` to land strictly above that rule rather than
     tie with it -- on a tie the later stylesheet would win, which is how neo took this in
     the first place. Skipped under handDrawn, where roughjs draws paths and neither element
     exists. */
  & [data-look="${safeLook(options.look)}"].node.usecase-element ellipse,
  & [data-look="${safeLook(options.look)}"].node.usecase-element rect {
    fill: ${role.bkg};
    stroke: ${role.border};
  }

  /* The business marker is a \`<path>\`, so it loses to \`[data-look="neo"].node path\` the same
     way. No \`fill\`: the marker is drawn with \`fill="none"\` and has to stay that way. */
  & [data-look="${safeLook(options.look)}"].node.usecase-element .usecase-business-marker {
    stroke: ${role.border};
  }
`}
  & .usecase-element .nodeLabel,
  & .usecase-label {
    color: ${options.primaryTextColor};
    fill: ${options.primaryTextColor};
    font-family: var(--mermaid-usecase-font-family, ${options.fontFamily});
    font-size: var(--mermaid-usecase-font-size, 12px);
    font-weight: var(--mermaid-usecase-font-weight, normal);
  }

  & .usecase-stereotype,
  & .usecase-business-marker {
    color: ${options.primaryTextColor};
    fill: ${options.primaryTextColor};
    stroke: ${role.border};
  }

  & .system-boundary rect.boundary-body,
  & .system-boundary rect.boundary-tab,
  & .system-boundary-package-tab {
    fill: ${role.boundaryBkg};
    stroke: ${role.boundaryBorder};
    stroke-width: 1px;
  }

  & .system-boundary-title text {
    fill: ${options.titleColor ?? options.primaryTextColor};
  }

  /* Only the span, never the <p> inside it: the renderer puts a user-supplied
     'color' on the span, and that has to stay inheritable by its children. */
  & .system-boundary-title span {
    color: ${options.titleColor ?? options.primaryTextColor};
  }

  & .usecase-note {
    fill: ${options.noteBkgColor};
    stroke: ${options.noteBorderColor};
    color: ${options.noteTextColor};
  }

  & .usecase-note .nodeLabel {
    color: ${options.noteTextColor};
    fill: ${options.noteTextColor};
  }

  & .usecase-json-table,
  & .usecase-json-table rect,
  & .usecase-json-cell {
    fill: ${options.mainBkg};
    stroke: ${options.nodeBorder ?? options.primaryColor};
  }

  & .usecase-json-title,
  & .usecase-json-key,
  & .usecase-json-value {
    color: ${options.primaryTextColor};
    fill: ${options.primaryTextColor};
  }

  & .relationship {
    fill: none;
    stroke: ${options.lineColor};
  }

  & .relationship-include,
  & .relationship-extend,
  & .relationship-note {
    stroke-dasharray: 3;
  }

  /* Include and extend are both dashed, which is a weak distinction at small sizes. The
     tokens default to \`lineColor\`, so a theme that does not set them is unchanged. */
  & .relationship-include {
    stroke: ${role.includeLine};
  }

  & .relationship-extend {
    stroke: ${role.extendLine};
  }

  & .relationship.edge-animation-fast,
  & .relationship.edge-animation-slow {
    stroke-linecap: round;
  }

  & .edgeLabel,
  & .edgeLabel p {
    background-color: ${options.edgeLabelBackground};
  }

  & .labelBkg {
    background-color: ${options.edgeLabelBackground};
    padding: 0 2px;
  }

  & .edgeLabel .label rect {
    fill: ${options.edgeLabelBackground};
  }

  & .relationship-label,
  & .edgeLabel {
    color: ${options.primaryTextColor};
    fill: ${options.primaryTextColor};
    font-family: ${options.fontFamily};
    font-size: 10px;
    font-weight: normal;
  }

  & .marker,
  & .marker.point,
  & .marker.circle,
  & .marker.cross {
    fill: ${options.lineColor};
    stroke: ${options.lineColor};
  }

  & .marker.extension {
    fill: ${options.mainBkg};
    stroke: ${options.lineColor};
  }
`;
}, "getStyles");
var styles_default = getStyles;

// src/diagrams/usecase/usecaseDiagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles: styles_default
};
export {
  diagram
};
