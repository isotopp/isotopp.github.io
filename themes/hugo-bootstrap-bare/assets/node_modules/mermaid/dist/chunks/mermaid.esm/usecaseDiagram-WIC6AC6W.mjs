import {
  getDiagramElement
} from "./chunk-CJTOMMB5.mjs";
import {
  setupViewPortForSVG
} from "./chunk-SIH72CRC.mjs";
import {
  getRegisteredLayoutAlgorithm,
  render
} from "./chunk-YVPGI2KZ.mjs";
import "./chunk-AWL6KFTE.mjs";
import "./chunk-3YANZBYF.mjs";
import "./chunk-RLXJHMIZ.mjs";
import "./chunk-XQFSI344.mjs";
import "./chunk-VFTINRM2.mjs";
import "./chunk-AWAWVJFC.mjs";
import "./chunk-BV5P2MC3.mjs";
import {
  markdownToLines
} from "./chunk-VTNK77LY.mjs";
import "./chunk-5QBFSAUC.mjs";
import {
  hasPalette,
  isColorTheme,
  paletteSlotCount,
  safeLook
} from "./chunk-K2DFZHL5.mjs";
import {
  utils_default
} from "./chunk-PIRVTUE5.mjs";
import "./chunk-445WJIJ4.mjs";
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
} from "./chunk-DLUCIBNR.mjs";
import {
  log,
  select_default
} from "./chunk-OHNBJXQ2.mjs";
import {
  __name
} from "./chunk-35ZOQMXA.mjs";

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

// ../../node_modules/.pnpm/@chevrotain+utils@13.2.0/node_modules/@chevrotain/utils/lib/src/print.js
function PRINT_ERROR(msg) {
  if (console && console.error) {
    console.error(`Error: ${msg}`);
  }
}
__name(PRINT_ERROR, "PRINT_ERROR");
function PRINT_WARNING(msg) {
  if (console && console.warn) {
    console.warn(`Warning: ${msg}`);
  }
}
__name(PRINT_WARNING, "PRINT_WARNING");

// ../../node_modules/.pnpm/@chevrotain+utils@13.2.0/node_modules/@chevrotain/utils/lib/src/timer.js
function timer(func) {
  const start = (/* @__PURE__ */ new Date()).getTime();
  const val = func();
  const end = (/* @__PURE__ */ new Date()).getTime();
  const total = end - start;
  return { time: total, value: val };
}
__name(timer, "timer");

// ../../node_modules/.pnpm/@chevrotain+utils@13.2.0/node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
function toFastProperties(toBecomeFast) {
  function FakeConstructor() {
  }
  __name(FakeConstructor, "FakeConstructor");
  FakeConstructor.prototype = toBecomeFast;
  const fakeInstance = new FakeConstructor();
  function fakeAccess() {
    return typeof fakeInstance.bar;
  }
  __name(fakeAccess, "fakeAccess");
  fakeAccess();
  fakeAccess();
  if (1)
    return toBecomeFast;
  (0, eval)(toBecomeFast);
}
__name(toFastProperties, "toFastProperties");

// ../../node_modules/.pnpm/@chevrotain+gast@13.2.0/node_modules/@chevrotain/gast/lib/src/model.js
function tokenLabel(tokType) {
  if (hasTokenLabel(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
__name(tokenLabel, "tokenLabel");
function hasTokenLabel(obj) {
  return typeof obj.LABEL === "string" && obj.LABEL !== "";
}
__name(hasTokenLabel, "hasTokenLabel");
var AbstractProduction = class {
  static {
    __name(this, "AbstractProduction");
  }
  get definition() {
    return this._definition;
  }
  set definition(value) {
    this._definition = value;
  }
  constructor(_definition) {
    this._definition = _definition;
  }
  accept(visitor) {
    visitor.visit(this);
    this.definition.forEach((prod) => {
      prod.accept(visitor);
    });
  }
};
var NonTerminal = class extends AbstractProduction {
  static {
    __name(this, "NonTerminal");
  }
  constructor(options) {
    super([]);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
  set definition(definition) {
  }
  get definition() {
    if (this.referencedRule !== void 0) {
      return this.referencedRule.definition;
    }
    return [];
  }
  accept(visitor) {
    visitor.visit(this);
  }
};
var Rule = class extends AbstractProduction {
  static {
    __name(this, "Rule");
  }
  constructor(options) {
    super(options.definition);
    this.orgText = "";
    Object.assign(this, pickOnlyDefined(options));
  }
};
var Alternative = class extends AbstractProduction {
  static {
    __name(this, "Alternative");
  }
  constructor(options) {
    super(options.definition);
    this.ignoreAmbiguities = false;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var Option = class extends AbstractProduction {
  static {
    __name(this, "Option");
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var RepetitionMandatory = class extends AbstractProduction {
  static {
    __name(this, "RepetitionMandatory");
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var RepetitionMandatoryWithSeparator = class extends AbstractProduction {
  static {
    __name(this, "RepetitionMandatoryWithSeparator");
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var Repetition = class extends AbstractProduction {
  static {
    __name(this, "Repetition");
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var RepetitionWithSeparator = class extends AbstractProduction {
  static {
    __name(this, "RepetitionWithSeparator");
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var Alternation = class extends AbstractProduction {
  static {
    __name(this, "Alternation");
  }
  get definition() {
    return this._definition;
  }
  set definition(value) {
    this._definition = value;
  }
  constructor(options) {
    super(options.definition);
    this.idx = 1;
    this.ignoreAmbiguities = false;
    this.hasPredicates = false;
    Object.assign(this, pickOnlyDefined(options));
  }
};
var Terminal = class {
  static {
    __name(this, "Terminal");
  }
  constructor(options) {
    this.idx = 1;
    Object.assign(this, pickOnlyDefined(options));
  }
  accept(visitor) {
    visitor.visit(this);
  }
};
function serializeGrammar(topRules) {
  return topRules.map(serializeProduction);
}
__name(serializeGrammar, "serializeGrammar");
function serializeProduction(node) {
  function convertDefinition(definition) {
    return definition.map(serializeProduction);
  }
  __name(convertDefinition, "convertDefinition");
  if (node instanceof NonTerminal) {
    const serializedNonTerminal = {
      type: "NonTerminal",
      name: node.nonTerminalName,
      idx: node.idx
    };
    if (typeof node.label === "string") {
      serializedNonTerminal.label = node.label;
    }
    return serializedNonTerminal;
  } else if (node instanceof Alternative) {
    return {
      type: "Alternative",
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Option) {
    return {
      type: "Option",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatory) {
    return {
      type: "RepetitionMandatory",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionMandatoryWithSeparator) {
    return {
      type: "RepetitionMandatoryWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof RepetitionWithSeparator) {
    return {
      type: "RepetitionWithSeparator",
      idx: node.idx,
      separator: serializeProduction(new Terminal({ terminalType: node.separator })),
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Repetition) {
    return {
      type: "Repetition",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Alternation) {
    return {
      type: "Alternation",
      idx: node.idx,
      definition: convertDefinition(node.definition)
    };
  } else if (node instanceof Terminal) {
    const serializedTerminal = {
      type: "Terminal",
      name: node.terminalType.name,
      label: tokenLabel(node.terminalType),
      idx: node.idx
    };
    if (typeof node.label === "string") {
      serializedTerminal.terminalLabel = node.label;
    }
    const pattern = node.terminalType.PATTERN;
    if (node.terminalType.PATTERN) {
      serializedTerminal.pattern = pattern instanceof RegExp ? pattern.source : pattern;
    }
    return serializedTerminal;
  } else if (node instanceof Rule) {
    return {
      type: "Rule",
      name: node.name,
      orgText: node.orgText,
      definition: convertDefinition(node.definition)
    };
  } else {
    throw Error("non exhaustive match");
  }
}
__name(serializeProduction, "serializeProduction");
function pickOnlyDefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== void 0));
}
__name(pickOnlyDefined, "pickOnlyDefined");

// ../../node_modules/.pnpm/@chevrotain+gast@13.2.0/node_modules/@chevrotain/gast/lib/src/visitor.js
var GAstVisitor = class {
  static {
    __name(this, "GAstVisitor");
  }
  visit(node) {
    const nodeAny = node;
    switch (nodeAny.constructor) {
      case NonTerminal:
        return this.visitNonTerminal(nodeAny);
      case Alternative:
        return this.visitAlternative(nodeAny);
      case Option:
        return this.visitOption(nodeAny);
      case RepetitionMandatory:
        return this.visitRepetitionMandatory(nodeAny);
      case RepetitionMandatoryWithSeparator:
        return this.visitRepetitionMandatoryWithSeparator(nodeAny);
      case RepetitionWithSeparator:
        return this.visitRepetitionWithSeparator(nodeAny);
      case Repetition:
        return this.visitRepetition(nodeAny);
      case Alternation:
        return this.visitAlternation(nodeAny);
      case Terminal:
        return this.visitTerminal(nodeAny);
      case Rule:
        return this.visitRule(nodeAny);
      /* c8 ignore next 2 */
      default:
        throw Error("non exhaustive match");
    }
  }
  /* c8 ignore next */
  visitNonTerminal(node) {
  }
  /* c8 ignore next */
  visitAlternative(node) {
  }
  /* c8 ignore next */
  visitOption(node) {
  }
  /* c8 ignore next */
  visitRepetition(node) {
  }
  /* c8 ignore next */
  visitRepetitionMandatory(node) {
  }
  /* c8 ignore next 3 */
  visitRepetitionMandatoryWithSeparator(node) {
  }
  /* c8 ignore next */
  visitRepetitionWithSeparator(node) {
  }
  /* c8 ignore next */
  visitAlternation(node) {
  }
  /* c8 ignore next */
  visitTerminal(node) {
  }
  /* c8 ignore next */
  visitRule(node) {
  }
};

// ../../node_modules/.pnpm/@chevrotain+gast@13.2.0/node_modules/@chevrotain/gast/lib/src/helpers.js
function isSequenceProd(prod) {
  return prod instanceof Alternative || prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
}
__name(isSequenceProd, "isSequenceProd");
function isOptionalProd(prod, alreadyVisited = []) {
  const isDirectlyOptional = prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionWithSeparator;
  if (isDirectlyOptional) {
    return true;
  }
  if (prod instanceof Alternation) {
    return prod.definition.some((subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else if (prod instanceof NonTerminal && alreadyVisited.includes(prod)) {
    return false;
  } else if (prod instanceof AbstractProduction) {
    if (prod instanceof NonTerminal) {
      alreadyVisited.push(prod);
    }
    return prod.definition.every((subProd) => {
      return isOptionalProd(subProd, alreadyVisited);
    });
  } else {
    return false;
  }
}
__name(isOptionalProd, "isOptionalProd");
function isBranchingProd(prod) {
  return prod instanceof Alternation;
}
__name(isBranchingProd, "isBranchingProd");
function getProductionDslName(prod) {
  if (prod instanceof NonTerminal) {
    return "SUBRULE";
  } else if (prod instanceof Option) {
    return "OPTION";
  } else if (prod instanceof Alternation) {
    return "OR";
  } else if (prod instanceof RepetitionMandatory) {
    return "AT_LEAST_ONE";
  } else if (prod instanceof RepetitionMandatoryWithSeparator) {
    return "AT_LEAST_ONE_SEP";
  } else if (prod instanceof RepetitionWithSeparator) {
    return "MANY_SEP";
  } else if (prod instanceof Repetition) {
    return "MANY";
  } else if (prod instanceof Terminal) {
    return "CONSUME";
  } else {
    throw Error("non exhaustive match");
  }
}
__name(getProductionDslName, "getProductionDslName");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/rest.js
var RestWalker = class {
  static {
    __name(this, "RestWalker");
  }
  walk(prod, prevRest = []) {
    prod.definition.forEach((subProd, index) => {
      const currRest = prod.definition.slice(index + 1);
      if (subProd instanceof NonTerminal) {
        this.walkProdRef(subProd, currRest, prevRest);
      } else if (subProd instanceof Terminal) {
        this.walkTerminal(subProd, currRest, prevRest);
      } else if (subProd instanceof Alternative) {
        this.walkFlat(subProd, currRest, prevRest);
      } else if (subProd instanceof Option) {
        this.walkOption(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionMandatory) {
        this.walkAtLeastOne(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionMandatoryWithSeparator) {
        this.walkAtLeastOneSep(subProd, currRest, prevRest);
      } else if (subProd instanceof RepetitionWithSeparator) {
        this.walkManySep(subProd, currRest, prevRest);
      } else if (subProd instanceof Repetition) {
        this.walkMany(subProd, currRest, prevRest);
      } else if (subProd instanceof Alternation) {
        this.walkOr(subProd, currRest, prevRest);
      } else {
        throw Error("non exhaustive match");
      }
    });
  }
  walkTerminal(terminal, currRest, prevRest) {
  }
  walkProdRef(refProd, currRest, prevRest) {
  }
  walkFlat(flatProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    this.walk(flatProd, fullOrRest);
  }
  walkOption(optionProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    this.walk(optionProd, fullOrRest);
  }
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    const fullAtLeastOneRest = [
      new Option({ definition: atLeastOneProd.definition })
    ].concat(currRest, prevRest);
    this.walk(atLeastOneProd, fullAtLeastOneRest);
  }
  walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
    const fullAtLeastOneSepRest = restForRepetitionWithSeparator(atLeastOneSepProd, currRest, prevRest);
    this.walk(atLeastOneSepProd, fullAtLeastOneSepRest);
  }
  walkMany(manyProd, currRest, prevRest) {
    const fullManyRest = [
      new Option({ definition: manyProd.definition })
    ].concat(currRest, prevRest);
    this.walk(manyProd, fullManyRest);
  }
  walkManySep(manySepProd, currRest, prevRest) {
    const fullManySepRest = restForRepetitionWithSeparator(manySepProd, currRest, prevRest);
    this.walk(manySepProd, fullManySepRest);
  }
  walkOr(orProd, currRest, prevRest) {
    const fullOrRest = currRest.concat(prevRest);
    orProd.definition.forEach((alt) => {
      const prodWrapper = new Alternative({ definition: [alt] });
      this.walk(prodWrapper, fullOrRest);
    });
  }
};
function restForRepetitionWithSeparator(repSepProd, currRest, prevRest) {
  const repSepRest = [
    new Option({
      definition: [
        new Terminal({ terminalType: repSepProd.separator })
      ].concat(repSepProd.definition)
    })
  ];
  const fullRepSepRest = repSepRest.concat(currRest, prevRest);
  return fullRepSepRest;
}
__name(restForRepetitionWithSeparator, "restForRepetitionWithSeparator");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/first.js
function first(prod) {
  if (prod instanceof NonTerminal) {
    return first(prod.referencedRule);
  } else if (prod instanceof Terminal) {
    return firstForTerminal(prod);
  } else if (isSequenceProd(prod)) {
    return firstForSequence(prod);
  } else if (isBranchingProd(prod)) {
    return firstForBranching(prod);
  } else {
    throw Error("non exhaustive match");
  }
}
__name(first, "first");
function firstForSequence(prod) {
  let firstSet = [];
  const seq = prod.definition;
  let nextSubProdIdx = 0;
  let hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  let currSubProd;
  let isLastInnerProdOptional = true;
  while (hasInnerProdsRemaining && isLastInnerProdOptional) {
    currSubProd = seq[nextSubProdIdx];
    isLastInnerProdOptional = isOptionalProd(currSubProd);
    firstSet = firstSet.concat(first(currSubProd));
    nextSubProdIdx = nextSubProdIdx + 1;
    hasInnerProdsRemaining = seq.length > nextSubProdIdx;
  }
  return [...new Set(firstSet)];
}
__name(firstForSequence, "firstForSequence");
function firstForBranching(prod) {
  const allAlternativesFirsts = prod.definition.map((innerProd) => {
    return first(innerProd);
  });
  return [...new Set(allAlternativesFirsts.flat())];
}
__name(firstForBranching, "firstForBranching");
function firstForTerminal(terminal) {
  return [terminal.terminalType];
}
__name(firstForTerminal, "firstForTerminal");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/constants.js
var IN = "_~IN~_";

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/follow.js
var ResyncFollowsWalker = class extends RestWalker {
  static {
    __name(this, "ResyncFollowsWalker");
  }
  constructor(topProd) {
    super();
    this.topProd = topProd;
    this.follows = {};
  }
  startWalking() {
    this.walk(this.topProd);
    return this.follows;
  }
  walkTerminal(terminal, currRest, prevRest) {
  }
  walkProdRef(refProd, currRest, prevRest) {
    const followName = buildBetweenProdsFollowPrefix(refProd.referencedRule, refProd.idx) + this.topProd.name;
    const fullRest = currRest.concat(prevRest);
    const restProd = new Alternative({ definition: fullRest });
    const t_in_topProd_follows = first(restProd);
    this.follows[followName] = t_in_topProd_follows;
  }
};
function computeAllProdsFollows(topProductions) {
  const reSyncFollows = {};
  topProductions.forEach((topProd) => {
    const currRefsFollow = new ResyncFollowsWalker(topProd).startWalking();
    Object.assign(reSyncFollows, currRefsFollow);
  });
  return reSyncFollows;
}
__name(computeAllProdsFollows, "computeAllProdsFollows");
function buildBetweenProdsFollowPrefix(inner, occurenceInParent) {
  return inner.name + occurenceInParent + IN;
}
__name(buildBetweenProdsFollowPrefix, "buildBetweenProdsFollowPrefix");

// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@13.2.0/node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
function cc(char) {
  return char.charCodeAt(0);
}
__name(cc, "cc");
function insertToSet(item, set) {
  if (Array.isArray(item)) {
    item.forEach(function(subItem) {
      set.push(subItem);
    });
  } else {
    set.push(item);
  }
}
__name(insertToSet, "insertToSet");
function addFlag(flagObj, flagKey) {
  if (flagObj[flagKey] === true) {
    throw "duplicate flag " + flagKey;
  }
  const x = flagObj[flagKey];
  flagObj[flagKey] = true;
}
__name(addFlag, "addFlag");
function ASSERT_EXISTS(obj) {
  if (obj === void 0) {
    throw Error("Internal Error - Should never get here!");
  }
  return true;
}
__name(ASSERT_EXISTS, "ASSERT_EXISTS");
function ASSERT_NEVER_REACH_HERE() {
  throw Error("Internal Error - Should never get here!");
}
__name(ASSERT_NEVER_REACH_HERE, "ASSERT_NEVER_REACH_HERE");
function isCharacter(obj) {
  return obj["type"] === "Character";
}
__name(isCharacter, "isCharacter");

// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@13.2.0/node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
var digitsCharCodes = [];
for (let i = cc("0"); i <= cc("9"); i++) {
  digitsCharCodes.push(i);
}
var wordCharCodes = [cc("_")].concat(digitsCharCodes);
for (let i = cc("a"); i <= cc("z"); i++) {
  wordCharCodes.push(i);
}
for (let i = cc("A"); i <= cc("Z"); i++) {
  wordCharCodes.push(i);
}
var whitespaceCodes = [
  cc(" "),
  cc("\f"),
  cc("\n"),
  cc("\r"),
  cc("	"),
  cc("\v"),
  cc("	"),
  cc("\xA0"),
  cc("\u1680"),
  cc("\u2000"),
  cc("\u2001"),
  cc("\u2002"),
  cc("\u2003"),
  cc("\u2004"),
  cc("\u2005"),
  cc("\u2006"),
  cc("\u2007"),
  cc("\u2008"),
  cc("\u2009"),
  cc("\u200A"),
  cc("\u2028"),
  cc("\u2029"),
  cc("\u202F"),
  cc("\u205F"),
  cc("\u3000"),
  cc("\uFEFF")
];

// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@13.2.0/node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
var hexDigitPattern = /[0-9a-fA-F]/;
var decimalPattern = /[0-9]/;
var decimalPatternNoZero = /[1-9]/;
var RegExpParser = class {
  static {
    __name(this, "RegExpParser");
  }
  constructor() {
    this.idx = 0;
    this.input = "";
    this.groupIdx = 0;
  }
  saveState() {
    return {
      idx: this.idx,
      input: this.input,
      groupIdx: this.groupIdx
    };
  }
  restoreState(newState) {
    this.idx = newState.idx;
    this.input = newState.input;
    this.groupIdx = newState.groupIdx;
  }
  pattern(input) {
    this.idx = 0;
    this.input = input;
    this.groupIdx = 0;
    this.consumeChar("/");
    const value = this.disjunction();
    this.consumeChar("/");
    const flags = {
      type: "Flags",
      loc: { begin: this.idx, end: input.length },
      global: false,
      ignoreCase: false,
      multiLine: false,
      unicode: false,
      sticky: false
    };
    while (this.isRegExpFlag()) {
      switch (this.popChar()) {
        case "g":
          addFlag(flags, "global");
          break;
        case "i":
          addFlag(flags, "ignoreCase");
          break;
        case "m":
          addFlag(flags, "multiLine");
          break;
        case "u":
          addFlag(flags, "unicode");
          break;
        case "y":
          addFlag(flags, "sticky");
          break;
      }
    }
    if (this.idx !== this.input.length) {
      throw Error("Redundant input: " + this.input.substring(this.idx));
    }
    return {
      type: "Pattern",
      flags,
      value,
      loc: this.loc(0)
    };
  }
  disjunction() {
    const alts = [];
    const begin = this.idx;
    alts.push(this.alternative());
    while (this.peekChar() === "|") {
      this.consumeChar("|");
      alts.push(this.alternative());
    }
    return { type: "Disjunction", value: alts, loc: this.loc(begin) };
  }
  alternative() {
    const terms = [];
    const begin = this.idx;
    while (this.isTerm()) {
      terms.push(this.term());
    }
    return { type: "Alternative", value: terms, loc: this.loc(begin) };
  }
  term() {
    if (this.isAssertion()) {
      return this.assertion();
    } else {
      return this.atom();
    }
  }
  assertion() {
    const begin = this.idx;
    switch (this.popChar()) {
      case "^":
        return {
          type: "StartAnchor",
          loc: this.loc(begin)
        };
      case "$":
        return { type: "EndAnchor", loc: this.loc(begin) };
      // '\b' or '\B'
      case "\\":
        switch (this.popChar()) {
          case "b":
            return {
              type: "WordBoundary",
              loc: this.loc(begin)
            };
          case "B":
            return {
              type: "NonWordBoundary",
              loc: this.loc(begin)
            };
        }
        throw Error("Invalid Assertion Escape");
      // '(?=' or '(?!'
      case "(":
        this.consumeChar("?");
        let type;
        switch (this.popChar()) {
          case "=":
            type = "Lookahead";
            break;
          case "!":
            type = "NegativeLookahead";
            break;
          case "<": {
            switch (this.popChar()) {
              case "=":
                type = "Lookbehind";
                break;
              case "!":
                type = "NegativeLookbehind";
            }
            break;
          }
        }
        ASSERT_EXISTS(type);
        const disjunction = this.disjunction();
        this.consumeChar(")");
        return {
          type,
          value: disjunction,
          loc: this.loc(begin)
        };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  quantifier(isBacktracking = false) {
    let range = void 0;
    const begin = this.idx;
    switch (this.popChar()) {
      case "*":
        range = {
          atLeast: 0,
          atMost: Infinity
        };
        break;
      case "+":
        range = {
          atLeast: 1,
          atMost: Infinity
        };
        break;
      case "?":
        range = {
          atLeast: 0,
          atMost: 1
        };
        break;
      case "{":
        const atLeast = this.integerIncludingZero();
        switch (this.popChar()) {
          case "}":
            range = {
              atLeast,
              atMost: atLeast
            };
            break;
          case ",":
            let atMost;
            if (this.isDigit()) {
              atMost = this.integerIncludingZero();
              range = {
                atLeast,
                atMost
              };
            } else {
              range = {
                atLeast,
                atMost: Infinity
              };
            }
            this.consumeChar("}");
            break;
        }
        if (isBacktracking === true && range === void 0) {
          return void 0;
        }
        ASSERT_EXISTS(range);
        break;
    }
    if (isBacktracking === true && range === void 0) {
      return void 0;
    }
    if (ASSERT_EXISTS(range)) {
      if (this.peekChar(0) === "?") {
        this.consumeChar("?");
        range.greedy = false;
      } else {
        range.greedy = true;
      }
      range.type = "Quantifier";
      range.loc = this.loc(begin);
      return range;
    }
  }
  atom() {
    let atom;
    const begin = this.idx;
    switch (this.peekChar()) {
      case ".":
        atom = this.dotAll();
        break;
      case "\\":
        atom = this.atomEscape();
        break;
      case "[":
        atom = this.characterClass();
        break;
      case "(":
        atom = this.group();
        break;
    }
    if (atom === void 0 && this.isPatternCharacter()) {
      atom = this.patternCharacter();
    }
    if (ASSERT_EXISTS(atom)) {
      atom.loc = this.loc(begin);
      if (this.isQuantifier()) {
        atom.quantifier = this.quantifier();
      }
      return atom;
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  dotAll() {
    this.consumeChar(".");
    return {
      type: "Set",
      complement: true,
      value: [cc("\n"), cc("\r"), cc("\u2028"), cc("\u2029")]
    };
  }
  atomEscape() {
    this.consumeChar("\\");
    switch (this.peekChar()) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return this.decimalEscapeAtom();
      case "d":
      case "D":
      case "s":
      case "S":
      case "w":
      case "W":
        return this.characterClassEscape();
      case "f":
      case "n":
      case "r":
      case "t":
      case "v":
        return this.controlEscapeAtom();
      case "c":
        return this.controlLetterEscapeAtom();
      case "0":
        return this.nulCharacterAtom();
      case "x":
        return this.hexEscapeSequenceAtom();
      case "u":
        return this.regExpUnicodeEscapeSequenceAtom();
      default:
        return this.identityEscapeAtom();
    }
  }
  decimalEscapeAtom() {
    const value = this.positiveInteger();
    return { type: "GroupBackReference", value };
  }
  characterClassEscape() {
    let set;
    let complement = false;
    switch (this.popChar()) {
      case "d":
        set = digitsCharCodes;
        break;
      case "D":
        set = digitsCharCodes;
        complement = true;
        break;
      case "s":
        set = whitespaceCodes;
        break;
      case "S":
        set = whitespaceCodes;
        complement = true;
        break;
      case "w":
        set = wordCharCodes;
        break;
      case "W":
        set = wordCharCodes;
        complement = true;
        break;
    }
    if (ASSERT_EXISTS(set)) {
      return { type: "Set", value: set, complement };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  controlEscapeAtom() {
    let escapeCode;
    switch (this.popChar()) {
      case "f":
        escapeCode = cc("\f");
        break;
      case "n":
        escapeCode = cc("\n");
        break;
      case "r":
        escapeCode = cc("\r");
        break;
      case "t":
        escapeCode = cc("	");
        break;
      case "v":
        escapeCode = cc("\v");
        break;
    }
    if (ASSERT_EXISTS(escapeCode)) {
      return { type: "Character", value: escapeCode };
    }
    return ASSERT_NEVER_REACH_HERE();
  }
  controlLetterEscapeAtom() {
    this.consumeChar("c");
    const letter = this.popChar();
    if (/[a-zA-Z]/.test(letter) === false) {
      throw Error("Invalid ");
    }
    const letterCode = letter.toUpperCase().charCodeAt(0) - 64;
    return { type: "Character", value: letterCode };
  }
  nulCharacterAtom() {
    this.consumeChar("0");
    return { type: "Character", value: cc("\0") };
  }
  hexEscapeSequenceAtom() {
    this.consumeChar("x");
    return this.parseHexDigits(2);
  }
  regExpUnicodeEscapeSequenceAtom() {
    this.consumeChar("u");
    return this.parseHexDigits(4);
  }
  identityEscapeAtom() {
    const escapedChar = this.popChar();
    return { type: "Character", value: cc(escapedChar) };
  }
  classPatternCharacterAtom() {
    switch (this.peekChar()) {
      // istanbul ignore next
      case "\n":
      // istanbul ignore next
      case "\r":
      // istanbul ignore next
      case "\u2028":
      // istanbul ignore next
      case "\u2029":
      // istanbul ignore next
      case "\\":
      // istanbul ignore next
      case "]":
        throw Error("TBD");
      default:
        const nextChar = this.popChar();
        return { type: "Character", value: cc(nextChar) };
    }
  }
  characterClass() {
    const set = [];
    let complement = false;
    this.consumeChar("[");
    if (this.peekChar(0) === "^") {
      this.consumeChar("^");
      complement = true;
    }
    while (this.isClassAtom()) {
      const from = this.classAtom();
      const isFromSingleChar = from.type === "Character";
      if (isCharacter(from) && this.isRangeDash()) {
        this.consumeChar("-");
        const to = this.classAtom();
        const isToSingleChar = to.type === "Character";
        if (isCharacter(to)) {
          if (to.value < from.value) {
            throw Error("Range out of order in character class");
          }
          set.push({ from: from.value, to: to.value });
        } else {
          insertToSet(from.value, set);
          set.push(cc("-"));
          insertToSet(to.value, set);
        }
      } else {
        insertToSet(from.value, set);
      }
    }
    this.consumeChar("]");
    return { type: "Set", complement, value: set };
  }
  classAtom() {
    switch (this.peekChar()) {
      // istanbul ignore next
      case "]":
      // istanbul ignore next
      case "\n":
      // istanbul ignore next
      case "\r":
      // istanbul ignore next
      case "\u2028":
      // istanbul ignore next
      case "\u2029":
        throw Error("TBD");
      case "\\":
        return this.classEscape();
      default:
        return this.classPatternCharacterAtom();
    }
  }
  classEscape() {
    this.consumeChar("\\");
    switch (this.peekChar()) {
      // Matches a backspace.
      // (Not to be confused with \b word boundary outside characterClass)
      case "b":
        this.consumeChar("b");
        return { type: "Character", value: cc("\b") };
      case "d":
      case "D":
      case "s":
      case "S":
      case "w":
      case "W":
        return this.characterClassEscape();
      case "f":
      case "n":
      case "r":
      case "t":
      case "v":
        return this.controlEscapeAtom();
      case "c":
        return this.controlLetterEscapeAtom();
      case "0":
        return this.nulCharacterAtom();
      case "x":
        return this.hexEscapeSequenceAtom();
      case "u":
        return this.regExpUnicodeEscapeSequenceAtom();
      default:
        return this.identityEscapeAtom();
    }
  }
  group() {
    let capturing = true;
    this.consumeChar("(");
    switch (this.peekChar(0)) {
      case "?":
        this.consumeChar("?");
        this.consumeChar(":");
        capturing = false;
        break;
      default:
        this.groupIdx++;
        break;
    }
    const value = this.disjunction();
    this.consumeChar(")");
    const groupAst = {
      type: "Group",
      capturing,
      value
    };
    if (capturing) {
      groupAst["idx"] = this.groupIdx;
    }
    return groupAst;
  }
  positiveInteger() {
    let number = this.popChar();
    if (decimalPatternNoZero.test(number) === false) {
      throw Error("Expecting a positive integer");
    }
    while (decimalPattern.test(this.peekChar(0))) {
      number += this.popChar();
    }
    return parseInt(number, 10);
  }
  integerIncludingZero() {
    let number = this.popChar();
    if (decimalPattern.test(number) === false) {
      throw Error("Expecting an integer");
    }
    while (decimalPattern.test(this.peekChar(0))) {
      number += this.popChar();
    }
    return parseInt(number, 10);
  }
  patternCharacter() {
    const nextChar = this.popChar();
    switch (nextChar) {
      // istanbul ignore next
      case "\n":
      // istanbul ignore next
      case "\r":
      // istanbul ignore next
      case "\u2028":
      // istanbul ignore next
      case "\u2029":
      // istanbul ignore next
      case "^":
      // istanbul ignore next
      case "$":
      // istanbul ignore next
      case "\\":
      // istanbul ignore next
      case ".":
      // istanbul ignore next
      case "*":
      // istanbul ignore next
      case "+":
      // istanbul ignore next
      case "?":
      // istanbul ignore next
      case "(":
      // istanbul ignore next
      case ")":
      // istanbul ignore next
      case "[":
      // istanbul ignore next
      case "|":
        throw Error("TBD");
      default:
        return { type: "Character", value: cc(nextChar) };
    }
  }
  isRegExpFlag() {
    switch (this.peekChar(0)) {
      case "g":
      case "i":
      case "m":
      case "u":
      case "y":
        return true;
      default:
        return false;
    }
  }
  isRangeDash() {
    return this.peekChar() === "-" && this.isClassAtom(1);
  }
  isDigit() {
    return decimalPattern.test(this.peekChar(0));
  }
  isClassAtom(howMuch = 0) {
    switch (this.peekChar(howMuch)) {
      case "]":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        return false;
      default:
        return true;
    }
  }
  isTerm() {
    return this.isAtom() || this.isAssertion();
  }
  isAtom() {
    if (this.isPatternCharacter()) {
      return true;
    }
    switch (this.peekChar(0)) {
      case ".":
      case "\\":
      // atomEscape
      case "[":
      // characterClass
      // TODO: isAtom must be called before isAssertion - disambiguate
      case "(":
        return true;
      default:
        return false;
    }
  }
  isAssertion() {
    switch (this.peekChar(0)) {
      case "^":
      case "$":
        return true;
      // '\b' or '\B'
      case "\\":
        switch (this.peekChar(1)) {
          case "b":
          case "B":
            return true;
          default:
            return false;
        }
      // '(?=' or '(?!' or `(?<=` or `(?<!`
      case "(":
        return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!" || this.peekChar(2) === "<" && (this.peekChar(3) === "=" || this.peekChar(3) === "!"));
      default:
        return false;
    }
  }
  isQuantifier() {
    const prevState = this.saveState();
    try {
      return this.quantifier(true) !== void 0;
    } catch (e) {
      return false;
    } finally {
      this.restoreState(prevState);
    }
  }
  isPatternCharacter() {
    switch (this.peekChar()) {
      case "^":
      case "$":
      case "\\":
      case ".":
      case "*":
      case "+":
      case "?":
      case "(":
      case ")":
      case "[":
      case "|":
      case "/":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        return false;
      default:
        return true;
    }
  }
  parseHexDigits(howMany) {
    let hexString = "";
    for (let i = 0; i < howMany; i++) {
      const hexChar = this.popChar();
      if (hexDigitPattern.test(hexChar) === false) {
        throw Error("Expecting a HexDecimal digits");
      }
      hexString += hexChar;
    }
    const charCode = parseInt(hexString, 16);
    return { type: "Character", value: charCode };
  }
  peekChar(howMuch = 0) {
    return this.input[this.idx + howMuch];
  }
  popChar() {
    const nextChar = this.peekChar(0);
    this.consumeChar(void 0);
    return nextChar;
  }
  consumeChar(char) {
    if (char !== void 0 && this.input[this.idx] !== char) {
      throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
    }
    if (this.idx >= this.input.length) {
      throw Error("Unexpected end of input");
    }
    this.idx++;
  }
  loc(begin) {
    return { begin, end: this.idx };
  }
};

// ../../node_modules/.pnpm/@chevrotain+regexp-to-ast@13.2.0/node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
var BaseRegExpVisitor = class {
  static {
    __name(this, "BaseRegExpVisitor");
  }
  visitChildren(node) {
    for (const key in node) {
      const child = node[key];
      if (node.hasOwnProperty(key)) {
        if (child.type !== void 0) {
          this.visit(child);
        } else if (Array.isArray(child)) {
          child.forEach((subChild) => {
            this.visit(subChild);
          }, this);
        }
      }
    }
  }
  visit(node) {
    switch (node.type) {
      case "Pattern":
        this.visitPattern(node);
        break;
      case "Flags":
        this.visitFlags(node);
        break;
      case "Disjunction":
        this.visitDisjunction(node);
        break;
      case "Alternative":
        this.visitAlternative(node);
        break;
      case "StartAnchor":
        this.visitStartAnchor(node);
        break;
      case "EndAnchor":
        this.visitEndAnchor(node);
        break;
      case "WordBoundary":
        this.visitWordBoundary(node);
        break;
      case "NonWordBoundary":
        this.visitNonWordBoundary(node);
        break;
      case "Lookahead":
        this.visitLookahead(node);
        break;
      case "NegativeLookahead":
        this.visitNegativeLookahead(node);
        break;
      case "Lookbehind":
        this.visitLookbehind(node);
        break;
      case "NegativeLookbehind":
        this.visitNegativeLookbehind(node);
        break;
      case "Character":
        this.visitCharacter(node);
        break;
      case "Set":
        this.visitSet(node);
        break;
      case "Group":
        this.visitGroup(node);
        break;
      case "GroupBackReference":
        this.visitGroupBackReference(node);
        break;
      case "Quantifier":
        this.visitQuantifier(node);
        break;
    }
    this.visitChildren(node);
  }
  visitPattern(node) {
  }
  visitFlags(node) {
  }
  visitDisjunction(node) {
  }
  visitAlternative(node) {
  }
  // Assertion
  visitStartAnchor(node) {
  }
  visitEndAnchor(node) {
  }
  visitWordBoundary(node) {
  }
  visitNonWordBoundary(node) {
  }
  visitLookahead(node) {
  }
  visitNegativeLookahead(node) {
  }
  visitLookbehind(node) {
  }
  visitNegativeLookbehind(node) {
  }
  // atoms
  visitCharacter(node) {
  }
  visitSet(node) {
  }
  visitGroup(node) {
  }
  visitGroupBackReference(node) {
  }
  visitQuantifier(node) {
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/reg_exp_parser.js
var regExpAstCache = {};
var regExpParser = new RegExpParser();
function getRegExpAst(regExp) {
  const regExpStr = regExp.toString();
  if (regExpAstCache.hasOwnProperty(regExpStr)) {
    return regExpAstCache[regExpStr];
  } else {
    const regExpAst = regExpParser.pattern(regExpStr);
    regExpAstCache[regExpStr] = regExpAst;
    return regExpAst;
  }
}
__name(getRegExpAst, "getRegExpAst");
function clearRegExpParserCache() {
  regExpAstCache = {};
}
__name(clearRegExpParserCache, "clearRegExpParserCache");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/reg_exp.js
var complementErrorMessage = "Complement Sets are not supported for first char optimization";
var failedOptimizationPrefixMsg = 'Unable to use "first char" lexer optimizations:\n';
function getOptimizedStartCodesIndices(regExp, ensureOptimizations = false) {
  try {
    const ast = getRegExpAst(regExp);
    const firstChars = firstCharOptimizedIndices(ast.value, {}, ast.flags.ignoreCase);
    return firstChars;
  } catch (e) {
    if (e.message === complementErrorMessage) {
      if (ensureOptimizations) {
        PRINT_WARNING(`${failedOptimizationPrefixMsg}	Unable to optimize: < ${regExp.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
      }
    } else {
      let msgSuffix = "";
      if (ensureOptimizations) {
        msgSuffix = "\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.";
      }
      PRINT_ERROR(`${failedOptimizationPrefixMsg}
	Failed parsing: < ${regExp.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues` + msgSuffix);
    }
  }
  return [];
}
__name(getOptimizedStartCodesIndices, "getOptimizedStartCodesIndices");
function firstCharOptimizedIndices(ast, result, ignoreCase) {
  switch (ast.type) {
    case "Disjunction":
      for (let i = 0; i < ast.value.length; i++) {
        firstCharOptimizedIndices(ast.value[i], result, ignoreCase);
      }
      break;
    case "Alternative":
      const terms = ast.value;
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        switch (term.type) {
          case "EndAnchor":
          // A group back reference cannot affect potential starting char.
          // because if a back reference is the first production than automatically
          // the group being referenced has had to come BEFORE so its codes have already been added
          case "GroupBackReference":
          // assertions do not affect potential starting codes
          case "Lookahead":
          case "NegativeLookahead":
          case "Lookbehind":
          case "NegativeLookbehind":
          case "StartAnchor":
          case "WordBoundary":
          case "NonWordBoundary":
            continue;
        }
        const atom = term;
        switch (atom.type) {
          case "Character":
            addOptimizedIdxToResult(atom.value, result, ignoreCase);
            break;
          case "Set":
            if (atom.complement === true) {
              throw Error(complementErrorMessage);
            }
            atom.value.forEach((code) => {
              if (typeof code === "number") {
                addOptimizedIdxToResult(code, result, ignoreCase);
              } else {
                const range = code;
                if (ignoreCase === true) {
                  for (let rangeCode = range.from; rangeCode <= range.to; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                } else {
                  for (let rangeCode = range.from; rangeCode <= range.to && rangeCode < minOptimizationVal; rangeCode++) {
                    addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                  }
                  if (range.to >= minOptimizationVal) {
                    const minUnOptVal = range.from >= minOptimizationVal ? range.from : minOptimizationVal;
                    const maxUnOptVal = range.to;
                    const minOptIdx = charCodeToOptimizedIndex(minUnOptVal);
                    const maxOptIdx = charCodeToOptimizedIndex(maxUnOptVal);
                    for (let currOptIdx = minOptIdx; currOptIdx <= maxOptIdx; currOptIdx++) {
                      result[currOptIdx] = currOptIdx;
                    }
                  }
                }
              }
            });
            break;
          case "Group":
            firstCharOptimizedIndices(atom.value, result, ignoreCase);
            break;
          /* istanbul ignore next */
          default:
            throw Error("Non Exhaustive Match");
        }
        const isOptionalQuantifier = atom.quantifier !== void 0 && atom.quantifier.atLeast === 0;
        if (
          // A group may be optional due to empty contents /(?:)/
          // or if everything inside it is optional /((a)?)/
          atom.type === "Group" && isWholeOptional(atom) === false || // If this term is not a group it may only be optional if it has an optional quantifier
          atom.type !== "Group" && isOptionalQuantifier === false
        ) {
          break;
        }
      }
      break;
    /* istanbul ignore next */
    default:
      throw Error("non exhaustive match!");
  }
  return Object.values(result);
}
__name(firstCharOptimizedIndices, "firstCharOptimizedIndices");
function addOptimizedIdxToResult(code, result, ignoreCase) {
  const optimizedCharIdx = charCodeToOptimizedIndex(code);
  result[optimizedCharIdx] = optimizedCharIdx;
  if (ignoreCase === true) {
    handleIgnoreCase(code, result);
  }
}
__name(addOptimizedIdxToResult, "addOptimizedIdxToResult");
function handleIgnoreCase(code, result) {
  const char = String.fromCharCode(code);
  const upperChar = char.toUpperCase();
  if (upperChar !== char) {
    const optimizedCharIdx = charCodeToOptimizedIndex(upperChar.charCodeAt(0));
    result[optimizedCharIdx] = optimizedCharIdx;
  } else {
    const lowerChar = char.toLowerCase();
    if (lowerChar !== char) {
      const optimizedCharIdx = charCodeToOptimizedIndex(lowerChar.charCodeAt(0));
      result[optimizedCharIdx] = optimizedCharIdx;
    }
  }
}
__name(handleIgnoreCase, "handleIgnoreCase");
function findCode(setNode, targetCharCodes) {
  return setNode.value.find((codeOrRange) => {
    if (typeof codeOrRange === "number") {
      return targetCharCodes.includes(codeOrRange);
    } else {
      const range = codeOrRange;
      return targetCharCodes.find((targetCode) => range.from <= targetCode && targetCode <= range.to) !== void 0;
    }
  });
}
__name(findCode, "findCode");
function isWholeOptional(ast) {
  const quantifier = ast.quantifier;
  if (quantifier && quantifier.atLeast === 0) {
    return true;
  }
  if (!ast.value) {
    return false;
  }
  return Array.isArray(ast.value) ? ast.value.every(isWholeOptional) : isWholeOptional(ast.value);
}
__name(isWholeOptional, "isWholeOptional");
var CharCodeFinder = class extends BaseRegExpVisitor {
  static {
    __name(this, "CharCodeFinder");
  }
  constructor(targetCharCodes) {
    super();
    this.targetCharCodes = targetCharCodes;
    this.found = false;
  }
  visitChildren(node) {
    if (this.found === true) {
      return;
    }
    switch (node.type) {
      case "Lookahead":
        this.visitLookahead(node);
        return;
      case "NegativeLookahead":
        this.visitNegativeLookahead(node);
        return;
      case "Lookbehind":
        this.visitLookbehind(node);
        return;
      case "NegativeLookbehind":
        this.visitNegativeLookbehind(node);
        return;
    }
    super.visitChildren(node);
  }
  visitCharacter(node) {
    if (this.targetCharCodes.includes(node.value)) {
      this.found = true;
    }
  }
  visitSet(node) {
    if (node.complement) {
      if (findCode(node, this.targetCharCodes) === void 0) {
        this.found = true;
      }
    } else {
      if (findCode(node, this.targetCharCodes) !== void 0) {
        this.found = true;
      }
    }
  }
};
function canMatchCharCode(charCodes, pattern) {
  if (pattern instanceof RegExp) {
    const ast = getRegExpAst(pattern);
    const charCodeFinder = new CharCodeFinder(charCodes);
    charCodeFinder.visit(ast);
    return charCodeFinder.found;
  } else {
    for (const char of pattern) {
      const charCode = char.charCodeAt(0);
      if (charCodes.includes(charCode)) {
        return true;
      }
    }
    return false;
  }
}
__name(canMatchCharCode, "canMatchCharCode");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/lexer.js
var PATTERN = "PATTERN";
var DEFAULT_MODE = "defaultMode";
var MODES = "modes";
var SINGLE_CHAR_MATCH = 0;
var CUSTOM_MATCH = 1;
var REG_EXP_MATCH = 2;
var ASCII_CLASS_MATCH = 3;
function analyzeTokenTypes(tokenTypes, options) {
  options = Object.assign({ safeMode: false, positionTracking: "full", lineTerminatorCharacters: ["\r", "\n"], tracer: /* @__PURE__ */ __name((msg, action) => action(), "tracer") }, options);
  const tracer = options.tracer;
  tracer("initCharCodeToOptimizedIndexMap", () => {
    initCharCodeToOptimizedIndexMap();
  });
  let onlyRelevantTypes;
  tracer("Reject Lexer.NA", () => {
    onlyRelevantTypes = tokenTypes.filter((currType) => {
      return currType[PATTERN] !== Lexer.NA;
    });
  });
  let hasCustom = false;
  let allTransformedPatterns;
  tracer("Transform Patterns", () => {
    hasCustom = false;
    allTransformedPatterns = onlyRelevantTypes.map((currType) => {
      const currPattern = currType[PATTERN];
      if (currPattern instanceof RegExp) {
        const regExpSource = currPattern.source;
        if (regExpSource.length === 1 && // only these regExp meta characters which can appear in a length one regExp
        regExpSource !== "^" && regExpSource !== "$" && regExpSource !== "." && !currPattern.ignoreCase) {
          return regExpSource;
        } else if (regExpSource.length === 2 && regExpSource[0] === "\\" && // not a meta character
        ![
          "d",
          "D",
          "s",
          "S",
          "t",
          "r",
          "n",
          "t",
          "0",
          "c",
          "b",
          "B",
          "f",
          "v",
          "w",
          "W"
        ].includes(regExpSource[1])) {
          return regExpSource[1];
        } else {
          return addStickyFlag(currPattern);
        }
      } else if (typeof currPattern === "function") {
        hasCustom = true;
        return { exec: currPattern };
      } else if (typeof currPattern === "object") {
        hasCustom = true;
        return currPattern;
      } else if (typeof currPattern === "string") {
        if (currPattern.length === 1) {
          return currPattern;
        } else {
          const escapedRegExpString = currPattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
          const wrappedRegExp = new RegExp(escapedRegExpString);
          return addStickyFlag(wrappedRegExp);
        }
      } else {
        throw Error("non exhaustive match");
      }
    });
  });
  let patternIdxToType;
  let patternIdxToGroup;
  let patternIdxToLongerAltIdxArr;
  let patternIdxToPushMode;
  let patternIdxToPopMode;
  tracer("misc mapping", () => {
    patternIdxToType = onlyRelevantTypes.map((currType) => currType.tokenTypeIdx);
    patternIdxToGroup = onlyRelevantTypes.map((clazz) => {
      const groupName = clazz.GROUP;
      if (groupName === Lexer.SKIPPED) {
        return void 0;
      } else if (typeof groupName === "string") {
        return groupName;
      } else if (groupName === void 0) {
        return false;
      } else {
        throw Error("non exhaustive match");
      }
    });
    patternIdxToLongerAltIdxArr = onlyRelevantTypes.map((clazz) => {
      const longerAltType = clazz.LONGER_ALT;
      if (longerAltType) {
        const longerAltIdxArr = Array.isArray(longerAltType) ? longerAltType.map((type) => onlyRelevantTypes.indexOf(type)) : [onlyRelevantTypes.indexOf(longerAltType)];
        return longerAltIdxArr;
      }
    });
    patternIdxToPushMode = onlyRelevantTypes.map((clazz) => clazz.PUSH_MODE);
    patternIdxToPopMode = onlyRelevantTypes.map((clazz) => Object.hasOwn(clazz, "POP_MODE"));
  });
  let patternIdxToCanLineTerminator;
  tracer("Line Terminator Handling", () => {
    const lineTerminatorCharCodes = getCharCodes(options.lineTerminatorCharacters);
    patternIdxToCanLineTerminator = onlyRelevantTypes.map((tokType) => false);
    if (options.positionTracking !== "onlyOffset") {
      patternIdxToCanLineTerminator = onlyRelevantTypes.map((tokType) => {
        if (Object.hasOwn(tokType, "LINE_BREAKS")) {
          return !!tokType.LINE_BREAKS;
        } else {
          return checkLineBreaksIssues(tokType, lineTerminatorCharCodes) === false && canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
        }
      });
    }
  });
  let patternIdxToIsCustom;
  let patternIdxToShort;
  let emptyGroups;
  let patternIdxToConfig;
  tracer("Misc Mapping #2", () => {
    patternIdxToIsCustom = onlyRelevantTypes.map(isCustomPattern);
    patternIdxToShort = allTransformedPatterns.map(isShortPattern);
    emptyGroups = onlyRelevantTypes.reduce((acc, clazz) => {
      const groupName = clazz.GROUP;
      if (typeof groupName === "string" && !(groupName === Lexer.SKIPPED)) {
        acc[groupName] = [];
      }
      return acc;
    }, {});
    patternIdxToConfig = allTransformedPatterns.map((x, idx) => {
      const asciiClass = patternIdxToGroup[idx] === void 0 && patternIdxToLongerAltIdxArr[idx] === void 0 ? getAsciiClass(onlyRelevantTypes[idx].PATTERN) : void 0;
      return {
        pattern: allTransformedPatterns[idx],
        asciiClass,
        longerAlt: patternIdxToLongerAltIdxArr[idx],
        canLineTerminator: patternIdxToCanLineTerminator[idx],
        matchType: asciiClass !== void 0 ? ASCII_CLASS_MATCH : patternIdxToShort[idx] !== false ? SINGLE_CHAR_MATCH : patternIdxToIsCustom[idx] ? CUSTOM_MATCH : REG_EXP_MATCH,
        short: patternIdxToShort[idx],
        group: patternIdxToGroup[idx],
        push: patternIdxToPushMode[idx],
        pop: patternIdxToPopMode[idx],
        tokenTypeIdx: patternIdxToType[idx],
        tokenType: onlyRelevantTypes[idx]
      };
    });
  });
  let canBeOptimized = true;
  let charCodeToPatternIdxToConfig = [];
  if (!options.safeMode) {
    tracer("First Char Optimization", () => {
      charCodeToPatternIdxToConfig = onlyRelevantTypes.reduce((result, currTokType, idx) => {
        if (typeof currTokType.PATTERN === "string") {
          const charCode = currTokType.PATTERN.charCodeAt(0);
          const optimizedIdx = charCodeToOptimizedIndex(charCode);
          addToMapOfArrays(result, optimizedIdx, patternIdxToConfig[idx]);
        } else if (Array.isArray(currTokType.START_CHARS_HINT)) {
          let lastOptimizedIdx;
          currTokType.START_CHARS_HINT.forEach((charOrInt) => {
            const charCode = typeof charOrInt === "string" ? charOrInt.charCodeAt(0) : charOrInt;
            const currOptimizedIdx = charCodeToOptimizedIndex(charCode);
            if (lastOptimizedIdx !== currOptimizedIdx) {
              lastOptimizedIdx = currOptimizedIdx;
              addToMapOfArrays(result, currOptimizedIdx, patternIdxToConfig[idx]);
            }
          });
        } else if (currTokType.PATTERN instanceof RegExp) {
          if (currTokType.PATTERN.unicode) {
            canBeOptimized = false;
            if (options.ensureOptimizations) {
              PRINT_ERROR(`${failedOptimizationPrefixMsg}	Unable to analyze < ${currTokType.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
            }
          } else {
            const optimizedCodes = getOptimizedStartCodesIndices(currTokType.PATTERN, options.ensureOptimizations);
            if (optimizedCodes.length === 0) {
              canBeOptimized = false;
            }
            optimizedCodes.forEach((code) => {
              addToMapOfArrays(result, code, patternIdxToConfig[idx]);
            });
          }
        } else {
          if (options.ensureOptimizations) {
            PRINT_ERROR(`${failedOptimizationPrefixMsg}	TokenType: <${currTokType.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`);
          }
          canBeOptimized = false;
        }
        return result;
      }, []);
    });
  }
  return {
    emptyGroups,
    patternIdxToConfig,
    charCodeToPatternIdxToConfig,
    hasCustom,
    canBeOptimized
  };
}
__name(analyzeTokenTypes, "analyzeTokenTypes");
function getAsciiClass(pattern) {
  var _a, _b;
  if (!(pattern instanceof RegExp) || pattern.flags !== "") {
    return void 0;
  }
  let ast;
  try {
    ast = getRegExpAst(pattern);
  } catch (_c) {
    return void 0;
  }
  if (ast.value.value.length !== 1 || ast.value.value[0].value.length !== 1) {
    return void 0;
  }
  let atom = ast.value.value[0].value[0];
  let quantifier;
  while (atom.type === "Group") {
    if (atom.capturing || atom.quantifier !== void 0 && quantifier !== void 0 || atom.value.value.length !== 1 || atom.value.value[0].value.length !== 1) {
      return void 0;
    }
    quantifier = (_a = atom.quantifier) !== null && _a !== void 0 ? _a : quantifier;
    atom = atom.value.value[0].value[0];
  }
  if (atom.type !== "Set" || atom.complement || atom.quantifier !== void 0 && quantifier !== void 0) {
    return void 0;
  }
  quantifier = (_b = atom.quantifier) !== null && _b !== void 0 ? _b : quantifier;
  if ((quantifier === null || quantifier === void 0 ? void 0 : quantifier.atLeast) !== 1 || quantifier.atMost !== Infinity || !quantifier.greedy) {
    return void 0;
  }
  const result = new Uint8Array(128);
  for (const item of atom.value) {
    const from = typeof item === "number" ? item : item.from;
    const to = typeof item === "number" ? item : item.to;
    if (from < 0 || to >= result.length) {
      return void 0;
    }
    result.fill(1, from, to + 1);
  }
  return result;
}
__name(getAsciiClass, "getAsciiClass");
function validatePatterns(tokenTypes, validModesNames) {
  let errors = [];
  const missingResult = findMissingPatterns(tokenTypes);
  errors = errors.concat(missingResult.errors);
  const invalidResult = findInvalidPatterns(missingResult.valid);
  const validTokenTypes = invalidResult.valid;
  errors = errors.concat(invalidResult.errors);
  errors = errors.concat(validateRegExpPattern(validTokenTypes));
  errors = errors.concat(findInvalidGroupType(validTokenTypes));
  errors = errors.concat(findModesThatDoNotExist(validTokenTypes, validModesNames));
  errors = errors.concat(findUnreachablePatterns(validTokenTypes));
  return errors;
}
__name(validatePatterns, "validatePatterns");
function validateRegExpPattern(tokenTypes) {
  let errors = [];
  const withRegExpPatterns = tokenTypes.filter((currTokType) => currTokType[PATTERN] instanceof RegExp);
  errors = errors.concat(findEndOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findStartOfInputAnchor(withRegExpPatterns));
  errors = errors.concat(findUnsupportedFlags(withRegExpPatterns));
  errors = errors.concat(findDuplicatePatterns(withRegExpPatterns));
  errors = errors.concat(findEmptyMatchRegExps(withRegExpPatterns));
  return errors;
}
__name(validateRegExpPattern, "validateRegExpPattern");
function findMissingPatterns(tokenTypes) {
  const tokenTypesWithMissingPattern = tokenTypes.filter((currType) => {
    return !Object.hasOwn(currType, PATTERN);
  });
  const errors = tokenTypesWithMissingPattern.map((currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- missing static 'PATTERN' property",
      type: LexerDefinitionErrorType.MISSING_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = tokenTypes.filter((x) => !tokenTypesWithMissingPattern.includes(x));
  return { errors, valid };
}
__name(findMissingPatterns, "findMissingPatterns");
function findInvalidPatterns(tokenTypes) {
  const tokenTypesWithInvalidPattern = tokenTypes.filter((currType) => {
    const pattern = currType[PATTERN];
    return !(pattern instanceof RegExp) && !(typeof pattern === "function") && !Object.hasOwn(pattern, "exec") && !(typeof pattern === "string");
  });
  const errors = tokenTypesWithInvalidPattern.map((currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
      type: LexerDefinitionErrorType.INVALID_PATTERN,
      tokenTypes: [currType]
    };
  });
  const valid = tokenTypes.filter((x) => !tokenTypesWithInvalidPattern.includes(x));
  return { errors, valid };
}
__name(findInvalidPatterns, "findInvalidPatterns");
var end_of_input = /[^\\][$]/;
function findEndOfInputAnchor(tokenTypes) {
  class EndAnchorFinder extends BaseRegExpVisitor {
    static {
      __name(this, "EndAnchorFinder");
    }
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitEndAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = tokenTypes.filter((currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const endAnchorVisitor = new EndAnchorFinder();
      endAnchorVisitor.visit(regexpAst);
      return endAnchorVisitor.found;
    } catch (e) {
      return end_of_input.test(pattern.source);
    }
  });
  const errors = invalidRegex.map((currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
__name(findEndOfInputAnchor, "findEndOfInputAnchor");
function findEmptyMatchRegExps(tokenTypes) {
  const matchesEmptyString = tokenTypes.filter((currType) => {
    const pattern = currType.PATTERN;
    return pattern.test("");
  });
  const errors = matchesEmptyString.map((currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' must not match an empty string",
      type: LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,
      tokenTypes: [currType]
    };
  });
  return errors;
}
__name(findEmptyMatchRegExps, "findEmptyMatchRegExps");
var start_of_input = /[^\\[][\^]|^\^/;
function findStartOfInputAnchor(tokenTypes) {
  class StartAnchorFinder extends BaseRegExpVisitor {
    static {
      __name(this, "StartAnchorFinder");
    }
    constructor() {
      super(...arguments);
      this.found = false;
    }
    visitStartAnchor(node) {
      this.found = true;
    }
  }
  const invalidRegex = tokenTypes.filter((currType) => {
    const pattern = currType.PATTERN;
    try {
      const regexpAst = getRegExpAst(pattern);
      const startAnchorVisitor = new StartAnchorFinder();
      startAnchorVisitor.visit(regexpAst);
      return startAnchorVisitor.found;
    } catch (e) {
      return start_of_input.test(pattern.source);
    }
  });
  const errors = invalidRegex.map((currType) => {
    return {
      message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
      type: LexerDefinitionErrorType.SOI_ANCHOR_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
__name(findStartOfInputAnchor, "findStartOfInputAnchor");
function findUnsupportedFlags(tokenTypes) {
  const invalidFlags = tokenTypes.filter((currType) => {
    const pattern = currType[PATTERN];
    return pattern instanceof RegExp && (pattern.multiline || pattern.global);
  });
  const errors = invalidFlags.map((currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
      type: LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
__name(findUnsupportedFlags, "findUnsupportedFlags");
function findDuplicatePatterns(tokenTypes) {
  const found = [];
  let identicalPatterns = tokenTypes.map((outerType) => {
    return tokenTypes.reduce((result, innerType) => {
      if (outerType.PATTERN.source === innerType.PATTERN.source && !found.includes(innerType) && innerType.PATTERN !== Lexer.NA) {
        found.push(innerType);
        result.push(innerType);
        return result;
      }
      return result;
    }, []);
  });
  identicalPatterns = identicalPatterns.filter(Boolean);
  const duplicatePatterns = identicalPatterns.filter((currIdenticalSet) => {
    return currIdenticalSet.length > 1;
  });
  const errors = duplicatePatterns.map((setOfIdentical) => {
    const tokenTypeNames = setOfIdentical.map((currType) => {
      return currType.name;
    });
    const dupPatternSrc = setOfIdentical[0].PATTERN;
    return {
      message: `The same RegExp pattern ->${dupPatternSrc}<-has been used in all of the following Token Types: ${tokenTypeNames.join(", ")} <-`,
      type: LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
      tokenTypes: setOfIdentical
    };
  });
  return errors;
}
__name(findDuplicatePatterns, "findDuplicatePatterns");
function findInvalidGroupType(tokenTypes) {
  const invalidTypes = tokenTypes.filter((clazz) => {
    if (!Object.hasOwn(clazz, "GROUP")) {
      return false;
    }
    const group = clazz.GROUP;
    return group !== Lexer.SKIPPED && group !== Lexer.NA && !(typeof group === "string");
  });
  const errors = invalidTypes.map((currType) => {
    return {
      message: "Token Type: ->" + currType.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
      type: LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
      tokenTypes: [currType]
    };
  });
  return errors;
}
__name(findInvalidGroupType, "findInvalidGroupType");
function findModesThatDoNotExist(tokenTypes, validModes) {
  const invalidModes = tokenTypes.filter((clazz) => {
    return clazz.PUSH_MODE !== void 0 && !validModes.includes(clazz.PUSH_MODE);
  });
  const errors = invalidModes.map((tokType) => {
    const msg = `Token Type: ->${tokType.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${tokType.PUSH_MODE}<-which does not exist`;
    return {
      message: msg,
      type: LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,
      tokenTypes: [tokType]
    };
  });
  return errors;
}
__name(findModesThatDoNotExist, "findModesThatDoNotExist");
function findUnreachablePatterns(tokenTypes) {
  const errors = [];
  const canBeTested = tokenTypes.reduce((result, tokType, idx) => {
    const pattern = tokType.PATTERN;
    if (pattern === Lexer.NA) {
      return result;
    }
    if (typeof pattern === "string") {
      result.push({ str: pattern, idx, tokenType: tokType });
    } else if (pattern instanceof RegExp && noMetaChar(pattern)) {
      result.push({ str: pattern.source, idx, tokenType: tokType });
    }
    return result;
  }, []);
  tokenTypes.forEach((aTokType, aIdx) => {
    canBeTested.forEach(({ str: bStr, idx: bIdx, tokenType: bTokType }) => {
      if (aIdx < bIdx && tryToMatchStrToPattern(bStr, aTokType.PATTERN)) {
        const msg = `Token: ->${bTokType.name}<- can never be matched.
Because it appears AFTER the Token Type ->${aTokType.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
        errors.push({
          message: msg,
          type: LexerDefinitionErrorType.UNREACHABLE_PATTERN,
          tokenTypes: [aTokType, bTokType]
        });
      }
    });
  });
  return errors;
}
__name(findUnreachablePatterns, "findUnreachablePatterns");
function tryToMatchStrToPattern(str, pattern) {
  if (pattern instanceof RegExp) {
    if (usesLookAheadOrBehind(pattern)) {
      return false;
    }
    const regExpArray = pattern.exec(str);
    return regExpArray !== null && regExpArray.index === 0;
  } else if (typeof pattern === "function") {
    return pattern(str, 0, [], {});
  } else if (Object.hasOwn(pattern, "exec")) {
    return pattern.exec(str, 0, [], {});
  } else if (typeof pattern === "string") {
    return pattern === str;
  } else {
    throw Error("non exhaustive match");
  }
}
__name(tryToMatchStrToPattern, "tryToMatchStrToPattern");
function noMetaChar(regExp) {
  const metaChars = [
    ".",
    "\\",
    "[",
    "]",
    "|",
    "^",
    "$",
    "(",
    ")",
    "?",
    "*",
    "+",
    "{"
  ];
  return metaChars.find((char) => regExp.source.indexOf(char) !== -1) === void 0;
}
__name(noMetaChar, "noMetaChar");
function usesLookAheadOrBehind(regExp) {
  return /(\(\?=)|(\(\?!)|(\(\?<=)|(\(\?<!)/.test(regExp.source);
}
__name(usesLookAheadOrBehind, "usesLookAheadOrBehind");
function addStickyFlag(pattern) {
  const flags = pattern.ignoreCase ? "iy" : "y";
  return new RegExp(`${pattern.source}`, flags);
}
__name(addStickyFlag, "addStickyFlag");
function performRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const errors = [];
  if (!Object.hasOwn(lexerDefinition, DEFAULT_MODE)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + DEFAULT_MODE + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
    });
  }
  if (!Object.hasOwn(lexerDefinition, MODES)) {
    errors.push({
      message: "A MultiMode Lexer cannot be initialized without a <" + MODES + "> property in its definition\n",
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
    });
  }
  if (Object.hasOwn(lexerDefinition, MODES) && Object.hasOwn(lexerDefinition, DEFAULT_MODE) && !Object.hasOwn(lexerDefinition.modes, lexerDefinition.defaultMode)) {
    errors.push({
      message: `A MultiMode Lexer cannot be initialized with a ${DEFAULT_MODE}: <${lexerDefinition.defaultMode}>which does not exist
`,
      type: LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
    });
  }
  if (Object.hasOwn(lexerDefinition, MODES)) {
    Object.keys(lexerDefinition.modes).forEach((currModeName) => {
      const currModeValue = lexerDefinition.modes[currModeName];
      currModeValue.forEach((currTokType, currIdx) => {
        if (currTokType === void 0) {
          errors.push({
            message: `A Lexer cannot be initialized using an undefined Token Type. Mode:<${currModeName}> at index: <${currIdx}>
`,
            type: LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
          });
        } else if (Object.hasOwn(currTokType, "LONGER_ALT")) {
          const longerAlt = Array.isArray(currTokType.LONGER_ALT) ? currTokType.LONGER_ALT : [currTokType.LONGER_ALT];
          longerAlt.forEach((currLongerAlt) => {
            if (currLongerAlt !== void 0 && !currModeValue.includes(currLongerAlt)) {
              errors.push({
                message: `A MultiMode Lexer cannot be initialized with a longer_alt <${currLongerAlt.name}> on token <${currTokType.name}> outside of mode <${currModeName}>
`,
                type: LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE
              });
            }
          });
        }
      });
    });
  }
  return errors;
}
__name(performRuntimeChecks, "performRuntimeChecks");
function performWarningRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
  const warnings = [];
  let hasAnyLineBreak = false;
  const allTokenTypes = Object.values(lexerDefinition.modes || {}).flat().filter(Boolean);
  const concreteTokenTypes = allTokenTypes.filter((currType) => currType[PATTERN] !== Lexer.NA);
  const terminatorCharCodes = getCharCodes(lineTerminatorCharacters);
  if (trackLines) {
    concreteTokenTypes.forEach((tokType) => {
      const currIssue = checkLineBreaksIssues(tokType, terminatorCharCodes);
      if (currIssue !== false) {
        const message = buildLineBreakIssueMessage(tokType, currIssue);
        const warningDescriptor = {
          message,
          type: currIssue.issue,
          tokenType: tokType
        };
        warnings.push(warningDescriptor);
      } else {
        if (Object.hasOwn(tokType, "LINE_BREAKS")) {
          if (tokType.LINE_BREAKS === true) {
            hasAnyLineBreak = true;
          }
        } else {
          if (canMatchCharCode(terminatorCharCodes, tokType.PATTERN)) {
            hasAnyLineBreak = true;
          }
        }
      }
    });
  }
  if (trackLines && !hasAnyLineBreak) {
    warnings.push({
      message: "Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",
      type: LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS
    });
  }
  return warnings;
}
__name(performWarningRuntimeChecks, "performWarningRuntimeChecks");
function isCustomPattern(tokenType) {
  const pattern = tokenType.PATTERN;
  if (pattern instanceof RegExp) {
    return false;
  } else if (typeof pattern === "function") {
    return true;
  } else if (Object.hasOwn(pattern, "exec")) {
    return true;
  } else if (typeof pattern === "string") {
    return false;
  } else {
    throw Error("non exhaustive match");
  }
}
__name(isCustomPattern, "isCustomPattern");
function isShortPattern(pattern) {
  if (typeof pattern === "string" && pattern.length === 1) {
    return pattern.charCodeAt(0);
  } else {
    return false;
  }
}
__name(isShortPattern, "isShortPattern");
var LineTerminatorOptimizedTester = {
  // implements /\n|\r\n?/g.test
  test: /* @__PURE__ */ __name(function(text) {
    const len = text.length;
    for (let i = this.lastIndex; i < len; i++) {
      const c = text.charCodeAt(i);
      if (c === 10) {
        this.lastIndex = i + 1;
        return true;
      } else if (c === 13) {
        if (text.charCodeAt(i + 1) === 10) {
          this.lastIndex = i + 2;
        } else {
          this.lastIndex = i + 1;
        }
        return true;
      }
    }
    return false;
  }, "test"),
  lastIndex: 0
};
function checkLineBreaksIssues(tokType, lineTerminatorCharCodes) {
  if (Object.hasOwn(tokType, "LINE_BREAKS")) {
    return false;
  } else {
    if (tokType.PATTERN instanceof RegExp) {
      try {
        canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
      } catch (e) {
        return {
          issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR,
          errMsg: e.message
        };
      }
      return false;
    } else if (typeof tokType.PATTERN === "string") {
      return false;
    } else if (isCustomPattern(tokType)) {
      return { issue: LexerDefinitionErrorType.CUSTOM_LINE_BREAK };
    } else {
      throw Error("non exhaustive match");
    }
  }
}
__name(checkLineBreaksIssues, "checkLineBreaksIssues");
function buildLineBreakIssueMessage(tokType, details) {
  if (details.issue === LexerDefinitionErrorType.IDENTIFY_TERMINATOR) {
    return `Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${tokType.name}> Token Type
	 Root cause: ${details.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;
  } else if (details.issue === LexerDefinitionErrorType.CUSTOM_LINE_BREAK) {
    return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${tokType.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;
  } else {
    throw Error("non exhaustive match");
  }
}
__name(buildLineBreakIssueMessage, "buildLineBreakIssueMessage");
function getCharCodes(charsOrCodes) {
  const charCodes = charsOrCodes.map((numOrString) => {
    if (typeof numOrString === "string") {
      return numOrString.charCodeAt(0);
    } else {
      return numOrString;
    }
  });
  return charCodes;
}
__name(getCharCodes, "getCharCodes");
function addToMapOfArrays(map, key, value) {
  if (map[key] === void 0) {
    map[key] = [value];
  } else {
    map[key].push(value);
  }
}
__name(addToMapOfArrays, "addToMapOfArrays");
var minOptimizationVal = 256;
var charCodeToOptimizedIdxMap = [];
function charCodeToOptimizedIndex(charCode) {
  return charCode < minOptimizationVal ? charCode : charCodeToOptimizedIdxMap[charCode];
}
__name(charCodeToOptimizedIndex, "charCodeToOptimizedIndex");
function initCharCodeToOptimizedIndexMap() {
  if (charCodeToOptimizedIdxMap.length === 0) {
    charCodeToOptimizedIdxMap = new Array(65536);
    for (let i = 0; i < 65536; i++) {
      charCodeToOptimizedIdxMap[i] = i > 255 ? 255 + ~~(i / 255) : i;
    }
  }
}
__name(initCharCodeToOptimizedIndexMap, "initCharCodeToOptimizedIndexMap");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/tokens.js
function tokenStructuredMatcher(tokInstance, tokConstructor) {
  const instanceType = tokInstance.tokenTypeIdx;
  if (instanceType === tokConstructor.tokenTypeIdx) {
    return true;
  } else {
    return tokConstructor.isParent === true && tokConstructor.categoryMatchesMap[instanceType] === true;
  }
}
__name(tokenStructuredMatcher, "tokenStructuredMatcher");
function tokenStructuredMatcherNoCategories(token, tokType) {
  return token.tokenTypeIdx === tokType.tokenTypeIdx;
}
__name(tokenStructuredMatcherNoCategories, "tokenStructuredMatcherNoCategories");
var tokenShortNameIdx = 1;
var tokenIdxToClass = {};
function augmentTokenTypes(tokenTypes) {
  const tokenTypesAndParents = expandCategories(tokenTypes);
  assignTokenDefaultProps(tokenTypesAndParents);
  assignCategoriesMapProp(tokenTypesAndParents);
  assignCategoriesTokensProp(tokenTypesAndParents);
  tokenTypesAndParents.forEach((tokType) => {
    tokType.isParent = tokType.categoryMatches.length > 0;
  });
}
__name(augmentTokenTypes, "augmentTokenTypes");
function expandCategories(tokenTypes) {
  let result = [...tokenTypes];
  let categories = tokenTypes;
  let searching = true;
  while (searching) {
    categories = categories.map((currTokType) => currTokType.CATEGORIES).flat().filter(Boolean);
    const newCategories = categories.filter((x) => !result.includes(x));
    result = result.concat(newCategories);
    if (newCategories.length === 0) {
      searching = false;
    } else {
      categories = newCategories;
    }
  }
  return result;
}
__name(expandCategories, "expandCategories");
function assignTokenDefaultProps(tokenTypes) {
  tokenTypes.forEach((currTokType) => {
    if (!hasShortKeyProperty(currTokType)) {
      tokenIdxToClass[tokenShortNameIdx] = currTokType;
      currTokType.tokenTypeIdx = tokenShortNameIdx++;
    }
    if (hasCategoriesProperty(currTokType) && !Array.isArray(currTokType.CATEGORIES)) {
      currTokType.CATEGORIES = [currTokType.CATEGORIES];
    }
    if (!hasCategoriesProperty(currTokType)) {
      currTokType.CATEGORIES = [];
    }
    if (!hasExtendingTokensTypesProperty(currTokType)) {
      currTokType.categoryMatches = [];
    }
    if (!hasExtendingTokensTypesMapProperty(currTokType)) {
      currTokType.categoryMatchesMap = {};
    }
  });
}
__name(assignTokenDefaultProps, "assignTokenDefaultProps");
function assignCategoriesTokensProp(tokenTypes) {
  tokenTypes.forEach((currTokType) => {
    currTokType.categoryMatches = [];
    Object.keys(currTokType.categoryMatchesMap).forEach((key) => {
      currTokType.categoryMatches.push(tokenIdxToClass[key].tokenTypeIdx);
    });
  });
}
__name(assignCategoriesTokensProp, "assignCategoriesTokensProp");
function assignCategoriesMapProp(tokenTypes) {
  tokenTypes.forEach((currTokType) => {
    singleAssignCategoriesToksMap([], currTokType);
  });
}
__name(assignCategoriesMapProp, "assignCategoriesMapProp");
function singleAssignCategoriesToksMap(path, nextNode) {
  path.forEach((pathNode) => {
    nextNode.categoryMatchesMap[pathNode.tokenTypeIdx] = true;
  });
  nextNode.CATEGORIES.forEach((nextCategory) => {
    const newPath = path.concat(nextNode);
    if (!newPath.includes(nextCategory)) {
      singleAssignCategoriesToksMap(newPath, nextCategory);
    }
  });
}
__name(singleAssignCategoriesToksMap, "singleAssignCategoriesToksMap");
function hasShortKeyProperty(tokType) {
  return Object.hasOwn(tokType !== null && tokType !== void 0 ? tokType : {}, "tokenTypeIdx");
}
__name(hasShortKeyProperty, "hasShortKeyProperty");
function hasCategoriesProperty(tokType) {
  return Object.hasOwn(tokType !== null && tokType !== void 0 ? tokType : {}, "CATEGORIES");
}
__name(hasCategoriesProperty, "hasCategoriesProperty");
function hasExtendingTokensTypesProperty(tokType) {
  return Object.hasOwn(tokType !== null && tokType !== void 0 ? tokType : {}, "categoryMatches");
}
__name(hasExtendingTokensTypesProperty, "hasExtendingTokensTypesProperty");
function hasExtendingTokensTypesMapProperty(tokType) {
  return Object.hasOwn(tokType !== null && tokType !== void 0 ? tokType : {}, "categoryMatchesMap");
}
__name(hasExtendingTokensTypesMapProperty, "hasExtendingTokensTypesMapProperty");
function isTokenType(tokType) {
  return Object.hasOwn(tokType !== null && tokType !== void 0 ? tokType : {}, "tokenTypeIdx");
}
__name(isTokenType, "isTokenType");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/lexer_errors_public.js
var defaultLexerErrorProvider = {
  buildUnableToPopLexerModeMessage(token) {
    return `Unable to pop Lexer Mode after encountering Token ->${token.image}<- The Mode Stack is empty`;
  },
  buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column, mode) {
    return `unexpected character: ->${fullText.charAt(startOffset)}<- at offset: ${startOffset}, skipped ${length} characters.`;
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/lexer_public.js
var LexerDefinitionErrorType;
(function(LexerDefinitionErrorType2) {
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MISSING_PATTERN"] = 0] = "MISSING_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_PATTERN"] = 1] = "INVALID_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["EOI_ANCHOR_FOUND"] = 2] = "EOI_ANCHOR_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNSUPPORTED_FLAGS_FOUND"] = 3] = "UNSUPPORTED_FLAGS_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["DUPLICATE_PATTERNS_FOUND"] = 4] = "DUPLICATE_PATTERNS_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_GROUP_TYPE_FOUND"] = 5] = "INVALID_GROUP_TYPE_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["PUSH_MODE_DOES_NOT_EXIST"] = 6] = "PUSH_MODE_DOES_NOT_EXIST";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"] = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"] = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"] = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"] = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["SOI_ANCHOR_FOUND"] = 11] = "SOI_ANCHOR_FOUND";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["EMPTY_MATCH_PATTERN"] = 12] = "EMPTY_MATCH_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["NO_LINE_BREAKS_FLAGS"] = 13] = "NO_LINE_BREAKS_FLAGS";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNREACHABLE_PATTERN"] = 14] = "UNREACHABLE_PATTERN";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["IDENTIFY_TERMINATOR"] = 15] = "IDENTIFY_TERMINATOR";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["CUSTOM_LINE_BREAK"] = 16] = "CUSTOM_LINE_BREAK";
  LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"] = 17] = "MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE";
})(LexerDefinitionErrorType || (LexerDefinitionErrorType = {}));
var DEFAULT_LEXER_CONFIG = {
  deferDefinitionErrorsHandling: false,
  positionTracking: "full",
  lineTerminatorsPattern: /\n|\r\n?/g,
  lineTerminatorCharacters: ["\n", "\r"],
  ensureOptimizations: false,
  safeMode: false,
  errorMessageProvider: defaultLexerErrorProvider,
  traceInitPerf: false,
  skipValidations: false,
  recoveryEnabled: true
};
Object.freeze(DEFAULT_LEXER_CONFIG);
var Lexer = class {
  static {
    __name(this, "Lexer");
  }
  constructor(lexerDefinition, config = DEFAULT_LEXER_CONFIG) {
    this.lexerDefinition = lexerDefinition;
    this.lexerDefinitionErrors = [];
    this.lexerDefinitionWarning = [];
    this.patternIdxToConfig = {};
    this.charCodeToPatternIdxToConfig = {};
    this.modes = [];
    this.emptyGroups = {};
    this.cachedGroupKeys = [];
    this.trackStartLines = true;
    this.trackEndLines = true;
    this.hasCustom = false;
    this.canModeBeOptimized = {};
    this.TRACE_INIT = (phaseDesc, phaseImpl) => {
      if (this.traceInitPerf === true) {
        this.traceInitIndent++;
        const indent = new Array(this.traceInitIndent + 1).join("	");
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          console.log(`${indent}--> <${phaseDesc}>`);
        }
        const { time, value } = timer(phaseImpl);
        const traceMethod = time > 10 ? console.warn : console.log;
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
        }
        this.traceInitIndent--;
        return value;
      } else {
        return phaseImpl();
      }
    };
    if (typeof config === "boolean") {
      throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported");
    }
    this.config = Object.assign({}, DEFAULT_LEXER_CONFIG, config);
    const traceInitVal = this.config.traceInitPerf;
    if (traceInitVal === true) {
      this.traceInitMaxIdent = Infinity;
      this.traceInitPerf = true;
    } else if (typeof traceInitVal === "number") {
      this.traceInitMaxIdent = traceInitVal;
      this.traceInitPerf = true;
    }
    this.traceInitIndent = -1;
    this.TRACE_INIT("Lexer Constructor", () => {
      let actualDefinition;
      let hasOnlySingleMode = true;
      this.TRACE_INIT("Lexer Config handling", () => {
        if (this.config.lineTerminatorsPattern === DEFAULT_LEXER_CONFIG.lineTerminatorsPattern) {
          this.config.lineTerminatorsPattern = LineTerminatorOptimizedTester;
        } else {
          if (this.config.lineTerminatorCharacters === DEFAULT_LEXER_CONFIG.lineTerminatorCharacters) {
            throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS");
          }
        }
        if (config.safeMode && config.ensureOptimizations) {
          throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');
        }
        this.trackStartLines = /full|onlyStart/i.test(this.config.positionTracking);
        this.trackEndLines = /full/i.test(this.config.positionTracking);
        if (Array.isArray(lexerDefinition)) {
          actualDefinition = {
            modes: { defaultMode: [...lexerDefinition] },
            defaultMode: DEFAULT_MODE
          };
        } else {
          hasOnlySingleMode = false;
          actualDefinition = Object.assign({}, lexerDefinition);
        }
      });
      if (this.config.skipValidations === false) {
        this.TRACE_INIT("performRuntimeChecks", () => {
          this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(performRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
        });
        this.TRACE_INIT("performWarningRuntimeChecks", () => {
          this.lexerDefinitionWarning = this.lexerDefinitionWarning.concat(performWarningRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
        });
      }
      actualDefinition.modes = actualDefinition.modes ? actualDefinition.modes : {};
      Object.entries(actualDefinition.modes).forEach(([currModeName, currModeValue]) => {
        actualDefinition.modes[currModeName] = currModeValue.filter((currTokType) => currTokType !== void 0);
      });
      const allModeNames = Object.keys(actualDefinition.modes);
      Object.entries(actualDefinition.modes).forEach(([currModName, currModDef]) => {
        this.TRACE_INIT(`Mode: <${currModName}> processing`, () => {
          this.modes.push(currModName);
          if (this.config.skipValidations === false) {
            this.TRACE_INIT(`validatePatterns`, () => {
              this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(validatePatterns(currModDef, allModeNames));
            });
          }
          if (this.lexerDefinitionErrors.length === 0) {
            augmentTokenTypes(currModDef);
            let currAnalyzeResult;
            this.TRACE_INIT(`analyzeTokenTypes`, () => {
              currAnalyzeResult = analyzeTokenTypes(currModDef, {
                lineTerminatorCharacters: this.config.lineTerminatorCharacters,
                positionTracking: config.positionTracking,
                ensureOptimizations: config.ensureOptimizations,
                safeMode: config.safeMode,
                tracer: this.TRACE_INIT
              });
            });
            this.patternIdxToConfig[currModName] = currAnalyzeResult.patternIdxToConfig;
            this.charCodeToPatternIdxToConfig[currModName] = currAnalyzeResult.charCodeToPatternIdxToConfig;
            this.emptyGroups = Object.assign({}, this.emptyGroups, currAnalyzeResult.emptyGroups);
            this.hasCustom = currAnalyzeResult.hasCustom || this.hasCustom;
            this.canModeBeOptimized[currModName] = currAnalyzeResult.canBeOptimized;
          }
        });
      });
      this.defaultMode = actualDefinition.defaultMode;
      this.cachedGroupKeys = Object.keys(this.emptyGroups);
      if (this.lexerDefinitionErrors.length > 0 && !this.config.deferDefinitionErrorsHandling) {
        const allErrMessages = this.lexerDefinitionErrors.map((error) => {
          return error.message;
        });
        const allErrMessagesString = allErrMessages.join("-----------------------\n");
        throw new Error("Errors detected in definition of Lexer:\n" + allErrMessagesString);
      }
      this.lexerDefinitionWarning.forEach((warningDescriptor) => {
        PRINT_WARNING(warningDescriptor.message);
      });
      this.TRACE_INIT("Choosing sub-methods implementations", () => {
        if (hasOnlySingleMode) {
          this.handleModes = () => {
          };
        }
        if (this.trackStartLines === false) {
          this.computeNewColumn = (x) => x;
        }
        if (this.trackEndLines === false) {
          this.updateTokenEndLineColumnLocation = () => {
          };
        }
        if (/full/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createFullToken;
        } else if (/onlyStart/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createStartOnlyToken;
        } else if (/onlyOffset/i.test(this.config.positionTracking)) {
          this.createTokenInstance = this.createOffsetOnlyToken;
        } else {
          throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);
        }
        if (this.hasCustom) {
          this.addToken = this.addTokenUsingPush;
          this.handlePayload = this.handlePayloadWithCustom;
        } else {
          this.addToken = this.addTokenUsingMemberAccess;
          this.handlePayload = this.handlePayloadNoCustom;
        }
      });
      this.TRACE_INIT("Failed Optimization Warnings", () => {
        const unOptimizedModes = Object.entries(this.canModeBeOptimized).reduce((cannotBeOptimized, [modeName, canBeOptimized]) => {
          if (canBeOptimized === false) {
            cannotBeOptimized.push(modeName);
          }
          return cannotBeOptimized;
        }, []);
        if (config.ensureOptimizations && unOptimizedModes.length > 0) {
          throw Error(`Lexer Modes: < ${unOptimizedModes.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
        }
      });
      this.TRACE_INIT("clearRegExpParserCache", () => {
        clearRegExpParserCache();
      });
      this.TRACE_INIT("toFastProperties", () => {
        toFastProperties(this);
      });
    });
  }
  tokenize(text, initialMode = this.defaultMode) {
    if (this.lexerDefinitionErrors.length > 0) {
      const allErrMessages = this.lexerDefinitionErrors.map((error) => {
        return error.message;
      });
      const allErrMessagesString = allErrMessages.join("-----------------------\n");
      throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + allErrMessagesString);
    }
    return this.tokenizeInternal(text, initialMode);
  }
  // There is quite a bit of duplication between this and "tokenizeInternalLazy"
  // This is intentional due to performance considerations.
  // this method also used quite a bit of `!` none null assertions because it is too optimized
  // for `tsc` to always understand it is "safe"
  tokenizeInternal(text, initialMode) {
    let i, j, k, matchAltImage, longerAlt, matchedImage, payload, altPayload, imageLength, group, tokType, newToken, errLength, msg, match;
    const orgText = text;
    const orgLength = orgText.length;
    let offset = 0;
    let matchedTokensIndex = 0;
    const guessedNumberOfTokens = this.hasCustom ? 0 : Math.floor(text.length / 10);
    const matchedTokens = new Array(guessedNumberOfTokens);
    const errors = [];
    let line = this.trackStartLines ? 1 : void 0;
    let column = this.trackStartLines ? 1 : void 0;
    const groups = {};
    for (let gi = 0; gi < this.cachedGroupKeys.length; gi++) {
      groups[this.cachedGroupKeys[gi]] = [];
    }
    const trackLines = this.trackStartLines;
    const lineTerminatorPattern = this.config.lineTerminatorsPattern;
    let currModePatternsLength = 0;
    let patternIdxToConfig = [];
    let currCharCodeToPatternIdxToConfig = [];
    const modeStack = [];
    const emptyArray = [];
    Object.freeze(emptyArray);
    let isOptimizedMode = false;
    const pop_mode = /* @__PURE__ */ __name((popToken) => {
      if (modeStack.length === 1 && // if we have both a POP_MODE and a PUSH_MODE this is in-fact a "transition"
      // So no error should occur.
      popToken.tokenType.PUSH_MODE === void 0) {
        const msg2 = this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(popToken);
        errors.push({
          offset: popToken.startOffset,
          line: popToken.startLine,
          column: popToken.startColumn,
          length: popToken.image.length,
          message: msg2
        });
      } else {
        modeStack.pop();
        const newMode = modeStack.at(-1);
        patternIdxToConfig = this.patternIdxToConfig[newMode];
        currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
        currModePatternsLength = patternIdxToConfig.length;
        const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
        if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
          isOptimizedMode = true;
        } else {
          isOptimizedMode = false;
        }
      }
    }, "pop_mode");
    function push_mode(newMode) {
      modeStack.push(newMode);
      currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
      patternIdxToConfig = this.patternIdxToConfig[newMode];
      currModePatternsLength = patternIdxToConfig.length;
      const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
      if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
        isOptimizedMode = true;
      } else {
        isOptimizedMode = false;
      }
    }
    __name(push_mode, "push_mode");
    push_mode.call(this, initialMode);
    let currConfig;
    const recoveryEnabled = this.config.recoveryEnabled;
    while (offset < orgLength) {
      matchedImage = null;
      imageLength = -1;
      const nextCharCode = orgText.charCodeAt(offset);
      let chosenPatternIdxToConfig;
      if (isOptimizedMode) {
        const optimizedCharIdx = charCodeToOptimizedIndex(nextCharCode);
        const possiblePatterns = currCharCodeToPatternIdxToConfig[optimizedCharIdx];
        chosenPatternIdxToConfig = possiblePatterns !== void 0 ? possiblePatterns : emptyArray;
      } else {
        chosenPatternIdxToConfig = patternIdxToConfig;
      }
      const chosenPatternsLength = chosenPatternIdxToConfig.length;
      for (i = 0; i < chosenPatternsLength; i++) {
        currConfig = chosenPatternIdxToConfig[i];
        const currPattern = currConfig.pattern;
        payload = null;
        switch (currConfig.matchType) {
          case SINGLE_CHAR_MATCH:
            if (nextCharCode === currConfig.short) {
              imageLength = 1;
              matchedImage = currPattern;
            }
            break;
          case CUSTOM_MATCH:
            match = currPattern.exec(orgText, offset, matchedTokens, groups);
            if (match !== null) {
              matchedImage = match[0];
              imageLength = matchedImage.length;
              if (match.payload !== void 0) {
                payload = match.payload;
              }
            } else {
              matchedImage = null;
            }
            break;
          case ASCII_CLASS_MATCH: {
            const asciiClass = currConfig.asciiClass;
            if (asciiClass[nextCharCode] !== 1) {
              currPattern.lastIndex = 0;
              break;
            }
            let endOffset = offset + 1;
            while (asciiClass[orgText.charCodeAt(endOffset)] === 1) {
              endOffset++;
            }
            imageLength = endOffset - offset;
            currPattern.lastIndex = endOffset;
            break;
          }
          case REG_EXP_MATCH:
            currPattern.lastIndex = offset;
            imageLength = this.matchLength(currPattern, text, offset);
            break;
        }
        if (imageLength !== -1) {
          longerAlt = currConfig.longerAlt;
          if (longerAlt !== void 0) {
            matchedImage = text.substring(offset, offset + imageLength);
            const longerAltLength = longerAlt.length;
            for (k = 0; k < longerAltLength; k++) {
              const longerAltConfig = patternIdxToConfig[longerAlt[k]];
              const longerAltPattern = longerAltConfig.pattern;
              altPayload = null;
              if (longerAltConfig.matchType === CUSTOM_MATCH) {
                match = longerAltPattern.exec(orgText, offset, matchedTokens, groups);
                if (match !== null) {
                  matchAltImage = match[0];
                  if (match.payload !== void 0) {
                    altPayload = match.payload;
                  }
                } else {
                  matchAltImage = null;
                }
              } else {
                longerAltPattern.lastIndex = offset;
                matchAltImage = this.match(longerAltPattern, text, offset);
              }
              if (matchAltImage && matchAltImage.length > matchedImage.length) {
                matchedImage = matchAltImage;
                imageLength = matchAltImage.length;
                payload = altPayload;
                currConfig = longerAltConfig;
                break;
              }
            }
          }
          break;
        }
      }
      if (imageLength !== -1) {
        group = currConfig.group;
        if (group !== void 0) {
          matchedImage = matchedImage !== null ? matchedImage : text.substring(offset, offset + imageLength);
          tokType = currConfig.tokenTypeIdx;
          newToken = this.createTokenInstance(matchedImage, offset, tokType, currConfig.tokenType, line, column, imageLength);
          this.handlePayload(newToken, payload);
          if (group === false) {
            matchedTokensIndex = this.addToken(matchedTokens, matchedTokensIndex, newToken);
          } else {
            groups[group].push(newToken);
          }
        }
        if (trackLines === true && currConfig.canLineTerminator === true) {
          let numOfLTsInMatch = 0;
          let foundTerminator;
          let lastLTEndOffset;
          lineTerminatorPattern.lastIndex = 0;
          do {
            matchedImage = matchedImage !== null ? matchedImage : text.substring(offset, offset + imageLength);
            foundTerminator = lineTerminatorPattern.test(matchedImage);
            if (foundTerminator === true) {
              lastLTEndOffset = lineTerminatorPattern.lastIndex - 1;
              numOfLTsInMatch++;
            }
          } while (foundTerminator === true);
          if (numOfLTsInMatch !== 0) {
            line = line + numOfLTsInMatch;
            column = imageLength - lastLTEndOffset;
            this.updateTokenEndLineColumnLocation(newToken, group, lastLTEndOffset, numOfLTsInMatch, line, column, imageLength);
          } else {
            column = this.computeNewColumn(column, imageLength);
          }
        } else {
          column = this.computeNewColumn(column, imageLength);
        }
        offset = offset + imageLength;
        this.handleModes(currConfig, pop_mode, push_mode, newToken);
      } else {
        const errorStartOffset = offset;
        const errorLine = line;
        const errorColumn = column;
        let foundResyncPoint = recoveryEnabled === false;
        while (foundResyncPoint === false && offset < orgLength) {
          offset++;
          for (j = 0; j < currModePatternsLength; j++) {
            const currConfig2 = patternIdxToConfig[j];
            const currPattern = currConfig2.pattern;
            switch (currConfig2.matchType) {
              case SINGLE_CHAR_MATCH:
                if (orgText.charCodeAt(offset) === currConfig2.short) {
                  foundResyncPoint = true;
                }
                break;
              case CUSTOM_MATCH:
                foundResyncPoint = currPattern.exec(orgText, offset, matchedTokens, groups) !== null;
                break;
              case ASCII_CLASS_MATCH:
              case REG_EXP_MATCH:
                currPattern.lastIndex = offset;
                foundResyncPoint = currPattern.exec(text) !== null;
                break;
            }
            if (foundResyncPoint === true) {
              break;
            }
          }
        }
        errLength = offset - errorStartOffset;
        column = this.computeNewColumn(column, errLength);
        msg = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(orgText, errorStartOffset, errLength, errorLine, errorColumn, modeStack.at(-1));
        errors.push({
          offset: errorStartOffset,
          line: errorLine,
          column: errorColumn,
          length: errLength,
          message: msg
        });
        if (recoveryEnabled === false) {
          break;
        }
      }
    }
    if (!this.hasCustom) {
      matchedTokens.length = matchedTokensIndex;
    }
    return {
      tokens: matchedTokens,
      groups,
      errors
    };
  }
  handleModes(config, pop_mode, push_mode, newToken) {
    if (config.pop === true) {
      const pushMode = config.push;
      pop_mode(newToken);
      if (pushMode !== void 0) {
        push_mode.call(this, pushMode);
      }
    } else if (config.push !== void 0) {
      push_mode.call(this, config.push);
    }
  }
  // TODO: decrease this under 600 characters? inspect stripping comments option in TSC compiler
  updateTokenEndLineColumnLocation(newToken, group, lastLTIdx, numOfLTsInMatch, line, column, imageLength) {
    let lastCharIsLT, fixForEndingInLT;
    if (group !== void 0) {
      lastCharIsLT = lastLTIdx === imageLength - 1;
      fixForEndingInLT = lastCharIsLT ? -1 : 0;
      if (!(numOfLTsInMatch === 1 && lastCharIsLT === true)) {
        newToken.endLine = line + fixForEndingInLT;
        newToken.endColumn = column - 1 + -fixForEndingInLT;
      }
    }
  }
  computeNewColumn(oldColumn, imageLength) {
    return oldColumn + imageLength;
  }
  createOffsetOnlyToken(image, startOffset, tokenTypeIdx, tokenType) {
    return {
      image,
      startOffset,
      tokenTypeIdx,
      tokenType
    };
  }
  createStartOnlyToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn) {
    return {
      image,
      startOffset,
      startLine,
      startColumn,
      tokenTypeIdx,
      tokenType
    };
  }
  createFullToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn, imageLength) {
    return {
      image,
      startOffset,
      endOffset: startOffset + imageLength - 1,
      startLine,
      endLine: startLine,
      startColumn,
      endColumn: startColumn + imageLength - 1,
      tokenTypeIdx,
      tokenType
    };
  }
  addTokenUsingPush(tokenVector, index, tokenToAdd) {
    tokenVector.push(tokenToAdd);
    return index;
  }
  addTokenUsingMemberAccess(tokenVector, index, tokenToAdd) {
    tokenVector[index] = tokenToAdd;
    index++;
    return index;
  }
  handlePayloadNoCustom(token, payload) {
  }
  handlePayloadWithCustom(token, payload) {
    if (payload !== null) {
      token.payload = payload;
    }
  }
  match(pattern, text, offset) {
    const found = pattern.test(text);
    if (found === true) {
      return text.substring(offset, pattern.lastIndex);
    }
    return null;
  }
  matchLength(pattern, text, offset) {
    const found = pattern.test(text);
    if (found === true) {
      return pattern.lastIndex - offset;
    }
    return -1;
  }
};
Lexer.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it will be consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";
Lexer.NA = /NOT_APPLICABLE/;

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/scan/tokens_public.js
function tokenLabel2(tokType) {
  if (hasTokenLabel2(tokType)) {
    return tokType.LABEL;
  } else {
    return tokType.name;
  }
}
__name(tokenLabel2, "tokenLabel");
function hasTokenLabel2(obj) {
  return typeof obj.LABEL === "string" && obj.LABEL !== "";
}
__name(hasTokenLabel2, "hasTokenLabel");
var PARENT = "parent";
var CATEGORIES = "categories";
var LABEL = "label";
var GROUP = "group";
var PUSH_MODE = "push_mode";
var POP_MODE = "pop_mode";
var LONGER_ALT = "longer_alt";
var LINE_BREAKS = "line_breaks";
var START_CHARS_HINT = "start_chars_hint";
function createToken(config) {
  return createTokenInternal(config);
}
__name(createToken, "createToken");
function createTokenInternal(config) {
  const pattern = config.pattern;
  const tokenType = {};
  tokenType.name = config.name;
  if (pattern !== void 0) {
    tokenType.PATTERN = pattern;
  }
  if (Object.hasOwn(config, PARENT)) {
    throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.";
  }
  if (Object.hasOwn(config, CATEGORIES)) {
    tokenType.CATEGORIES = config[CATEGORIES];
  }
  augmentTokenTypes([tokenType]);
  if (Object.hasOwn(config, LABEL)) {
    tokenType.LABEL = config[LABEL];
  }
  if (Object.hasOwn(config, GROUP)) {
    tokenType.GROUP = config[GROUP];
  }
  if (Object.hasOwn(config, POP_MODE)) {
    tokenType.POP_MODE = config[POP_MODE];
  }
  if (Object.hasOwn(config, PUSH_MODE)) {
    tokenType.PUSH_MODE = config[PUSH_MODE];
  }
  if (Object.hasOwn(config, LONGER_ALT)) {
    tokenType.LONGER_ALT = config[LONGER_ALT];
  }
  if (Object.hasOwn(config, LINE_BREAKS)) {
    tokenType.LINE_BREAKS = config[LINE_BREAKS];
  }
  if (Object.hasOwn(config, START_CHARS_HINT)) {
    tokenType.START_CHARS_HINT = config[START_CHARS_HINT];
  }
  return tokenType;
}
__name(createTokenInternal, "createTokenInternal");
var EOF = createToken({ name: "EOF", pattern: Lexer.NA });
augmentTokenTypes([EOF]);
function createTokenInstance(tokType, image, startOffset, endOffset, startLine, endLine, startColumn, endColumn) {
  return {
    image,
    startOffset,
    endOffset,
    startLine,
    endLine,
    startColumn,
    endColumn,
    tokenTypeIdx: tokType.tokenTypeIdx,
    tokenType: tokType
  };
}
__name(createTokenInstance, "createTokenInstance");
function tokenMatcher(token, tokType) {
  return tokenStructuredMatcher(token, tokType);
}
__name(tokenMatcher, "tokenMatcher");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/errors_public.js
var defaultParserErrorProvider = {
  buildMismatchTokenMessage({ expected, actual, previous, ruleName }) {
    const hasLabel = hasTokenLabel2(expected);
    const expectedMsg = hasLabel ? `--> ${tokenLabel2(expected)} <--` : `token of type --> ${expected.name} <--`;
    const msg = `Expecting ${expectedMsg} but found --> '${actual.image}' <--`;
    return msg;
  },
  buildNotAllInputParsedMessage({ firstRedundant, ruleName }) {
    return "Redundant input, expecting EOF but found: " + firstRedundant.image;
  },
  buildNoViableAltMessage({ expectedPathsPerAlt, actual, previous, customUserDescription, ruleName }) {
    const errPrefix = "Expecting: ";
    const actualText = actual[0].image;
    const errSuffix = "\nbut found: '" + actualText + "'";
    if (customUserDescription) {
      return errPrefix + customUserDescription + errSuffix;
    } else {
      const allLookAheadPaths = expectedPathsPerAlt.reduce((result, currAltPaths) => result.concat(currAltPaths), []);
      const nextValidTokenSequences = allLookAheadPaths.map((currPath) => `[${currPath.map((currTokenType) => tokenLabel2(currTokenType)).join(", ")}]`);
      const nextValidSequenceItems = nextValidTokenSequences.map((itemMsg, idx) => `  ${idx + 1}. ${itemMsg}`);
      const calculatedDescription = `one of these possible Token sequences:
${nextValidSequenceItems.join("\n")}`;
      return errPrefix + calculatedDescription + errSuffix;
    }
  },
  buildEarlyExitMessage({ expectedIterationPaths, actual, customUserDescription, ruleName }) {
    const errPrefix = "Expecting: ";
    const actualText = actual[0].image;
    const errSuffix = "\nbut found: '" + actualText + "'";
    if (customUserDescription) {
      return errPrefix + customUserDescription + errSuffix;
    } else {
      const nextValidTokenSequences = expectedIterationPaths.map((currPath) => `[${currPath.map((currTokenType) => tokenLabel2(currTokenType)).join(",")}]`);
      const calculatedDescription = `expecting at least one iteration which starts with one of these possible Token sequences::
  <${nextValidTokenSequences.join(" ,")}>`;
      return errPrefix + calculatedDescription + errSuffix;
    }
  }
};
Object.freeze(defaultParserErrorProvider);
var defaultGrammarResolverErrorProvider = {
  buildRuleNotFoundError(topLevelRule, undefinedRule) {
    const msg = "Invalid grammar, reference to a rule which is not defined: ->" + undefinedRule.nonTerminalName + "<-\ninside top level rule: ->" + topLevelRule.name + "<-";
    return msg;
  }
};
var defaultGrammarValidatorErrorProvider = {
  buildDuplicateFoundError(topLevelRule, duplicateProds) {
    function getExtraProductionArgument2(prod) {
      if (prod instanceof Terminal) {
        return prod.terminalType.name;
      } else if (prod instanceof NonTerminal) {
        return prod.nonTerminalName;
      } else {
        return "";
      }
    }
    __name(getExtraProductionArgument2, "getExtraProductionArgument");
    const topLevelName = topLevelRule.name;
    const duplicateProd = duplicateProds[0];
    const index = duplicateProd.idx;
    const dslName = getProductionDslName(duplicateProd);
    const extraArgument = getExtraProductionArgument2(duplicateProd);
    const hasExplicitIndex = index > 0;
    let msg = `->${dslName}${hasExplicitIndex ? index : ""}<- ${extraArgument ? `with argument: ->${extraArgument}<-` : ""}
                  appears more than once (${duplicateProds.length} times) in the top level rule: ->${topLevelName}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
    msg = msg.replace(/[ \t]+/g, " ");
    msg = msg.replace(/\s\s+/g, "\n");
    return msg;
  },
  buildNamespaceConflictError(rule) {
    const errMsg = `Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${rule.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;
    return errMsg;
  },
  buildAlternationPrefixAmbiguityError(options) {
    const pathMsg = options.prefixPath.map((currTok) => tokenLabel2(currTok)).join(", ");
    const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
    const errMsg = `Ambiguous alternatives: <${options.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;
    return errMsg;
  },
  buildAlternationAmbiguityError(options) {
    const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
    const isEmptyPath = options.prefixPath.length === 0;
    let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(" ,")}> in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
`;
    if (isEmptyPath) {
      currMessage += `These alternatives are all empty (match no tokens), making them indistinguishable.
Only the last alternative may be empty.
`;
    } else {
      const pathMsg = options.prefixPath.map((currtok) => tokenLabel2(currtok)).join(", ");
      currMessage += `<${pathMsg}> may appears as a prefix path in all these alternatives.
`;
    }
    currMessage += `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;
    return currMessage;
  },
  buildEmptyRepetitionError(options) {
    let dslName = getProductionDslName(options.repetition);
    if (options.repetition.idx !== 0) {
      dslName += options.repetition.idx;
    }
    const errMsg = `The repetition <${dslName}> within Rule <${options.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;
    return errMsg;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildTokenNameError(options) {
    return "deprecated";
  },
  buildEmptyAlternationError(options) {
    const errMsg = `Ambiguous empty alternative: <${options.emptyChoiceIdx + 1}> in <OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;
    return errMsg;
  },
  buildTooManyAlternativesError(options) {
    const errMsg = `An Alternation cannot have more than 256 alternatives:
<OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
 has ${options.alternation.definition.length + 1} alternatives.`;
    return errMsg;
  },
  buildLeftRecursionError(options) {
    const ruleName = options.topLevelRule.name;
    const pathNames = options.leftRecursionPath.map((currRule) => currRule.name);
    const leftRecursivePath = `${ruleName} --> ${pathNames.concat([ruleName]).join(" --> ")}`;
    const errMsg = `Left Recursion found in grammar.
rule: <${ruleName}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${leftRecursivePath}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;
    return errMsg;
  },
  // TODO: remove - `errors_public` from nyc.config.js exclude
  //       once this method is fully removed from this file
  buildInvalidRuleNameError(options) {
    return "deprecated";
  },
  buildDuplicateRuleNameError(options) {
    let ruleName;
    if (options.topLevelRule instanceof Rule) {
      ruleName = options.topLevelRule.name;
    } else {
      ruleName = options.topLevelRule;
    }
    const errMsg = `Duplicate definition, rule: ->${ruleName}<- is already defined in the grammar: ->${options.grammarName}<-`;
    return errMsg;
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/resolver.js
function resolveGrammar(topLevels, errMsgProvider) {
  const refResolver = new GastRefResolverVisitor(topLevels, errMsgProvider);
  refResolver.resolveRefs();
  return refResolver.errors;
}
__name(resolveGrammar, "resolveGrammar");
var GastRefResolverVisitor = class extends GAstVisitor {
  static {
    __name(this, "GastRefResolverVisitor");
  }
  constructor(nameToTopRule, errMsgProvider) {
    super();
    this.nameToTopRule = nameToTopRule;
    this.errMsgProvider = errMsgProvider;
    this.errors = [];
  }
  resolveRefs() {
    Object.values(this.nameToTopRule).forEach((prod) => {
      this.currTopLevel = prod;
      prod.accept(this);
    });
  }
  visitNonTerminal(node) {
    const ref = this.nameToTopRule[node.nonTerminalName];
    if (!ref) {
      const msg = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, node);
      this.errors.push({
        message: msg,
        type: ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,
        ruleName: this.currTopLevel.name,
        unresolvedRefName: node.nonTerminalName
      });
    } else {
      node.referencedRule = ref;
    }
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/interpreter.js
var AbstractNextPossibleTokensWalker = class extends RestWalker {
  static {
    __name(this, "AbstractNextPossibleTokensWalker");
  }
  constructor(topProd, path) {
    super();
    this.topProd = topProd;
    this.path = path;
    this.possibleTokTypes = [];
    this.nextProductionName = "";
    this.nextProductionOccurrence = 0;
    this.found = false;
    this.isAtEndOfPath = false;
  }
  startWalking() {
    this.found = false;
    if (this.path.ruleStack[0] !== this.topProd.name) {
      throw Error("The path does not start with the walker's top Rule!");
    }
    this.ruleStack = [...this.path.ruleStack].reverse();
    this.occurrenceStack = [...this.path.occurrenceStack].reverse();
    this.ruleStack.pop();
    this.occurrenceStack.pop();
    this.updateExpectedNext();
    this.walk(this.topProd);
    return this.possibleTokTypes;
  }
  walk(prod, prevRest = []) {
    if (!this.found) {
      super.walk(prod, prevRest);
    }
  }
  walkProdRef(refProd, currRest, prevRest) {
    if (refProd.referencedRule.name === this.nextProductionName && refProd.idx === this.nextProductionOccurrence) {
      const fullRest = currRest.concat(prevRest);
      this.updateExpectedNext();
      this.walk(refProd.referencedRule, fullRest);
    }
  }
  updateExpectedNext() {
    if (this.ruleStack.length === 0) {
      this.nextProductionName = "";
      this.nextProductionOccurrence = 0;
      this.isAtEndOfPath = true;
    } else {
      this.nextProductionName = this.ruleStack.pop();
      this.nextProductionOccurrence = this.occurrenceStack.pop();
    }
  }
};
var NextAfterTokenWalker = class extends AbstractNextPossibleTokensWalker {
  static {
    __name(this, "NextAfterTokenWalker");
  }
  constructor(topProd, path) {
    super(topProd, path);
    this.path = path;
    this.nextTerminalName = "";
    this.nextTerminalOccurrence = 0;
    this.nextTerminalName = this.path.lastTok.name;
    this.nextTerminalOccurrence = this.path.lastTokOccurrence;
  }
  walkTerminal(terminal, currRest, prevRest) {
    if (this.isAtEndOfPath && terminal.terminalType.name === this.nextTerminalName && terminal.idx === this.nextTerminalOccurrence && !this.found) {
      const fullRest = currRest.concat(prevRest);
      const restProd = new Alternative({ definition: fullRest });
      this.possibleTokTypes = first(restProd);
      this.found = true;
    }
  }
};
var AbstractNextTerminalAfterProductionWalker = class extends RestWalker {
  static {
    __name(this, "AbstractNextTerminalAfterProductionWalker");
  }
  constructor(topRule, occurrence) {
    super();
    this.topRule = topRule;
    this.occurrence = occurrence;
    this.result = {
      token: void 0,
      occurrence: void 0,
      isEndOfRule: void 0
    };
  }
  startWalking() {
    this.walk(this.topRule);
    return this.result;
  }
};
var NextTerminalAfterManyWalker = class extends AbstractNextTerminalAfterProductionWalker {
  static {
    __name(this, "NextTerminalAfterManyWalker");
  }
  walkMany(manyProd, currRest, prevRest) {
    if (manyProd.idx === this.occurrence) {
      const firstAfterMany = currRest.concat(prevRest)[0];
      this.result.isEndOfRule = firstAfterMany === void 0;
      if (firstAfterMany instanceof Terminal) {
        this.result.token = firstAfterMany.terminalType;
        this.result.occurrence = firstAfterMany.idx;
      }
    } else {
      super.walkMany(manyProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterManySepWalker = class extends AbstractNextTerminalAfterProductionWalker {
  static {
    __name(this, "NextTerminalAfterManySepWalker");
  }
  walkManySep(manySepProd, currRest, prevRest) {
    if (manySepProd.idx === this.occurrence) {
      const firstAfterManySep = currRest.concat(prevRest)[0];
      this.result.isEndOfRule = firstAfterManySep === void 0;
      if (firstAfterManySep instanceof Terminal) {
        this.result.token = firstAfterManySep.terminalType;
        this.result.occurrence = firstAfterManySep.idx;
      }
    } else {
      super.walkManySep(manySepProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterAtLeastOneWalker = class extends AbstractNextTerminalAfterProductionWalker {
  static {
    __name(this, "NextTerminalAfterAtLeastOneWalker");
  }
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    if (atLeastOneProd.idx === this.occurrence) {
      const firstAfterAtLeastOne = currRest.concat(prevRest)[0];
      this.result.isEndOfRule = firstAfterAtLeastOne === void 0;
      if (firstAfterAtLeastOne instanceof Terminal) {
        this.result.token = firstAfterAtLeastOne.terminalType;
        this.result.occurrence = firstAfterAtLeastOne.idx;
      }
    } else {
      super.walkAtLeastOne(atLeastOneProd, currRest, prevRest);
    }
  }
};
var NextTerminalAfterAtLeastOneSepWalker = class extends AbstractNextTerminalAfterProductionWalker {
  static {
    __name(this, "NextTerminalAfterAtLeastOneSepWalker");
  }
  walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest) {
    if (atleastOneSepProd.idx === this.occurrence) {
      const firstAfterfirstAfterAtLeastOneSep = currRest.concat(prevRest)[0];
      this.result.isEndOfRule = firstAfterfirstAfterAtLeastOneSep === void 0;
      if (firstAfterfirstAfterAtLeastOneSep instanceof Terminal) {
        this.result.token = firstAfterfirstAfterAtLeastOneSep.terminalType;
        this.result.occurrence = firstAfterfirstAfterAtLeastOneSep.idx;
      }
    } else {
      super.walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest);
    }
  }
};
function possiblePathsFrom(targetDef, maxLength, currPath = []) {
  currPath = [...currPath];
  let result = [];
  let i = 0;
  function remainingPathWith(nextDef) {
    return nextDef.concat(targetDef.slice(i + 1));
  }
  __name(remainingPathWith, "remainingPathWith");
  function getAlternativesForProd(definition) {
    const alternatives = possiblePathsFrom(remainingPathWith(definition), maxLength, currPath);
    return result.concat(alternatives);
  }
  __name(getAlternativesForProd, "getAlternativesForProd");
  while (currPath.length < maxLength && i < targetDef.length) {
    const prod = targetDef[i];
    if (prod instanceof Alternative) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof NonTerminal) {
      return getAlternativesForProd(prod.definition);
    } else if (prod instanceof Option) {
      result = getAlternativesForProd(prod.definition);
    } else if (prod instanceof RepetitionMandatory) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const newDef = [
        new Alternative({ definition: prod.definition }),
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ];
      return getAlternativesForProd(newDef);
    } else if (prod instanceof RepetitionWithSeparator) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Repetition) {
      const newDef = prod.definition.concat([
        new Repetition({
          definition: prod.definition
        })
      ]);
      result = getAlternativesForProd(newDef);
    } else if (prod instanceof Alternation) {
      prod.definition.forEach((currAlt) => {
        if (currAlt.definition.length !== 0) {
          result = getAlternativesForProd(currAlt.definition);
        }
      });
      return result;
    } else if (prod instanceof Terminal) {
      currPath.push(prod.terminalType);
    } else {
      throw Error("non exhaustive match");
    }
    i++;
  }
  result.push({
    partialPath: currPath,
    suffixDef: targetDef.slice(i)
  });
  return result;
}
__name(possiblePathsFrom, "possiblePathsFrom");
function nextPossibleTokensAfter(initialDef, tokenVector, tokMatcher, maxLookAhead) {
  const EXIT_NON_TERMINAL = "EXIT_NONE_TERMINAL";
  const EXIT_NON_TERMINAL_ARR = [EXIT_NON_TERMINAL];
  const EXIT_ALTERNATIVE = "EXIT_ALTERNATIVE";
  let foundCompletePath = false;
  const tokenVectorLength = tokenVector.length;
  const minimalAlternativesIndex = tokenVectorLength - maxLookAhead - 1;
  const result = [];
  const possiblePaths = [];
  possiblePaths.push({
    idx: -1,
    def: initialDef,
    ruleStack: [],
    occurrenceStack: []
  });
  while (possiblePaths.length !== 0) {
    const currPath = possiblePaths.pop();
    if (currPath === EXIT_ALTERNATIVE) {
      if (foundCompletePath && possiblePaths.at(-1).idx <= minimalAlternativesIndex) {
        possiblePaths.pop();
      }
      continue;
    }
    const currDef = currPath.def;
    const currIdx = currPath.idx;
    const currRuleStack = currPath.ruleStack;
    const currOccurrenceStack = currPath.occurrenceStack;
    if (currDef.length === 0) {
      continue;
    }
    const prod = currDef[0];
    if (prod === EXIT_NON_TERMINAL) {
      const nextPath = {
        idx: currIdx,
        def: currDef.slice(1),
        ruleStack: currRuleStack.slice(0, -1),
        occurrenceStack: currOccurrenceStack.slice(0, -1)
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Terminal) {
      if (currIdx < tokenVectorLength - 1) {
        const nextIdx = currIdx + 1;
        const actualToken = tokenVector[nextIdx];
        if (tokMatcher(actualToken, prod.terminalType)) {
          const nextPath = {
            idx: nextIdx,
            def: currDef.slice(1),
            ruleStack: currRuleStack,
            occurrenceStack: currOccurrenceStack
          };
          possiblePaths.push(nextPath);
        }
      } else if (currIdx === tokenVectorLength - 1) {
        result.push({
          nextTokenType: prod.terminalType,
          nextTokenOccurrence: prod.idx,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        });
        foundCompletePath = true;
      } else {
        throw Error("non exhaustive match");
      }
    } else if (prod instanceof NonTerminal) {
      const newRuleStack = [...currRuleStack];
      newRuleStack.push(prod.nonTerminalName);
      const newOccurrenceStack = [...currOccurrenceStack];
      newOccurrenceStack.push(prod.idx);
      const nextPath = {
        idx: currIdx,
        def: prod.definition.concat(EXIT_NON_TERMINAL_ARR, currDef.slice(1)),
        ruleStack: newRuleStack,
        occurrenceStack: newOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof Option) {
      const nextPathWithout = {
        idx: currIdx,
        def: currDef.slice(1),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nextPathWith = {
        idx: currIdx,
        def: prod.definition.concat(currDef.slice(1)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof RepetitionMandatory) {
      const secondIteration = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], currDef.slice(1));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const secondIteration = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([secondIteration], currDef.slice(1));
      const nextPath = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPath);
    } else if (prod instanceof RepetitionWithSeparator) {
      const nextPathWithout = {
        idx: currIdx,
        def: currDef.slice(1),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const separatorGast = new Terminal({
        terminalType: prod.separator
      });
      const nthRepetition = new Repetition({
        definition: [separatorGast].concat(prod.definition),
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], currDef.slice(1));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Repetition) {
      const nextPathWithout = {
        idx: currIdx,
        def: currDef.slice(1),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWithout);
      possiblePaths.push(EXIT_ALTERNATIVE);
      const nthRepetition = new Repetition({
        definition: prod.definition,
        idx: prod.idx
      });
      const nextDef = prod.definition.concat([nthRepetition], currDef.slice(1));
      const nextPathWith = {
        idx: currIdx,
        def: nextDef,
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      };
      possiblePaths.push(nextPathWith);
    } else if (prod instanceof Alternation) {
      for (let i = prod.definition.length - 1; i >= 0; i--) {
        const currAlt = prod.definition[i];
        const currAltPath = {
          idx: currIdx,
          def: currAlt.definition.concat(currDef.slice(1)),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(currAltPath);
        possiblePaths.push(EXIT_ALTERNATIVE);
      }
    } else if (prod instanceof Alternative) {
      possiblePaths.push({
        idx: currIdx,
        def: prod.definition.concat(currDef.slice(1)),
        ruleStack: currRuleStack,
        occurrenceStack: currOccurrenceStack
      });
    } else if (prod instanceof Rule) {
      possiblePaths.push(expandTopLevelRule(prod, currIdx, currRuleStack, currOccurrenceStack));
    } else {
      throw Error("non exhaustive match");
    }
  }
  return result;
}
__name(nextPossibleTokensAfter, "nextPossibleTokensAfter");
function expandTopLevelRule(topRule, currIdx, currRuleStack, currOccurrenceStack) {
  const newRuleStack = [...currRuleStack];
  newRuleStack.push(topRule.name);
  const newCurrOccurrenceStack = [...currOccurrenceStack];
  newCurrOccurrenceStack.push(1);
  return {
    idx: currIdx,
    def: topRule.definition,
    ruleStack: newRuleStack,
    occurrenceStack: newCurrOccurrenceStack
  };
}
__name(expandTopLevelRule, "expandTopLevelRule");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/lookahead.js
var PROD_TYPE;
(function(PROD_TYPE2) {
  PROD_TYPE2[PROD_TYPE2["OPTION"] = 0] = "OPTION";
  PROD_TYPE2[PROD_TYPE2["REPETITION"] = 1] = "REPETITION";
  PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY"] = 2] = "REPETITION_MANDATORY";
  PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY_WITH_SEPARATOR"] = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR";
  PROD_TYPE2[PROD_TYPE2["REPETITION_WITH_SEPARATOR"] = 4] = "REPETITION_WITH_SEPARATOR";
  PROD_TYPE2[PROD_TYPE2["ALTERNATION"] = 5] = "ALTERNATION";
})(PROD_TYPE || (PROD_TYPE = {}));
function getProdType(prod) {
  if (prod instanceof Option || prod === "Option") {
    return PROD_TYPE.OPTION;
  } else if (prod instanceof Repetition || prod === "Repetition") {
    return PROD_TYPE.REPETITION;
  } else if (prod instanceof RepetitionMandatory || prod === "RepetitionMandatory") {
    return PROD_TYPE.REPETITION_MANDATORY;
  } else if (prod instanceof RepetitionMandatoryWithSeparator || prod === "RepetitionMandatoryWithSeparator") {
    return PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR;
  } else if (prod instanceof RepetitionWithSeparator || prod === "RepetitionWithSeparator") {
    return PROD_TYPE.REPETITION_WITH_SEPARATOR;
  } else if (prod instanceof Alternation || prod === "Alternation") {
    return PROD_TYPE.ALTERNATION;
  } else {
    throw Error("non exhaustive match");
  }
}
__name(getProdType, "getProdType");
function buildLookaheadFuncForOr(occurrence, ruleGrammar, maxLookahead, hasPredicates, dynamicTokensEnabled, laFuncBuilder) {
  const lookAheadPaths = getLookaheadPathsForOr(occurrence, ruleGrammar, maxLookahead);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return laFuncBuilder(lookAheadPaths, hasPredicates, tokenMatcher2, dynamicTokensEnabled);
}
__name(buildLookaheadFuncForOr, "buildLookaheadFuncForOr");
function buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, k, dynamicTokensEnabled, prodType, lookaheadBuilder) {
  const lookAheadPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k);
  const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
  return lookaheadBuilder(lookAheadPaths[0], tokenMatcher2, dynamicTokensEnabled);
}
__name(buildLookaheadFuncForOptionalProd, "buildLookaheadFuncForOptionalProd");
function buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher2, dynamicTokensEnabled) {
  const numOfAlts = alts.length;
  const areAllOneTokenLookahead = alts.every((currAlt) => {
    return currAlt.every((currPath) => {
      return currPath.length === 1;
    });
  });
  if (hasPredicates) {
    return function(orAlts) {
      const predicates = orAlts.map((currAlt) => currAlt.GATE);
      for (let t = 0; t < numOfAlts; t++) {
        const currAlt = alts[t];
        const currNumOfPaths = currAlt.length;
        const currPredicate = predicates[t];
        if (currPredicate !== void 0 && currPredicate.call(this) === false) {
          continue;
        }
        nextPath: for (let j = 0; j < currNumOfPaths; j++) {
          const currPath = currAlt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA_FAST(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return t;
        }
      }
      return void 0;
    };
  } else if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokenAlts = alts.map((currAlt) => {
      return currAlt.flat();
    });
    const choiceToAlt = singleTokenAlts.reduce((result, currAlt, idx) => {
      currAlt.forEach((currTokType) => {
        if (!(currTokType.tokenTypeIdx in result)) {
          result[currTokType.tokenTypeIdx] = idx;
        }
        currTokType.categoryMatches.forEach((currExtendingType) => {
          if (!Object.hasOwn(result, currExtendingType)) {
            result[currExtendingType] = idx;
          }
        });
      });
      return result;
    }, {});
    return function() {
      const nextToken = this.LA_FAST(1);
      return choiceToAlt[nextToken.tokenTypeIdx];
    };
  } else {
    return function() {
      for (let t = 0; t < numOfAlts; t++) {
        const currAlt = alts[t];
        const currNumOfPaths = currAlt.length;
        nextPath: for (let j = 0; j < currNumOfPaths; j++) {
          const currPath = currAlt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA_FAST(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return t;
        }
      }
      return void 0;
    };
  }
}
__name(buildAlternativesLookAheadFunc, "buildAlternativesLookAheadFunc");
function buildSingleAlternativeLookaheadFunction(alt, tokenMatcher2, dynamicTokensEnabled) {
  const areAllOneTokenLookahead = alt.every((currPath) => {
    return currPath.length === 1;
  });
  const numOfPaths = alt.length;
  if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
    const singleTokensTypes = alt.flat();
    if (singleTokensTypes.length === 1 && singleTokensTypes[0].categoryMatches.length === 0) {
      const expectedTokenType = singleTokensTypes[0];
      const expectedTokenUniqueKey = expectedTokenType.tokenTypeIdx;
      return function() {
        return this.LA_FAST(1).tokenTypeIdx === expectedTokenUniqueKey;
      };
    } else {
      const choiceToAlt = singleTokensTypes.reduce((result, currTokType, idx) => {
        result[currTokType.tokenTypeIdx] = true;
        currTokType.categoryMatches.forEach((currExtendingType) => {
          result[currExtendingType] = true;
        });
        return result;
      }, []);
      return function() {
        const nextToken = this.LA_FAST(1);
        return choiceToAlt[nextToken.tokenTypeIdx] === true;
      };
    }
  } else {
    return function() {
      nextPath: for (let j = 0; j < numOfPaths; j++) {
        const currPath = alt[j];
        const currPathLength = currPath.length;
        for (let i = 0; i < currPathLength; i++) {
          const nextToken = this.LA_FAST(i + 1);
          if (tokenMatcher2(nextToken, currPath[i]) === false) {
            continue nextPath;
          }
        }
        return true;
      }
      return false;
    };
  }
}
__name(buildSingleAlternativeLookaheadFunction, "buildSingleAlternativeLookaheadFunction");
var RestDefinitionFinderWalker = class extends RestWalker {
  static {
    __name(this, "RestDefinitionFinderWalker");
  }
  constructor(topProd, targetOccurrence, targetProdType) {
    super();
    this.topProd = topProd;
    this.targetOccurrence = targetOccurrence;
    this.targetProdType = targetProdType;
  }
  startWalking() {
    this.walk(this.topProd);
    return this.restDef;
  }
  checkIsTarget(node, expectedProdType, currRest, prevRest) {
    if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdType) {
      this.restDef = currRest.concat(prevRest);
      return true;
    }
    return false;
  }
  walkOption(optionProd, currRest, prevRest) {
    if (!this.checkIsTarget(optionProd, PROD_TYPE.OPTION, currRest, prevRest)) {
      super.walkOption(optionProd, currRest, prevRest);
    }
  }
  walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
    if (!this.checkIsTarget(atLeastOneProd, PROD_TYPE.REPETITION_MANDATORY, currRest, prevRest)) {
      super.walkOption(atLeastOneProd, currRest, prevRest);
    }
  }
  walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
    if (!this.checkIsTarget(atLeastOneSepProd, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currRest, prevRest)) {
      super.walkOption(atLeastOneSepProd, currRest, prevRest);
    }
  }
  walkMany(manyProd, currRest, prevRest) {
    if (!this.checkIsTarget(manyProd, PROD_TYPE.REPETITION, currRest, prevRest)) {
      super.walkOption(manyProd, currRest, prevRest);
    }
  }
  walkManySep(manySepProd, currRest, prevRest) {
    if (!this.checkIsTarget(manySepProd, PROD_TYPE.REPETITION_WITH_SEPARATOR, currRest, prevRest)) {
      super.walkOption(manySepProd, currRest, prevRest);
    }
  }
};
var InsideDefinitionFinderVisitor = class extends GAstVisitor {
  static {
    __name(this, "InsideDefinitionFinderVisitor");
  }
  constructor(targetOccurrence, targetProdType, targetRef) {
    super();
    this.targetOccurrence = targetOccurrence;
    this.targetProdType = targetProdType;
    this.targetRef = targetRef;
    this.result = [];
  }
  checkIsTarget(node, expectedProdName) {
    if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdName && (this.targetRef === void 0 || node === this.targetRef)) {
      this.result = node.definition;
    }
  }
  visitOption(node) {
    this.checkIsTarget(node, PROD_TYPE.OPTION);
  }
  visitRepetition(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION);
  }
  visitRepetitionMandatory(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY);
  }
  visitRepetitionMandatoryWithSeparator(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
  }
  visitRepetitionWithSeparator(node) {
    this.checkIsTarget(node, PROD_TYPE.REPETITION_WITH_SEPARATOR);
  }
  visitAlternation(node) {
    this.checkIsTarget(node, PROD_TYPE.ALTERNATION);
  }
};
function initializeArrayOfArrays(size) {
  const result = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = [];
  }
  return result;
}
__name(initializeArrayOfArrays, "initializeArrayOfArrays");
function pathToHashKeys(path) {
  let keys = [""];
  for (let i = 0; i < path.length; i++) {
    const tokType = path[i];
    const longerKeys = [];
    for (let j = 0; j < keys.length; j++) {
      const currShorterKey = keys[j];
      longerKeys.push(currShorterKey + "_" + tokType.tokenTypeIdx);
      for (let t = 0; t < tokType.categoryMatches.length; t++) {
        const categoriesKeySuffix = "_" + tokType.categoryMatches[t];
        longerKeys.push(currShorterKey + categoriesKeySuffix);
      }
    }
    keys = longerKeys;
  }
  return keys;
}
__name(pathToHashKeys, "pathToHashKeys");
function isUniquePrefixHash(altKnownPathsKeys, searchPathKeys, idx) {
  for (let currAltIdx = 0; currAltIdx < altKnownPathsKeys.length; currAltIdx++) {
    if (currAltIdx === idx) {
      continue;
    }
    const otherAltKnownPathsKeys = altKnownPathsKeys[currAltIdx];
    for (let searchIdx = 0; searchIdx < searchPathKeys.length; searchIdx++) {
      const searchKey = searchPathKeys[searchIdx];
      if (otherAltKnownPathsKeys[searchKey] === true) {
        return false;
      }
    }
  }
  return true;
}
__name(isUniquePrefixHash, "isUniquePrefixHash");
function lookAheadSequenceFromAlternatives(altsDefs, k) {
  const partialAlts = altsDefs.map((currAlt) => possiblePathsFrom([currAlt], 1));
  const finalResult = initializeArrayOfArrays(partialAlts.length);
  const altsHashes = partialAlts.map((currAltPaths) => {
    const dict = {};
    currAltPaths.forEach((item) => {
      const keys = pathToHashKeys(item.partialPath);
      keys.forEach((currKey) => {
        dict[currKey] = true;
      });
    });
    return dict;
  });
  let newData = partialAlts;
  for (let pathLength = 1; pathLength <= k; pathLength++) {
    const currDataset = newData;
    newData = initializeArrayOfArrays(currDataset.length);
    for (let altIdx = 0; altIdx < currDataset.length; altIdx++) {
      const currAltPathsAndSuffixes = currDataset[altIdx];
      for (let currPathIdx = 0; currPathIdx < currAltPathsAndSuffixes.length; currPathIdx++) {
        const currPathPrefix = currAltPathsAndSuffixes[currPathIdx].partialPath;
        const suffixDef = currAltPathsAndSuffixes[currPathIdx].suffixDef;
        const prefixKeys = pathToHashKeys(currPathPrefix);
        const isUnique = isUniquePrefixHash(altsHashes, prefixKeys, altIdx);
        if (isUnique || suffixDef.length === 0 || currPathPrefix.length === k) {
          const currAltResult = finalResult[altIdx];
          if (containsPath(currAltResult, currPathPrefix) === false) {
            currAltResult.push(currPathPrefix);
            for (let j = 0; j < prefixKeys.length; j++) {
              const currKey = prefixKeys[j];
              altsHashes[altIdx][currKey] = true;
            }
          }
        } else {
          const newPartialPathsAndSuffixes = possiblePathsFrom(suffixDef, pathLength + 1, currPathPrefix);
          newData[altIdx] = newData[altIdx].concat(newPartialPathsAndSuffixes);
          newPartialPathsAndSuffixes.forEach((item) => {
            const prefixKeys2 = pathToHashKeys(item.partialPath);
            prefixKeys2.forEach((key) => {
              altsHashes[altIdx][key] = true;
            });
          });
        }
      }
    }
  }
  return finalResult;
}
__name(lookAheadSequenceFromAlternatives, "lookAheadSequenceFromAlternatives");
function getLookaheadPathsForOr(occurrence, ruleGrammar, k, orProd) {
  const visitor = new InsideDefinitionFinderVisitor(occurrence, PROD_TYPE.ALTERNATION, orProd);
  ruleGrammar.accept(visitor);
  return lookAheadSequenceFromAlternatives(visitor.result, k);
}
__name(getLookaheadPathsForOr, "getLookaheadPathsForOr");
function getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k) {
  const insideDefVisitor = new InsideDefinitionFinderVisitor(occurrence, prodType);
  ruleGrammar.accept(insideDefVisitor);
  const insideDef = insideDefVisitor.result;
  const afterDefWalker = new RestDefinitionFinderWalker(ruleGrammar, occurrence, prodType);
  const afterDef = afterDefWalker.startWalking();
  const insideFlat = new Alternative({ definition: insideDef });
  const afterFlat = new Alternative({ definition: afterDef });
  return lookAheadSequenceFromAlternatives([insideFlat, afterFlat], k);
}
__name(getLookaheadPathsForOptionalProd, "getLookaheadPathsForOptionalProd");
function containsPath(alternative, searchPath) {
  compareOtherPath: for (let i = 0; i < alternative.length; i++) {
    const otherPath = alternative[i];
    if (otherPath.length !== searchPath.length) {
      continue;
    }
    for (let j = 0; j < otherPath.length; j++) {
      const searchTok = searchPath[j];
      const otherTok = otherPath[j];
      const matchingTokens = searchTok === otherTok || otherTok.categoryMatchesMap[searchTok.tokenTypeIdx] !== void 0;
      if (matchingTokens === false) {
        continue compareOtherPath;
      }
    }
    return true;
  }
  return false;
}
__name(containsPath, "containsPath");
function isStrictPrefixOfPath(prefix, other) {
  return prefix.length < other.length && prefix.every((tokType, idx) => {
    const otherTokType = other[idx];
    return tokType === otherTokType || otherTokType.categoryMatchesMap[tokType.tokenTypeIdx];
  });
}
__name(isStrictPrefixOfPath, "isStrictPrefixOfPath");
function areTokenCategoriesNotUsed(lookAheadPaths) {
  return lookAheadPaths.every((singleAltPaths) => singleAltPaths.every((singlePath) => singlePath.every((token) => token.categoryMatches.length === 0)));
}
__name(areTokenCategoriesNotUsed, "areTokenCategoriesNotUsed");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/checks.js
function validateLookahead(options) {
  const lookaheadValidationErrorMessages = options.lookaheadStrategy.validate({
    rules: options.rules,
    tokenTypes: options.tokenTypes,
    grammarName: options.grammarName
  });
  return lookaheadValidationErrorMessages.map((errorMessage) => Object.assign({ type: ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION }, errorMessage));
}
__name(validateLookahead, "validateLookahead");
function validateGrammar(topLevels, tokenTypes, errMsgProvider, grammarName) {
  const duplicateErrors = topLevels.flatMap((currTopLevel) => validateDuplicateProductions(currTopLevel, errMsgProvider));
  const termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
  const tooManyAltsErrors = topLevels.flatMap((curRule) => validateTooManyAlts(curRule, errMsgProvider));
  const duplicateRulesError = topLevels.flatMap((curRule) => validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider));
  return duplicateErrors.concat(termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
}
__name(validateGrammar, "validateGrammar");
function validateDuplicateProductions(topLevelRule, errMsgProvider) {
  const collectorVisitor2 = new OccurrenceValidationCollector();
  topLevelRule.accept(collectorVisitor2);
  const allRuleProductions = collectorVisitor2.allProductions;
  const productionGroups = Object.groupBy(allRuleProductions, identifyProductionForDuplicates);
  const duplicates = Object.fromEntries(Object.entries(productionGroups).filter(([_k, currGroup]) => currGroup.length > 1));
  const errors = Object.values(duplicates).map((currDuplicates) => {
    const firstProd = currDuplicates[0];
    const msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
    const dslName = getProductionDslName(firstProd);
    const defError = {
      message: msg,
      type: ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
      ruleName: topLevelRule.name,
      dslName,
      occurrence: firstProd.idx
    };
    const param = getExtraProductionArgument(firstProd);
    if (param) {
      defError.parameter = param;
    }
    return defError;
  });
  return errors;
}
__name(validateDuplicateProductions, "validateDuplicateProductions");
function identifyProductionForDuplicates(prod) {
  return `${getProductionDslName(prod)}_#_${prod.idx}_#_${getExtraProductionArgument(prod)}`;
}
__name(identifyProductionForDuplicates, "identifyProductionForDuplicates");
function getExtraProductionArgument(prod) {
  if (prod instanceof Terminal) {
    return prod.terminalType.name;
  } else if (prod instanceof NonTerminal) {
    return prod.nonTerminalName;
  } else {
    return "";
  }
}
__name(getExtraProductionArgument, "getExtraProductionArgument");
var OccurrenceValidationCollector = class extends GAstVisitor {
  static {
    __name(this, "OccurrenceValidationCollector");
  }
  constructor() {
    super(...arguments);
    this.allProductions = [];
  }
  visitNonTerminal(subrule) {
    this.allProductions.push(subrule);
  }
  visitOption(option) {
    this.allProductions.push(option);
  }
  visitRepetitionWithSeparator(manySep) {
    this.allProductions.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.allProductions.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.allProductions.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.allProductions.push(many);
  }
  visitAlternation(or) {
    this.allProductions.push(or);
  }
  visitTerminal(terminal) {
    this.allProductions.push(terminal);
  }
};
function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
  const errors = [];
  const occurrences = allRules.reduce((result, curRule) => {
    if (curRule.name === rule.name) {
      return result + 1;
    }
    return result;
  }, 0);
  if (occurrences > 1) {
    const errMsg = errMsgProvider.buildDuplicateRuleNameError({
      topLevelRule: rule,
      grammarName: className
    });
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
      ruleName: rule.name
    });
  }
  return errors;
}
__name(validateRuleDoesNotAlreadyExist, "validateRuleDoesNotAlreadyExist");
function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
  const errors = [];
  let errMsg;
  if (!definedRulesNames.includes(ruleName)) {
    errMsg = `Invalid rule override, rule: ->${ruleName}<- cannot be overridden in the grammar: ->${className}<-as it is not defined in any of the super grammars `;
    errors.push({
      message: errMsg,
      type: ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
      ruleName
    });
  }
  return errors;
}
__name(validateRuleIsOverridden, "validateRuleIsOverridden");
function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path = []) {
  const errors = [];
  const nextNonTerminals = getFirstNoneTerminal(currRule.definition);
  if (nextNonTerminals.length === 0) {
    return [];
  } else {
    const ruleName = topRule.name;
    const foundLeftRecursion = nextNonTerminals.includes(topRule);
    if (foundLeftRecursion) {
      errors.push({
        message: errMsgProvider.buildLeftRecursionError({
          topLevelRule: topRule,
          leftRecursionPath: path
        }),
        type: ParserDefinitionErrorType.LEFT_RECURSION,
        ruleName
      });
    }
    const excluded = path.concat([topRule]);
    const validNextSteps = nextNonTerminals.filter((x) => !excluded.includes(x));
    const errorsFromNextSteps = validNextSteps.flatMap((currRefRule) => {
      const newPath = [...path];
      newPath.push(currRefRule);
      return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
    });
    return errors.concat(errorsFromNextSteps);
  }
}
__name(validateNoLeftRecursion, "validateNoLeftRecursion");
function getFirstNoneTerminal(definition) {
  let result = [];
  if (definition.length === 0) {
    return result;
  }
  const firstProd = definition[0];
  if (firstProd instanceof NonTerminal) {
    result.push(firstProd.referencedRule);
  } else if (firstProd instanceof Alternative || firstProd instanceof Option || firstProd instanceof RepetitionMandatory || firstProd instanceof RepetitionMandatoryWithSeparator || firstProd instanceof RepetitionWithSeparator || firstProd instanceof Repetition) {
    result = result.concat(getFirstNoneTerminal(firstProd.definition));
  } else if (firstProd instanceof Alternation) {
    result = firstProd.definition.map((currSubDef) => getFirstNoneTerminal(currSubDef.definition)).flat();
  } else if (firstProd instanceof Terminal) {
  } else {
    throw Error("non exhaustive match");
  }
  const isFirstOptional = isOptionalProd(firstProd);
  const hasMore = definition.length > 1;
  if (isFirstOptional && hasMore) {
    const rest = definition.slice(1);
    return result.concat(getFirstNoneTerminal(rest));
  } else {
    return result;
  }
}
__name(getFirstNoneTerminal, "getFirstNoneTerminal");
var OrCollector = class extends GAstVisitor {
  static {
    __name(this, "OrCollector");
  }
  constructor() {
    super(...arguments);
    this.alternations = [];
  }
  visitAlternation(node) {
    this.alternations.push(node);
  }
};
function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = ors.flatMap((currOr) => {
    const exceptLast = currOr.definition.slice(0, -1);
    return exceptLast.flatMap((currAlternative, currAltIdx) => {
      const possibleFirstInAlt = nextPossibleTokensAfter([currAlternative], [], tokenStructuredMatcher, 1);
      if (possibleFirstInAlt.length === 0) {
        return [
          {
            message: errMsgProvider.buildEmptyAlternationError({
              topLevelRule,
              alternation: currOr,
              emptyChoiceIdx: currAltIdx
            }),
            type: ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
            ruleName: topLevelRule.name,
            occurrence: currOr.idx,
            alternative: currAltIdx + 1
          }
        ];
      } else {
        return [];
      }
    });
  });
  return errors;
}
__name(validateEmptyOrAlternative, "validateEmptyOrAlternative");
function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  let ors = orCollector.alternations;
  ors = ors.filter((currOr) => currOr.ignoreAmbiguities !== true);
  const errors = ors.flatMap((currOr) => {
    const currOccurrence = currOr.idx;
    const actualMaxLookahead = currOr.maxLookahead || globalMaxLookahead;
    const alternatives = getLookaheadPathsForOr(currOccurrence, topLevelRule, actualMaxLookahead, currOr);
    const altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    const altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
    return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
  });
  return errors;
}
__name(validateAmbiguousAlternationAlternatives, "validateAmbiguousAlternationAlternatives");
var RepetitionCollector = class extends GAstVisitor {
  static {
    __name(this, "RepetitionCollector");
  }
  constructor() {
    super(...arguments);
    this.allProductions = [];
  }
  visitRepetitionWithSeparator(manySep) {
    this.allProductions.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.allProductions.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.allProductions.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.allProductions.push(many);
  }
};
function validateTooManyAlts(topLevelRule, errMsgProvider) {
  const orCollector = new OrCollector();
  topLevelRule.accept(orCollector);
  const ors = orCollector.alternations;
  const errors = ors.flatMap((currOr) => {
    if (currOr.definition.length > 255) {
      return [
        {
          message: errMsgProvider.buildTooManyAlternativesError({
            topLevelRule,
            alternation: currOr
          }),
          type: ParserDefinitionErrorType.TOO_MANY_ALTS,
          ruleName: topLevelRule.name,
          occurrence: currOr.idx
        }
      ];
    } else {
      return [];
    }
  });
  return errors;
}
__name(validateTooManyAlts, "validateTooManyAlts");
function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
  const errors = [];
  topLevelRules.forEach((currTopRule) => {
    const collectorVisitor2 = new RepetitionCollector();
    currTopRule.accept(collectorVisitor2);
    const allRuleProductions = collectorVisitor2.allProductions;
    allRuleProductions.forEach((currProd) => {
      const prodType = getProdType(currProd);
      const actualMaxLookahead = currProd.maxLookahead || maxLookahead;
      const currOccurrence = currProd.idx;
      const paths = getLookaheadPathsForOptionalProd(currOccurrence, currTopRule, prodType, actualMaxLookahead);
      const pathsInsideProduction = paths[0];
      if (pathsInsideProduction.flat().length === 0) {
        const errMsg = errMsgProvider.buildEmptyRepetitionError({
          topLevelRule: currTopRule,
          repetition: currProd
        });
        errors.push({
          message: errMsg,
          type: ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
          ruleName: currTopRule.name
        });
      }
    });
  });
  return errors;
}
__name(validateSomeNonEmptyLookaheadPath, "validateSomeNonEmptyLookaheadPath");
function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const foundAmbiguousPaths = [];
  const identicalAmbiguities = alternatives.reduce((result, currAlt, currAltIdx) => {
    if (alternation.definition[currAltIdx].ignoreAmbiguities === true) {
      return result;
    }
    currAlt.forEach((currPath) => {
      const altsCurrPathAppearsIn = [currAltIdx];
      alternatives.forEach((currOtherAlt, currOtherAltIdx) => {
        if (currAltIdx !== currOtherAltIdx && containsPath(currOtherAlt, currPath) && // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) {
          altsCurrPathAppearsIn.push(currOtherAltIdx);
        }
      });
      if (altsCurrPathAppearsIn.length > 1 && !containsPath(foundAmbiguousPaths, currPath)) {
        foundAmbiguousPaths.push(currPath);
        result.push({
          alts: altsCurrPathAppearsIn,
          path: currPath
        });
      }
    });
    return result;
  }, []);
  const currErrors = identicalAmbiguities.map((currAmbDescriptor) => {
    const ambgIndices = currAmbDescriptor.alts.map((currAltIdx) => currAltIdx + 1);
    const currMessage = errMsgProvider.buildAlternationAmbiguityError({
      topLevelRule: rule,
      alternation,
      ambiguityIndices: ambgIndices,
      prefixPath: currAmbDescriptor.path
    });
    return {
      message: currMessage,
      type: ParserDefinitionErrorType.AMBIGUOUS_ALTS,
      ruleName: rule.name,
      occurrence: alternation.idx,
      alternatives: currAmbDescriptor.alts
    };
  });
  return currErrors;
}
__name(checkAlternativesAmbiguities, "checkAlternativesAmbiguities");
function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
  const pathsAndIndices = alternatives.reduce((result, currAlt, idx) => {
    const currPathsAndIdx = currAlt.map((currPath) => {
      return { idx, path: currPath };
    });
    return result.concat(currPathsAndIdx);
  }, []);
  const errors = pathsAndIndices.flatMap((currPathAndIdx) => {
    const alternativeGast = alternation.definition[currPathAndIdx.idx];
    if (alternativeGast.ignoreAmbiguities === true) {
      return [];
    }
    const targetIdx = currPathAndIdx.idx;
    const targetPath = currPathAndIdx.path;
    const prefixAmbiguitiesPathsAndIndices = pathsAndIndices.filter((searchPathAndIdx) => {
      return (
        // ignore (skip) ambiguities with this "other" alternative
        alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !== true && searchPathAndIdx.idx < targetIdx && // checking for strict prefix because identical lookaheads
        // will be be detected using a different validation.
        isStrictPrefixOfPath(searchPathAndIdx.path, targetPath)
      );
    });
    const currPathPrefixErrors = prefixAmbiguitiesPathsAndIndices.map((currAmbPathAndIdx) => {
      const ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
      const occurrence = alternation.idx === 0 ? "" : alternation.idx;
      const message = errMsgProvider.buildAlternationPrefixAmbiguityError({
        topLevelRule: rule,
        alternation,
        ambiguityIndices: ambgIndices,
        prefixPath: currAmbPathAndIdx.path
      });
      return {
        message,
        type: ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
        ruleName: rule.name,
        occurrence,
        alternatives: ambgIndices
      };
    });
    return currPathPrefixErrors;
  });
  return errors;
}
__name(checkPrefixAlternativesAmbiguities, "checkPrefixAlternativesAmbiguities");
function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
  const errors = [];
  const tokenNames = tokenTypes.map((currToken) => currToken.name);
  topLevels.forEach((currRule) => {
    const currRuleName = currRule.name;
    if (tokenNames.includes(currRuleName)) {
      const errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
      errors.push({
        message: errMsg,
        type: ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
        ruleName: currRuleName
      });
    }
  });
  return errors;
}
__name(checkTerminalAndNoneTerminalsNameSpace, "checkTerminalAndNoneTerminalsNameSpace");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js
function resolveGrammar2(options) {
  const actualOptions = Object.assign({ errMsgProvider: defaultGrammarResolverErrorProvider }, options);
  const topRulesTable = {};
  options.rules.forEach((rule) => {
    topRulesTable[rule.name] = rule;
  });
  return resolveGrammar(topRulesTable, actualOptions.errMsgProvider);
}
__name(resolveGrammar2, "resolveGrammar");
function validateGrammar2(options) {
  var _a;
  const errMsgProvider = (_a = options.errMsgProvider) !== null && _a !== void 0 ? _a : defaultGrammarValidatorErrorProvider;
  return validateGrammar(options.rules, options.tokenTypes, errMsgProvider, options.grammarName);
}
__name(validateGrammar2, "validateGrammar");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/exceptions_public.js
var MISMATCHED_TOKEN_EXCEPTION = "MismatchedTokenException";
var NO_VIABLE_ALT_EXCEPTION = "NoViableAltException";
var EARLY_EXIT_EXCEPTION = "EarlyExitException";
var NOT_ALL_INPUT_PARSED_EXCEPTION = "NotAllInputParsedException";
var RECOGNITION_EXCEPTION_NAMES = [
  MISMATCHED_TOKEN_EXCEPTION,
  NO_VIABLE_ALT_EXCEPTION,
  EARLY_EXIT_EXCEPTION,
  NOT_ALL_INPUT_PARSED_EXCEPTION
];
Object.freeze(RECOGNITION_EXCEPTION_NAMES);
function isRecognitionException(error) {
  return RECOGNITION_EXCEPTION_NAMES.includes(error.name);
}
__name(isRecognitionException, "isRecognitionException");
var RecognitionException = class extends Error {
  static {
    __name(this, "RecognitionException");
  }
  constructor(message, token) {
    super(message);
    this.token = token;
    this.resyncedTokens = [];
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var MismatchedTokenException = class extends RecognitionException {
  static {
    __name(this, "MismatchedTokenException");
  }
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = MISMATCHED_TOKEN_EXCEPTION;
  }
};
var NoViableAltException = class extends RecognitionException {
  static {
    __name(this, "NoViableAltException");
  }
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = NO_VIABLE_ALT_EXCEPTION;
  }
};
var NotAllInputParsedException = class extends RecognitionException {
  static {
    __name(this, "NotAllInputParsedException");
  }
  constructor(message, token) {
    super(message, token);
    this.name = NOT_ALL_INPUT_PARSED_EXCEPTION;
  }
};
var EarlyExitException = class extends RecognitionException {
  static {
    __name(this, "EarlyExitException");
  }
  constructor(message, token, previousToken) {
    super(message, token);
    this.previousToken = previousToken;
    this.name = EARLY_EXIT_EXCEPTION;
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js
var EOF_FOLLOW_KEY = {};
var IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
var InRuleRecoveryException = class extends Error {
  static {
    __name(this, "InRuleRecoveryException");
  }
  constructor(message) {
    super(message);
    this.name = IN_RULE_RECOVERY_EXCEPTION;
  }
};
var Recoverable = class {
  static {
    __name(this, "Recoverable");
  }
  initRecoverable(config) {
    this.firstAfterRepMap = [];
    this.resyncFollows = {};
    this.recoveryEnabled = Object.hasOwn(config, "recoveryEnabled") ? config.recoveryEnabled : DEFAULT_PARSER_CONFIG.recoveryEnabled;
    if (this.recoveryEnabled) {
      this.attemptInRepetitionRecovery = attemptInRepetitionRecovery;
    }
  }
  getTokenToInsert(tokType) {
    const tokToInsert = createTokenInstance(tokType, "", -1, -1, -1, -1, -1, -1);
    tokToInsert.isInsertedInRecovery = true;
    return tokToInsert;
  }
  canTokenTypeBeInsertedInRecovery(tokType) {
    return true;
  }
  canTokenTypeBeDeletedInRecovery(tokType) {
    return true;
  }
  tryInRepetitionRecovery(grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
    const reSyncTokType = this.findReSyncTokenType();
    const savedLexerState = this.exportLexerState();
    const resyncedTokens = [];
    let passedResyncPoint = false;
    const nextTokenWithoutResync = this.LA_FAST(1);
    let currToken = this.LA_FAST(1);
    const generateErrorMessage = /* @__PURE__ */ __name(() => {
      const previousToken = this.LA(0);
      const msg = this.errorMessageProvider.buildMismatchTokenMessage({
        expected: expectedTokType,
        actual: nextTokenWithoutResync,
        previous: previousToken,
        ruleName: this.getCurrRuleFullName()
      });
      const error = new MismatchedTokenException(msg, nextTokenWithoutResync, this.LA(0));
      error.resyncedTokens = resyncedTokens.slice(0, -1);
      this.SAVE_ERROR(error);
    }, "generateErrorMessage");
    while (!passedResyncPoint) {
      if (this.tokenMatcher(currToken, expectedTokType)) {
        generateErrorMessage();
        return;
      } else if (lookAheadFunc.call(this)) {
        generateErrorMessage();
        grammarRule.apply(this, grammarRuleArgs);
        return;
      } else if (this.tokenMatcher(currToken, reSyncTokType)) {
        passedResyncPoint = true;
      } else {
        currToken = this.SKIP_TOKEN();
        this.addToResyncTokens(currToken, resyncedTokens);
      }
    }
    this.importLexerState(savedLexerState);
  }
  shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck) {
    if (notStuck === false) {
      return false;
    }
    if (this.tokenMatcher(this.LA_FAST(1), expectTokAfterLastMatch)) {
      return false;
    }
    if (this.isBackTracking()) {
      return false;
    }
    if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) {
      return false;
    }
    return true;
  }
  // TODO: should this be a member method or a utility? it does not have any state or usage of 'this'...
  // TODO: should this be more explicitly part of the public API?
  getNextPossibleTokenTypes(grammarPath) {
    const topRuleName = grammarPath.ruleStack[0];
    const gastProductions = this.getGAstProductions();
    const topProduction = gastProductions[topRuleName];
    const nextPossibleTokenTypes = new NextAfterTokenWalker(topProduction, grammarPath).startWalking();
    return nextPossibleTokenTypes;
  }
  // Error Recovery functionality
  getFollowsForInRuleRecovery(tokType, tokIdxInRule) {
    const grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
    const follows = this.getNextPossibleTokenTypes(grammarPath);
    return follows;
  }
  tryInRuleRecovery(expectedTokType, follows) {
    if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) {
      const tokToInsert = this.getTokenToInsert(expectedTokType);
      return tokToInsert;
    }
    if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
      const nextTok = this.SKIP_TOKEN();
      this.consumeToken();
      return nextTok;
    }
    throw new InRuleRecoveryException("sad sad panda");
  }
  canPerformInRuleRecovery(expectedToken, follows) {
    return this.canRecoverWithSingleTokenInsertion(expectedToken, follows) || this.canRecoverWithSingleTokenDeletion(expectedToken);
  }
  canRecoverWithSingleTokenInsertion(expectedTokType, follows) {
    if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) {
      return false;
    }
    if (follows.length === 0) {
      return false;
    }
    const mismatchedTok = this.LA_FAST(1);
    const isMisMatchedTokInFollows = follows.find((possibleFollowsTokType) => {
      return this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
    }) !== void 0;
    return isMisMatchedTokInFollows;
  }
  canRecoverWithSingleTokenDeletion(expectedTokType) {
    if (!this.canTokenTypeBeDeletedInRecovery(expectedTokType)) {
      return false;
    }
    const isNextTokenWhatIsExpected = this.tokenMatcher(
      // not using LA_FAST because LA(2) might be un-safe with maxLookahead=1
      // in some edge cases (?)
      this.LA(2),
      expectedTokType
    );
    return isNextTokenWhatIsExpected;
  }
  isInCurrentRuleReSyncSet(tokenTypeIdx) {
    const followKey = this.getCurrFollowKey();
    const currentRuleReSyncSet = this.getFollowSetFromFollowKey(followKey);
    return currentRuleReSyncSet.includes(tokenTypeIdx);
  }
  findReSyncTokenType() {
    const allPossibleReSyncTokTypes = this.flattenFollowSet();
    let nextToken = this.LA_FAST(1);
    let k = 2;
    while (true) {
      const foundMatch = allPossibleReSyncTokTypes.find((resyncTokType) => {
        const canMatch = tokenMatcher(nextToken, resyncTokType);
        return canMatch;
      });
      if (foundMatch !== void 0) {
        return foundMatch;
      }
      nextToken = this.LA(k);
      k++;
    }
  }
  getCurrFollowKey() {
    if (this.RULE_STACK_IDX === 0) {
      return EOF_FOLLOW_KEY;
    }
    const currRuleShortName = this.currRuleShortName;
    const currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
    const prevRuleShortName = this.getPreviousExplicitRuleShortName();
    return {
      ruleName: this.shortRuleNameToFullName(currRuleShortName),
      idxInCallingRule: currRuleIdx,
      inRule: this.shortRuleNameToFullName(prevRuleShortName)
    };
  }
  buildFullFollowKeyStack() {
    const explicitRuleStack = this.RULE_STACK;
    const explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
    const len = this.RULE_STACK_IDX + 1;
    const result = new Array(len);
    for (let idx = 0; idx < len; idx++) {
      if (idx === 0) {
        result[idx] = EOF_FOLLOW_KEY;
      } else {
        result[idx] = {
          ruleName: this.shortRuleNameToFullName(explicitRuleStack[idx]),
          idxInCallingRule: explicitOccurrenceStack[idx],
          inRule: this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
        };
      }
    }
    return result;
  }
  flattenFollowSet() {
    const followStack = this.buildFullFollowKeyStack().map((currKey) => {
      return this.getFollowSetFromFollowKey(currKey);
    });
    return followStack.flat();
  }
  getFollowSetFromFollowKey(followKey) {
    if (followKey === EOF_FOLLOW_KEY) {
      return [EOF];
    }
    const followName = followKey.ruleName + followKey.idxInCallingRule + IN + followKey.inRule;
    return this.resyncFollows[followName];
  }
  // It does not make any sense to include a virtual EOF token in the list of resynced tokens
  // as EOF does not really exist and thus does not contain any useful information (line/column numbers)
  addToResyncTokens(token, resyncTokens) {
    if (!this.tokenMatcher(token, EOF)) {
      resyncTokens.push(token);
    }
    return resyncTokens;
  }
  reSyncTo(tokType) {
    const resyncedTokens = [];
    let nextTok = this.LA_FAST(1);
    while (this.tokenMatcher(nextTok, tokType) === false) {
      nextTok = this.SKIP_TOKEN();
      this.addToResyncTokens(nextTok, resyncedTokens);
    }
    return resyncedTokens.slice(0, -1);
  }
  attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
  }
  getCurrentGrammarPath(tokType, tokIdxInRule) {
    const pathRuleStack = this.getHumanReadableRuleStack();
    const pathOccurrenceStack = this.RULE_OCCURRENCE_STACK.slice(0, this.RULE_OCCURRENCE_STACK_IDX + 1);
    const grammarPath = {
      ruleStack: pathRuleStack,
      occurrenceStack: pathOccurrenceStack,
      lastTok: tokType,
      lastTokOccurrence: tokIdxInRule
    };
    return grammarPath;
  }
  getHumanReadableRuleStack() {
    const len = this.RULE_STACK_IDX + 1;
    const result = new Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = this.shortRuleNameToFullName(this.RULE_STACK[i]);
    }
    return result;
  }
};
function attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
  var _a;
  var _b, _c;
  const key = dslMethodIdx | prodOccurrence;
  const ruleCache = (_a = (_b = this.firstAfterRepMap)[_c = this.currRuleShortName]) !== null && _a !== void 0 ? _a : _b[_c] = [];
  let firstAfterRepInfo = ruleCache[key];
  if (firstAfterRepInfo === void 0) {
    const currRuleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[currRuleName];
    const walker = new nextToksWalker(ruleGrammar, prodOccurrence);
    firstAfterRepInfo = walker.startWalking();
    ruleCache[key] = firstAfterRepInfo;
  }
  let expectTokAfterLastMatch = firstAfterRepInfo.token;
  let nextTokIdx = firstAfterRepInfo.occurrence;
  const isEndOfRule = firstAfterRepInfo.isEndOfRule;
  if (this.RULE_STACK_IDX === 0 && isEndOfRule && expectTokAfterLastMatch === void 0) {
    expectTokAfterLastMatch = EOF;
    nextTokIdx = 1;
  }
  if (expectTokAfterLastMatch === void 0 || nextTokIdx === void 0) {
    return;
  }
  if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck)) {
    this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
  }
}
__name(attemptInRepetitionRecovery, "attemptInRepetitionRecovery");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/keys.js
var BITS_FOR_OCCURRENCE_IDX = 8;
var OR_IDX = 1 << BITS_FOR_OCCURRENCE_IDX;
var OPTION_IDX = 2 << BITS_FOR_OCCURRENCE_IDX;
var MANY_IDX = 3 << BITS_FOR_OCCURRENCE_IDX;
var AT_LEAST_ONE_IDX = 4 << BITS_FOR_OCCURRENCE_IDX;
var MANY_SEP_IDX = 5 << BITS_FOR_OCCURRENCE_IDX;
var AT_LEAST_ONE_SEP_IDX = 6 << BITS_FOR_OCCURRENCE_IDX;

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js
var LLkLookaheadStrategy = class {
  static {
    __name(this, "LLkLookaheadStrategy");
  }
  constructor(options) {
    var _a;
    this.maxLookahead = (_a = options === null || options === void 0 ? void 0 : options.maxLookahead) !== null && _a !== void 0 ? _a : DEFAULT_PARSER_CONFIG.maxLookahead;
  }
  validate(options) {
    const leftRecursionErrors = this.validateNoLeftRecursion(options.rules);
    if (leftRecursionErrors.length === 0) {
      const emptyAltErrors = this.validateEmptyOrAlternatives(options.rules);
      const ambiguousAltsErrors = this.validateAmbiguousAlternationAlternatives(options.rules, this.maxLookahead);
      const emptyRepetitionErrors = this.validateSomeNonEmptyLookaheadPath(options.rules, this.maxLookahead);
      const allErrors = [
        ...leftRecursionErrors,
        ...emptyAltErrors,
        ...ambiguousAltsErrors,
        ...emptyRepetitionErrors
      ];
      return allErrors;
    }
    return leftRecursionErrors;
  }
  validateNoLeftRecursion(rules) {
    return rules.flatMap((currTopRule) => validateNoLeftRecursion(currTopRule, currTopRule, defaultGrammarValidatorErrorProvider));
  }
  validateEmptyOrAlternatives(rules) {
    return rules.flatMap((currTopRule) => validateEmptyOrAlternative(currTopRule, defaultGrammarValidatorErrorProvider));
  }
  validateAmbiguousAlternationAlternatives(rules, maxLookahead) {
    return rules.flatMap((currTopRule) => validateAmbiguousAlternationAlternatives(currTopRule, maxLookahead, defaultGrammarValidatorErrorProvider));
  }
  validateSomeNonEmptyLookaheadPath(rules, maxLookahead) {
    return validateSomeNonEmptyLookaheadPath(rules, maxLookahead, defaultGrammarValidatorErrorProvider);
  }
  buildLookaheadForAlternation(options) {
    return buildLookaheadFuncForOr(options.prodOccurrence, options.rule, options.maxLookahead, options.hasPredicates, options.dynamicTokensEnabled, buildAlternativesLookAheadFunc);
  }
  buildLookaheadForOptional(options) {
    return buildLookaheadFuncForOptionalProd(options.prodOccurrence, options.rule, options.maxLookahead, options.dynamicTokensEnabled, getProdType(options.prodType), buildSingleAlternativeLookaheadFunction);
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js
var LooksAhead = class {
  static {
    __name(this, "LooksAhead");
  }
  initLooksAhead(config) {
    this.dynamicTokensEnabled = Object.hasOwn(config, "dynamicTokensEnabled") ? config.dynamicTokensEnabled : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
    this.maxLookahead = Object.hasOwn(config, "maxLookahead") ? config.maxLookahead : DEFAULT_PARSER_CONFIG.maxLookahead;
    this.lookaheadStrategy = Object.hasOwn(config, "lookaheadStrategy") ? config.lookaheadStrategy : new LLkLookaheadStrategy({ maxLookahead: this.maxLookahead });
    this.lookAheadFuncsCache = [];
    this.currRuleLookaheadFuncs = [];
  }
  preComputeLookaheadFunctions(rules) {
    rules.forEach((currRule) => {
      this.TRACE_INIT(`${currRule.name} Rule Lookahead`, () => {
        const { alternation, repetition, option, repetitionMandatory, repetitionMandatoryWithSeparator, repetitionWithSeparator } = collectMethods(currRule);
        alternation.forEach((currProd) => {
          const prodIdx = currProd.idx === 0 ? "" : currProd.idx;
          this.TRACE_INIT(`${getProductionDslName(currProd)}${prodIdx}`, () => {
            const laFunc = this.lookaheadStrategy.buildLookaheadForAlternation({
              prodOccurrence: currProd.idx,
              rule: currRule,
              maxLookahead: currProd.maxLookahead || this.maxLookahead,
              hasPredicates: currProd.hasPredicates,
              dynamicTokensEnabled: this.dynamicTokensEnabled
            });
            this.setLaFuncCache(this.fullRuleNameToShort[currRule.name], OR_IDX | currProd.idx, laFunc);
          });
        });
        repetition.forEach((currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, MANY_IDX, "Repetition", currProd.maxLookahead, getProductionDslName(currProd));
        });
        option.forEach((currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, OPTION_IDX, "Option", currProd.maxLookahead, getProductionDslName(currProd));
        });
        repetitionMandatory.forEach((currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_IDX, "RepetitionMandatory", currProd.maxLookahead, getProductionDslName(currProd));
        });
        repetitionMandatoryWithSeparator.forEach((currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_SEP_IDX, "RepetitionMandatoryWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
        });
        repetitionWithSeparator.forEach((currProd) => {
          this.computeLookaheadFunc(currRule, currProd.idx, MANY_SEP_IDX, "RepetitionWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
        });
      });
    });
  }
  computeLookaheadFunc(rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
    this.TRACE_INIT(`${dslMethodName}${prodOccurrence === 0 ? "" : prodOccurrence}`, () => {
      const laFunc = this.lookaheadStrategy.buildLookaheadForOptional({
        prodOccurrence,
        rule,
        maxLookahead: prodMaxLookahead || this.maxLookahead,
        dynamicTokensEnabled: this.dynamicTokensEnabled,
        prodType
      });
      this.setLaFuncCache(this.fullRuleNameToShort[rule.name], prodKey | prodOccurrence, laFunc);
    });
  }
  setLaFuncCache(ruleIdx, key, value) {
    let ruleLookaheadFuncs = this.lookAheadFuncsCache[ruleIdx];
    if (ruleLookaheadFuncs === void 0) {
      ruleLookaheadFuncs = [];
      this.lookAheadFuncsCache[ruleIdx] = ruleLookaheadFuncs;
    }
    ruleLookaheadFuncs[key] = value;
  }
};
var DslMethodsCollectorVisitor = class extends GAstVisitor {
  static {
    __name(this, "DslMethodsCollectorVisitor");
  }
  constructor() {
    super(...arguments);
    this.dslMethods = {
      option: [],
      alternation: [],
      repetition: [],
      repetitionWithSeparator: [],
      repetitionMandatory: [],
      repetitionMandatoryWithSeparator: []
    };
  }
  reset() {
    this.dslMethods = {
      option: [],
      alternation: [],
      repetition: [],
      repetitionWithSeparator: [],
      repetitionMandatory: [],
      repetitionMandatoryWithSeparator: []
    };
  }
  visitOption(option) {
    this.dslMethods.option.push(option);
  }
  visitRepetitionWithSeparator(manySep) {
    this.dslMethods.repetitionWithSeparator.push(manySep);
  }
  visitRepetitionMandatory(atLeastOne) {
    this.dslMethods.repetitionMandatory.push(atLeastOne);
  }
  visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
    this.dslMethods.repetitionMandatoryWithSeparator.push(atLeastOneSep);
  }
  visitRepetition(many) {
    this.dslMethods.repetition.push(many);
  }
  visitAlternation(or) {
    this.dslMethods.alternation.push(or);
  }
};
var collectorVisitor = new DslMethodsCollectorVisitor();
function collectMethods(rule) {
  collectorVisitor.reset();
  rule.accept(collectorVisitor);
  const dslMethods = collectorVisitor.dslMethods;
  collectorVisitor.reset();
  return dslMethods;
}
__name(collectMethods, "collectMethods");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/cst/cst.js
function setNodeLocationOnlyOffset(currNodeLocation, newLocationInfo) {
  if (currNodeLocation.startOffset === -1) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
  }
}
__name(setNodeLocationOnlyOffset, "setNodeLocationOnlyOffset");
function setNodeLocationFull(currNodeLocation, newLocationInfo) {
  if (currNodeLocation.startOffset === -1) {
    currNodeLocation.startOffset = newLocationInfo.startOffset;
    currNodeLocation.startColumn = newLocationInfo.startColumn;
    currNodeLocation.startLine = newLocationInfo.startLine;
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
    currNodeLocation.endOffset = newLocationInfo.endOffset;
    currNodeLocation.endColumn = newLocationInfo.endColumn;
    currNodeLocation.endLine = newLocationInfo.endLine;
  }
}
__name(setNodeLocationFull, "setNodeLocationFull");
function addTerminalToCst(node, token, tokenTypeName) {
  if (node.children[tokenTypeName] === void 0) {
    node.children[tokenTypeName] = [token];
  } else {
    node.children[tokenTypeName].push(token);
  }
}
__name(addTerminalToCst, "addTerminalToCst");
function addNoneTerminalToCst(node, ruleName, ruleResult) {
  if (node.children[ruleName] === void 0) {
    node.children[ruleName] = [ruleResult];
  } else {
    node.children[ruleName].push(ruleResult);
  }
}
__name(addNoneTerminalToCst, "addNoneTerminalToCst");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/lang/lang_extensions.js
var NAME = "name";
function defineNameProp(obj, nameValue) {
  Object.defineProperty(obj, NAME, {
    enumerable: false,
    configurable: true,
    writable: false,
    value: nameValue
  });
}
__name(defineNameProp, "defineNameProp");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js
function defaultVisit(ctx, param) {
  const childrenNames = Object.keys(ctx);
  const childrenNamesLength = childrenNames.length;
  for (let i = 0; i < childrenNamesLength; i++) {
    const currChildName = childrenNames[i];
    const currChildArray = ctx[currChildName];
    const currChildArrayLength = currChildArray.length;
    for (let j = 0; j < currChildArrayLength; j++) {
      const currChild = currChildArray[j];
      if (currChild.tokenTypeIdx === void 0) {
        this[currChild.name](currChild.children, param);
      }
    }
  }
}
__name(defaultVisit, "defaultVisit");
function createBaseSemanticVisitorConstructor(grammarName, ruleNames) {
  const derivedConstructor = /* @__PURE__ */ __name(function() {
  }, "derivedConstructor");
  defineNameProp(derivedConstructor, grammarName + "BaseSemantics");
  const semanticProto = {
    visit: /* @__PURE__ */ __name(function(cstNode, param) {
      if (Array.isArray(cstNode)) {
        cstNode = cstNode[0];
      }
      if (cstNode === void 0) {
        return void 0;
      }
      return this[cstNode.name](cstNode.children, param);
    }, "visit"),
    validateVisitor: /* @__PURE__ */ __name(function() {
      const semanticDefinitionErrors = validateVisitor(this, ruleNames);
      if (semanticDefinitionErrors.length !== 0) {
        const errorMessages = semanticDefinitionErrors.map((currDefError) => currDefError.msg);
        throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${errorMessages.join("\n\n").replace(/\n/g, "\n	")}`);
      }
    }, "validateVisitor")
  };
  derivedConstructor.prototype = semanticProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  derivedConstructor._RULE_NAMES = ruleNames;
  return derivedConstructor;
}
__name(createBaseSemanticVisitorConstructor, "createBaseSemanticVisitorConstructor");
function createBaseVisitorConstructorWithDefaults(grammarName, ruleNames, baseConstructor) {
  const derivedConstructor = /* @__PURE__ */ __name(function() {
  }, "derivedConstructor");
  defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults");
  const withDefaultsProto = Object.create(baseConstructor.prototype);
  ruleNames.forEach((ruleName) => {
    withDefaultsProto[ruleName] = defaultVisit;
  });
  derivedConstructor.prototype = withDefaultsProto;
  derivedConstructor.prototype.constructor = derivedConstructor;
  return derivedConstructor;
}
__name(createBaseVisitorConstructorWithDefaults, "createBaseVisitorConstructorWithDefaults");
var CstVisitorDefinitionError;
(function(CstVisitorDefinitionError2) {
  CstVisitorDefinitionError2[CstVisitorDefinitionError2["REDUNDANT_METHOD"] = 0] = "REDUNDANT_METHOD";
  CstVisitorDefinitionError2[CstVisitorDefinitionError2["MISSING_METHOD"] = 1] = "MISSING_METHOD";
})(CstVisitorDefinitionError || (CstVisitorDefinitionError = {}));
function validateVisitor(visitorInstance, ruleNames) {
  const missingErrors = validateMissingCstMethods(visitorInstance, ruleNames);
  return missingErrors;
}
__name(validateVisitor, "validateVisitor");
function validateMissingCstMethods(visitorInstance, ruleNames) {
  const missingRuleNames = ruleNames.filter((currRuleName) => {
    return typeof visitorInstance[currRuleName] === "function" === false;
  });
  const errors = missingRuleNames.map((currRuleName) => {
    return {
      msg: `Missing visitor method: <${currRuleName}> on ${visitorInstance.constructor.name} CST Visitor.`,
      type: CstVisitorDefinitionError.MISSING_METHOD,
      methodName: currRuleName
    };
  });
  return errors.filter(Boolean);
}
__name(validateMissingCstMethods, "validateMissingCstMethods");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js
var TreeBuilder = class {
  static {
    __name(this, "TreeBuilder");
  }
  initTreeBuilder(config) {
    this.CST_STACK = [];
    this.outputCst = config.outputCst;
    this.nodeLocationTracking = Object.hasOwn(config, "nodeLocationTracking") ? config.nodeLocationTracking : DEFAULT_PARSER_CONFIG.nodeLocationTracking;
    if (!this.outputCst) {
      this.cstInvocationStateUpdate = () => {
      };
      this.cstFinallyStateUpdate = () => {
      };
      this.cstPostTerminal = () => {
      };
      this.cstPostNonTerminal = () => {
      };
      this.cstPostRule = () => {
      };
    } else {
      if (/full/i.test(this.nodeLocationTracking)) {
        if (this.recoveryEnabled) {
          this.setNodeLocationFromToken = setNodeLocationFull;
          this.setNodeLocationFromNode = setNodeLocationFull;
          this.cstPostRule = () => {
          };
          this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery;
        } else {
          this.setNodeLocationFromToken = () => {
          };
          this.setNodeLocationFromNode = () => {
          };
          this.cstPostRule = this.cstPostRuleFull;
          this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular;
        }
      } else if (/onlyOffset/i.test(this.nodeLocationTracking)) {
        if (this.recoveryEnabled) {
          this.setNodeLocationFromToken = setNodeLocationOnlyOffset;
          this.setNodeLocationFromNode = setNodeLocationOnlyOffset;
          this.cstPostRule = () => {
          };
          this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery;
        } else {
          this.setNodeLocationFromToken = () => {
          };
          this.setNodeLocationFromNode = () => {
          };
          this.cstPostRule = this.cstPostRuleOnlyOffset;
          this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular;
        }
      } else if (/none/i.test(this.nodeLocationTracking)) {
        this.setNodeLocationFromToken = () => {
        };
        this.setNodeLocationFromNode = () => {
        };
        this.cstPostRule = () => {
        };
        this.setInitialNodeLocation = () => {
        };
      } else {
        throw Error(`Invalid <nodeLocationTracking> config option: "${config.nodeLocationTracking}"`);
      }
    }
  }
  setInitialNodeLocationOnlyOffsetRecovery(cstNode) {
    cstNode.location = {
      startOffset: -1,
      endOffset: -1
    };
  }
  setInitialNodeLocationOnlyOffsetRegular(cstNode) {
    cstNode.location = {
      // without error recovery the starting Location of a new CstNode is guaranteed
      // To be the next Token's startOffset (for valid inputs).
      // For invalid inputs there won't be any CSTOutput so this potential
      // inaccuracy does not matter
      startOffset: this.LA_FAST(1).startOffset,
      endOffset: -1
    };
  }
  setInitialNodeLocationFullRecovery(cstNode) {
    cstNode.location = {
      startOffset: -1,
      startLine: -1,
      startColumn: -1,
      endOffset: -1,
      endLine: -1,
      endColumn: -1
    };
  }
  /**
       *  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
  
       * @param cstNode
       */
  setInitialNodeLocationFullRegular(cstNode) {
    const nextToken = this.LA_FAST(1);
    cstNode.location = {
      startOffset: nextToken.startOffset,
      startLine: nextToken.startLine,
      startColumn: nextToken.startColumn,
      endOffset: -1,
      endLine: -1,
      endColumn: -1
    };
  }
  cstInvocationStateUpdate(fullRuleName) {
    const cstNode = {
      name: fullRuleName,
      children: /* @__PURE__ */ Object.create(null)
    };
    this.setInitialNodeLocation(cstNode);
    this.CST_STACK.push(cstNode);
  }
  cstFinallyStateUpdate() {
    this.CST_STACK.pop();
  }
  cstPostRuleFull(ruleCstNode) {
    const prevToken = this.LA(0);
    const loc = ruleCstNode.location;
    if (loc.startOffset !== -1 && loc.startOffset <= prevToken.startOffset === true) {
      loc.endOffset = prevToken.endOffset;
      loc.endLine = prevToken.endLine;
      loc.endColumn = prevToken.endColumn;
    } else {
      loc.startOffset = -1;
      loc.startLine = -1;
      loc.startColumn = -1;
    }
  }
  cstPostRuleOnlyOffset(ruleCstNode) {
    const prevToken = this.LA(0);
    const loc = ruleCstNode.location;
    if (loc.startOffset !== -1 && loc.startOffset <= prevToken.startOffset === true) {
      loc.endOffset = prevToken.endOffset;
    } else {
      loc.startOffset = -1;
    }
  }
  cstPostTerminal(key, consumedToken) {
    const rootCst = this.CST_STACK[this.CST_STACK.length - 1];
    addTerminalToCst(rootCst, consumedToken, key);
    this.setNodeLocationFromToken(rootCst.location, consumedToken);
  }
  cstPostNonTerminal(ruleCstResult, ruleName) {
    const preCstNode = this.CST_STACK[this.CST_STACK.length - 1];
    addNoneTerminalToCst(preCstNode, ruleName, ruleCstResult);
    this.setNodeLocationFromNode(preCstNode.location, ruleCstResult.location);
  }
  get currCSTNode() {
    const mixedIn = this;
    return mixedIn.CST_STACK[mixedIn.CST_STACK.length - 1];
  }
  getBaseCstVisitorConstructor() {
    if (this.baseCstVisitorConstructor === void 0) {
      const newBaseCstVisitorConstructor = createBaseSemanticVisitorConstructor(this.className, Object.keys(this.gastProductionsCache));
      this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
      return newBaseCstVisitorConstructor;
    }
    return this.baseCstVisitorConstructor;
  }
  getBaseCstVisitorConstructorWithDefaults() {
    if (this.baseCstVisitorWithDefaultsConstructor === void 0) {
      const newConstructor = createBaseVisitorConstructorWithDefaults(this.className, Object.keys(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
      this.baseCstVisitorWithDefaultsConstructor = newConstructor;
      return newConstructor;
    }
    return this.baseCstVisitorWithDefaultsConstructor;
  }
  getPreviousExplicitRuleShortName() {
    return this.RULE_STACK[this.RULE_STACK_IDX - 1];
  }
  getLastExplicitRuleOccurrenceIndex() {
    return this.RULE_OCCURRENCE_STACK[this.RULE_OCCURRENCE_STACK_IDX];
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js
var LexerAdapter = class {
  static {
    __name(this, "LexerAdapter");
  }
  initLexerAdapter() {
    this.tokVector = [];
    this.tokVectorLength = 0;
    this.currIdx = -1;
  }
  set input(newInput) {
    if (this.selfAnalysisDone !== true) {
      throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`);
    }
    this.reset();
    this.tokVector = newInput;
    this.tokVectorLength = newInput.length;
  }
  get input() {
    return this.tokVector;
  }
  // skips a token and returns the next token
  SKIP_TOKEN() {
    if (this.currIdx <= this.tokVectorLength - 2) {
      this.consumeToken();
      return this.LA_FAST(1);
    } else {
      return END_OF_FILE;
    }
  }
  // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
  // or lexers dependent on parser context.
  // Performance Optimized version of LA without bound checks
  // note that token beyond the end of the token vector EOF Token will still be returned
  // due to using sentinels at the end of the token vector. (for K=max lookahead)
  LA_FAST(howMuch) {
    const soughtIdx = this.currIdx + howMuch;
    return this.tokVector[soughtIdx];
  }
  LA(howMuch) {
    const soughtIdx = this.currIdx + howMuch;
    if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) {
      return END_OF_FILE;
    } else {
      return this.tokVector[soughtIdx];
    }
  }
  consumeToken() {
    this.currIdx++;
  }
  exportLexerState() {
    return this.currIdx;
  }
  importLexerState(newState) {
    this.currIdx = newState;
  }
  resetLexerState() {
    this.currIdx = -1;
  }
  moveToTerminatedState() {
    this.currIdx = this.tokVectorLength - 1;
  }
  getLexerPosition() {
    return this.exportLexerState();
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js
var RecognizerApi = class {
  static {
    __name(this, "RecognizerApi");
  }
  ACTION(impl) {
    return impl.call(this);
  }
  consume(idx, tokType, options) {
    return this.consumeInternal(tokType, idx, options);
  }
  subrule(idx, ruleToCall, options) {
    return this.subruleInternal(ruleToCall, idx, options);
  }
  option(idx, actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, idx);
  }
  or(idx, altsOrOpts) {
    return this.orInternal(altsOrOpts, idx);
  }
  many(idx, actionORMethodDef) {
    return this.manyInternal(idx, actionORMethodDef);
  }
  atLeastOne(idx, actionORMethodDef) {
    return this.atLeastOneInternal(idx, actionORMethodDef);
  }
  CONSUME(tokType, options) {
    return this.consumeInternal(tokType, 0, options);
  }
  CONSUME1(tokType, options) {
    return this.consumeInternal(tokType, 1, options);
  }
  CONSUME2(tokType, options) {
    return this.consumeInternal(tokType, 2, options);
  }
  CONSUME3(tokType, options) {
    return this.consumeInternal(tokType, 3, options);
  }
  CONSUME4(tokType, options) {
    return this.consumeInternal(tokType, 4, options);
  }
  CONSUME5(tokType, options) {
    return this.consumeInternal(tokType, 5, options);
  }
  CONSUME6(tokType, options) {
    return this.consumeInternal(tokType, 6, options);
  }
  CONSUME7(tokType, options) {
    return this.consumeInternal(tokType, 7, options);
  }
  CONSUME8(tokType, options) {
    return this.consumeInternal(tokType, 8, options);
  }
  CONSUME9(tokType, options) {
    return this.consumeInternal(tokType, 9, options);
  }
  SUBRULE(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 0, options);
  }
  SUBRULE1(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 1, options);
  }
  SUBRULE2(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 2, options);
  }
  SUBRULE3(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 3, options);
  }
  SUBRULE4(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 4, options);
  }
  SUBRULE5(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 5, options);
  }
  SUBRULE6(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 6, options);
  }
  SUBRULE7(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 7, options);
  }
  SUBRULE8(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 8, options);
  }
  SUBRULE9(ruleToCall, options) {
    return this.subruleInternal(ruleToCall, 9, options);
  }
  OPTION(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 0);
  }
  OPTION1(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 1);
  }
  OPTION2(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 2);
  }
  OPTION3(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 3);
  }
  OPTION4(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 4);
  }
  OPTION5(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 5);
  }
  OPTION6(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 6);
  }
  OPTION7(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 7);
  }
  OPTION8(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 8);
  }
  OPTION9(actionORMethodDef) {
    return this.optionInternal(actionORMethodDef, 9);
  }
  OR(altsOrOpts) {
    return this.orInternal(altsOrOpts, 0);
  }
  OR1(altsOrOpts) {
    return this.orInternal(altsOrOpts, 1);
  }
  OR2(altsOrOpts) {
    return this.orInternal(altsOrOpts, 2);
  }
  OR3(altsOrOpts) {
    return this.orInternal(altsOrOpts, 3);
  }
  OR4(altsOrOpts) {
    return this.orInternal(altsOrOpts, 4);
  }
  OR5(altsOrOpts) {
    return this.orInternal(altsOrOpts, 5);
  }
  OR6(altsOrOpts) {
    return this.orInternal(altsOrOpts, 6);
  }
  OR7(altsOrOpts) {
    return this.orInternal(altsOrOpts, 7);
  }
  OR8(altsOrOpts) {
    return this.orInternal(altsOrOpts, 8);
  }
  OR9(altsOrOpts) {
    return this.orInternal(altsOrOpts, 9);
  }
  MANY(actionORMethodDef) {
    this.manyInternal(0, actionORMethodDef);
  }
  MANY1(actionORMethodDef) {
    this.manyInternal(1, actionORMethodDef);
  }
  MANY2(actionORMethodDef) {
    this.manyInternal(2, actionORMethodDef);
  }
  MANY3(actionORMethodDef) {
    this.manyInternal(3, actionORMethodDef);
  }
  MANY4(actionORMethodDef) {
    this.manyInternal(4, actionORMethodDef);
  }
  MANY5(actionORMethodDef) {
    this.manyInternal(5, actionORMethodDef);
  }
  MANY6(actionORMethodDef) {
    this.manyInternal(6, actionORMethodDef);
  }
  MANY7(actionORMethodDef) {
    this.manyInternal(7, actionORMethodDef);
  }
  MANY8(actionORMethodDef) {
    this.manyInternal(8, actionORMethodDef);
  }
  MANY9(actionORMethodDef) {
    this.manyInternal(9, actionORMethodDef);
  }
  MANY_SEP(options) {
    this.manySepFirstInternal(0, options);
  }
  MANY_SEP1(options) {
    this.manySepFirstInternal(1, options);
  }
  MANY_SEP2(options) {
    this.manySepFirstInternal(2, options);
  }
  MANY_SEP3(options) {
    this.manySepFirstInternal(3, options);
  }
  MANY_SEP4(options) {
    this.manySepFirstInternal(4, options);
  }
  MANY_SEP5(options) {
    this.manySepFirstInternal(5, options);
  }
  MANY_SEP6(options) {
    this.manySepFirstInternal(6, options);
  }
  MANY_SEP7(options) {
    this.manySepFirstInternal(7, options);
  }
  MANY_SEP8(options) {
    this.manySepFirstInternal(8, options);
  }
  MANY_SEP9(options) {
    this.manySepFirstInternal(9, options);
  }
  AT_LEAST_ONE(actionORMethodDef) {
    this.atLeastOneInternal(0, actionORMethodDef);
  }
  AT_LEAST_ONE1(actionORMethodDef) {
    return this.atLeastOneInternal(1, actionORMethodDef);
  }
  AT_LEAST_ONE2(actionORMethodDef) {
    this.atLeastOneInternal(2, actionORMethodDef);
  }
  AT_LEAST_ONE3(actionORMethodDef) {
    this.atLeastOneInternal(3, actionORMethodDef);
  }
  AT_LEAST_ONE4(actionORMethodDef) {
    this.atLeastOneInternal(4, actionORMethodDef);
  }
  AT_LEAST_ONE5(actionORMethodDef) {
    this.atLeastOneInternal(5, actionORMethodDef);
  }
  AT_LEAST_ONE6(actionORMethodDef) {
    this.atLeastOneInternal(6, actionORMethodDef);
  }
  AT_LEAST_ONE7(actionORMethodDef) {
    this.atLeastOneInternal(7, actionORMethodDef);
  }
  AT_LEAST_ONE8(actionORMethodDef) {
    this.atLeastOneInternal(8, actionORMethodDef);
  }
  AT_LEAST_ONE9(actionORMethodDef) {
    this.atLeastOneInternal(9, actionORMethodDef);
  }
  AT_LEAST_ONE_SEP(options) {
    this.atLeastOneSepFirstInternal(0, options);
  }
  AT_LEAST_ONE_SEP1(options) {
    this.atLeastOneSepFirstInternal(1, options);
  }
  AT_LEAST_ONE_SEP2(options) {
    this.atLeastOneSepFirstInternal(2, options);
  }
  AT_LEAST_ONE_SEP3(options) {
    this.atLeastOneSepFirstInternal(3, options);
  }
  AT_LEAST_ONE_SEP4(options) {
    this.atLeastOneSepFirstInternal(4, options);
  }
  AT_LEAST_ONE_SEP5(options) {
    this.atLeastOneSepFirstInternal(5, options);
  }
  AT_LEAST_ONE_SEP6(options) {
    this.atLeastOneSepFirstInternal(6, options);
  }
  AT_LEAST_ONE_SEP7(options) {
    this.atLeastOneSepFirstInternal(7, options);
  }
  AT_LEAST_ONE_SEP8(options) {
    this.atLeastOneSepFirstInternal(8, options);
  }
  AT_LEAST_ONE_SEP9(options) {
    this.atLeastOneSepFirstInternal(9, options);
  }
  RULE(name, implementation, config = DEFAULT_RULE_CONFIG) {
    if (this.definedRulesNames.includes(name)) {
      const errMsg = defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
        topLevelRule: name,
        grammarName: this.className
      });
      const error = {
        message: errMsg,
        type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
        ruleName: name
      };
      this.definitionErrors.push(error);
    }
    this.definedRulesNames.push(name);
    const ruleImplementation = this.defineRule(name, implementation, config);
    this[name] = ruleImplementation;
    return ruleImplementation;
  }
  OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
    const ruleErrors = validateRuleIsOverridden(name, this.definedRulesNames, this.className);
    this.definitionErrors = this.definitionErrors.concat(ruleErrors);
    const ruleImplementation = this.defineRule(name, impl, config);
    this[name] = ruleImplementation;
    return ruleImplementation;
  }
  BACKTRACK(grammarRule, args) {
    var _a;
    const ruleToCall = (_a = grammarRule.coreRule) !== null && _a !== void 0 ? _a : grammarRule;
    return function() {
      this.isBackTrackingStack.push(1);
      const orgState = this.saveRecogState();
      try {
        ruleToCall.apply(this, args);
        return true;
      } catch (e) {
        if (isRecognitionException(e)) {
          return false;
        } else {
          throw e;
        }
      } finally {
        this.reloadRecogState(orgState);
        this.isBackTrackingStack.pop();
      }
    };
  }
  // GAST export APIs
  getGAstProductions() {
    return this.gastProductionsCache;
  }
  getSerializedGastProductions() {
    return serializeGrammar(Object.values(this.gastProductionsCache));
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js
var RecognizerEngine = class {
  static {
    __name(this, "RecognizerEngine");
  }
  initRecognizerEngine(tokenVocabulary, config) {
    this.className = this.constructor.name;
    this.shortRuleNameToFull = [];
    this.fullRuleNameToShort = {};
    this.ruleShortNameIdx = 0;
    this.tokenMatcher = tokenStructuredMatcherNoCategories;
    this.subruleIdx = 0;
    this.currRuleShortName = -1;
    this.definedRulesNames = [];
    this.tokensMap = {};
    this.isBackTrackingStack = [];
    this.RULE_STACK = [];
    this.RULE_STACK_IDX = -1;
    this.RULE_OCCURRENCE_STACK = [];
    this.RULE_OCCURRENCE_STACK_IDX = -1;
    this.gastProductionsCache = {};
    if (Object.hasOwn(config, "serializedGrammar")) {
      throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.");
    }
    if (Array.isArray(tokenVocabulary)) {
      if (tokenVocabulary.length === 0) {
        throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).");
      }
      if (typeof tokenVocabulary[0].startOffset === "number") {
        throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.");
      }
    }
    if (Array.isArray(tokenVocabulary)) {
      this.tokensMap = tokenVocabulary.reduce((acc, tokType) => {
        acc[tokType.name] = tokType;
        return acc;
      }, {});
    } else if (Object.hasOwn(tokenVocabulary, "modes") && Object.values(tokenVocabulary.modes).flat().every(isTokenType)) {
      const allTokenTypes2 = Object.values(tokenVocabulary.modes).flat();
      const uniqueTokens = [...new Set(allTokenTypes2)];
      this.tokensMap = uniqueTokens.reduce((acc, tokType) => {
        acc[tokType.name] = tokType;
        return acc;
      }, {});
    } else if (typeof tokenVocabulary === "object" && tokenVocabulary !== null) {
      this.tokensMap = Object.assign({}, tokenVocabulary);
    } else {
      throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
    }
    this.tokensMap["EOF"] = EOF;
    const allTokenTypes = Object.hasOwn(tokenVocabulary, "modes") ? Object.values(tokenVocabulary.modes).flat() : Object.values(tokenVocabulary);
    const noTokenCategoriesUsed = allTokenTypes.every(
      // intentional "==" to also cover "undefined"
      (tokenConstructor) => {
        var _a;
        return ((_a = tokenConstructor.categoryMatches) === null || _a === void 0 ? void 0 : _a.length) == 0;
      }
    );
    this.tokenMatcher = noTokenCategoriesUsed ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
    augmentTokenTypes(Object.values(this.tokensMap));
  }
  defineRule(ruleName, impl, config) {
    if (this.selfAnalysisDone) {
      throw Error(`Grammar rule <${ruleName}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
    }
    const resyncEnabled = Object.hasOwn(config, "resyncEnabled") ? config.resyncEnabled : DEFAULT_RULE_CONFIG.resyncEnabled;
    const recoveryValueFunc = Object.hasOwn(config, "recoveryValueFunc") ? config.recoveryValueFunc : DEFAULT_RULE_CONFIG.recoveryValueFunc;
    const shortName = this.ruleShortNameIdx++;
    this.shortRuleNameToFull[shortName] = ruleName;
    this.fullRuleNameToShort[ruleName] = shortName;
    let coreRuleFunction;
    if (this.outputCst === true) {
      coreRuleFunction = /* @__PURE__ */ __name(function invokeRuleWithTry(...args) {
        try {
          this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
          impl.apply(this, args);
          const cst = this.CST_STACK[this.CST_STACK.length - 1];
          this.cstPostRule(cst);
          return cst;
        } catch (e) {
          return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
        } finally {
          this.ruleFinallyStateUpdate();
        }
      }, "invokeRuleWithTry");
    } else {
      coreRuleFunction = /* @__PURE__ */ __name(function invokeRuleWithTryCst(...args) {
        try {
          this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
          return impl.apply(this, args);
        } catch (e) {
          return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
        } finally {
          this.ruleFinallyStateUpdate();
        }
      }, "invokeRuleWithTryCst");
    }
    const rootRuleFunction = /* @__PURE__ */ __name(function rootRule(...args) {
      this.onBeforeParse(ruleName);
      try {
        return coreRuleFunction.apply(this, args);
      } finally {
        this.onAfterParse(ruleName);
      }
    }, "rootRule");
    const wrappedGrammarRule = Object.assign(rootRuleFunction, { ruleName, originalGrammarAction: impl, coreRule: coreRuleFunction });
    return wrappedGrammarRule;
  }
  invokeRuleCatch(e, resyncEnabledConfig, recoveryValueFunc) {
    const isFirstInvokedRule = this.RULE_STACK_IDX === 0;
    const reSyncEnabled = resyncEnabledConfig && !this.isBackTracking() && this.recoveryEnabled;
    if (isRecognitionException(e)) {
      const recogError = e;
      if (reSyncEnabled) {
        const reSyncTokType = this.findReSyncTokenType();
        if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
          recogError.resyncedTokens = this.reSyncTo(reSyncTokType);
          if (this.outputCst) {
            const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
            partialCstResult.recoveredNode = true;
            return partialCstResult;
          } else {
            return recoveryValueFunc(e);
          }
        } else {
          if (this.outputCst) {
            const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
            partialCstResult.recoveredNode = true;
            recogError.partialCstResult = partialCstResult;
          }
          throw recogError;
        }
      } else if (isFirstInvokedRule) {
        this.moveToTerminatedState();
        return recoveryValueFunc(e);
      } else {
        throw recogError;
      }
    } else {
      throw e;
    }
  }
  // Implementation of parsing DSL
  optionInternal(actionORMethodDef, occurrence) {
    const key = OPTION_IDX | occurrence;
    return this.optionInternalLogic(actionORMethodDef, occurrence, key);
  }
  optionInternalLogic(actionORMethodDef, occurrence, key) {
    let lookAheadFunc = this.currRuleLookaheadFuncs[key];
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookAheadFunc;
        lookAheadFunc = /* @__PURE__ */ __name(() => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        }, "lookAheadFunc");
      }
    } else {
      action = actionORMethodDef;
    }
    if (lookAheadFunc.call(this) === true) {
      return action.call(this);
    }
    return void 0;
  }
  atLeastOneInternal(prodOccurrence, actionORMethodDef) {
    const key = AT_LEAST_ONE_IDX | prodOccurrence;
    return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key);
  }
  atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key) {
    let lookAheadFunc = this.currRuleLookaheadFuncs[key];
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookAheadFunc;
        lookAheadFunc = /* @__PURE__ */ __name(() => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        }, "lookAheadFunc");
      }
    } else {
      action = actionORMethodDef;
    }
    if (lookAheadFunc.call(this) === true) {
      let notStuck = this.doSingleRepetition(action);
      while (lookAheadFunc.call(this) === true && notStuck === true) {
        notStuck = this.doSingleRepetition(action);
      }
    } else {
      throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
    }
    this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef], lookAheadFunc, AT_LEAST_ONE_IDX, prodOccurrence, NextTerminalAfterAtLeastOneWalker);
  }
  atLeastOneSepFirstInternal(prodOccurrence, options) {
    const key = AT_LEAST_ONE_SEP_IDX | prodOccurrence;
    this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, key);
  }
  atLeastOneSepFirstInternalLogic(prodOccurrence, options, key) {
    const action = options.DEF;
    const separator = options.SEP;
    const firstIterationLookaheadFunc = this.currRuleLookaheadFuncs[key];
    if (firstIterationLookaheadFunc.call(this) === true) {
      action.call(this);
      const separatorLookAheadFunc = /* @__PURE__ */ __name(() => {
        return this.tokenMatcher(this.LA_FAST(1), separator);
      }, "separatorLookAheadFunc");
      while (this.tokenMatcher(this.LA_FAST(1), separator) === true) {
        this.CONSUME(separator);
        action.call(this);
      }
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        prodOccurrence,
        separator,
        separatorLookAheadFunc,
        action,
        NextTerminalAfterAtLeastOneSepWalker
      ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, NextTerminalAfterAtLeastOneSepWalker);
    } else {
      throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
    }
  }
  manyInternal(prodOccurrence, actionORMethodDef) {
    const key = MANY_IDX | prodOccurrence;
    return this.manyInternalLogic(prodOccurrence, actionORMethodDef, key);
  }
  manyInternalLogic(prodOccurrence, actionORMethodDef, key) {
    let lookaheadFunction = this.currRuleLookaheadFuncs[key];
    let action;
    if (typeof actionORMethodDef !== "function") {
      action = actionORMethodDef.DEF;
      const predicate = actionORMethodDef.GATE;
      if (predicate !== void 0) {
        const orgLookaheadFunction = lookaheadFunction;
        lookaheadFunction = /* @__PURE__ */ __name(() => {
          return predicate.call(this) && orgLookaheadFunction.call(this);
        }, "lookaheadFunction");
      }
    } else {
      action = actionORMethodDef;
    }
    let notStuck = true;
    while (lookaheadFunction.call(this) === true && notStuck === true) {
      notStuck = this.doSingleRepetition(action);
    }
    this.attemptInRepetitionRecovery(
      this.manyInternal,
      [prodOccurrence, actionORMethodDef],
      lookaheadFunction,
      MANY_IDX,
      prodOccurrence,
      NextTerminalAfterManyWalker,
      // The notStuck parameter is only relevant when "attemptInRepetitionRecovery"
      // is invoked from manyInternal, in the MANY_SEP case and AT_LEAST_ONE[_SEP]
      // An infinite loop cannot occur as:
      // - Either the lookahead is guaranteed to consume something (Single Token Separator)
      // - AT_LEAST_ONE by definition is guaranteed to consume something (or error out).
      notStuck
    );
  }
  manySepFirstInternal(prodOccurrence, options) {
    const key = MANY_SEP_IDX | prodOccurrence;
    this.manySepFirstInternalLogic(prodOccurrence, options, key);
  }
  manySepFirstInternalLogic(prodOccurrence, options, key) {
    const action = options.DEF;
    const separator = options.SEP;
    const firstIterationLaFunc = this.currRuleLookaheadFuncs[key];
    if (firstIterationLaFunc.call(this) === true) {
      action.call(this);
      const separatorLookAheadFunc = /* @__PURE__ */ __name(() => {
        return this.tokenMatcher(this.LA_FAST(1), separator);
      }, "separatorLookAheadFunc");
      while (this.tokenMatcher(this.LA_FAST(1), separator) === true) {
        this.CONSUME(separator);
        action.call(this);
      }
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        prodOccurrence,
        separator,
        separatorLookAheadFunc,
        action,
        NextTerminalAfterManySepWalker
      ], separatorLookAheadFunc, MANY_SEP_IDX, prodOccurrence, NextTerminalAfterManySepWalker);
    }
  }
  repetitionSepSecondInternal(prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker) {
    while (separatorLookAheadFunc()) {
      this.CONSUME(separator);
      action.call(this);
    }
    this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
      prodOccurrence,
      separator,
      separatorLookAheadFunc,
      action,
      nextTerminalAfterWalker
    ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
  }
  doSingleRepetition(action) {
    const beforeIteration = this.getLexerPosition();
    action.call(this);
    const afterIteration = this.getLexerPosition();
    return afterIteration > beforeIteration;
  }
  orInternal(altsOrOpts, occurrence) {
    const key = OR_IDX | occurrence;
    const alts = Array.isArray(altsOrOpts) ? altsOrOpts : altsOrOpts.DEF;
    const laFunc = this.currRuleLookaheadFuncs[key];
    const altIdxToTake = laFunc.call(this, alts);
    if (altIdxToTake !== void 0) {
      const chosenAlternative = alts[altIdxToTake];
      return chosenAlternative.ALT.call(this);
    }
    this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
  }
  ruleFinallyStateUpdate() {
    this.RULE_STACK_IDX--;
    this.RULE_OCCURRENCE_STACK_IDX--;
    if (this.RULE_STACK_IDX >= 0) {
      this.currRuleShortName = this.RULE_STACK[this.RULE_STACK_IDX];
      this.currRuleLookaheadFuncs = this.lookAheadFuncsCache[this.currRuleShortName];
    }
    this.cstFinallyStateUpdate();
  }
  subruleInternal(ruleToCall, idx, options) {
    let ruleResult;
    try {
      const args = options !== void 0 ? options.ARGS : void 0;
      this.subruleIdx = idx;
      ruleResult = ruleToCall.coreRule.apply(this, args);
      this.cstPostNonTerminal(ruleResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleToCall.ruleName);
      return ruleResult;
    } catch (e) {
      throw this.subruleInternalError(e, options, ruleToCall.ruleName);
    }
  }
  subruleInternalError(e, options, ruleName) {
    if (isRecognitionException(e) && e.partialCstResult !== void 0) {
      this.cstPostNonTerminal(e.partialCstResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleName);
      delete e.partialCstResult;
    }
    throw e;
  }
  consumeInternal(tokType, idx, options) {
    let consumedToken;
    try {
      const nextToken = this.LA_FAST(1);
      if (this.tokenMatcher(nextToken, tokType) === true) {
        this.consumeToken();
        consumedToken = nextToken;
      } else {
        this.consumeInternalError(tokType, nextToken, options);
      }
    } catch (eFromConsumption) {
      consumedToken = this.consumeInternalRecovery(tokType, idx, eFromConsumption);
    }
    this.cstPostTerminal(options !== void 0 && options.LABEL !== void 0 ? options.LABEL : tokType.name, consumedToken);
    return consumedToken;
  }
  consumeInternalError(tokType, nextToken, options) {
    let msg;
    const previousToken = this.LA(0);
    if (options !== void 0 && options.ERR_MSG) {
      msg = options.ERR_MSG;
    } else {
      msg = this.errorMessageProvider.buildMismatchTokenMessage({
        expected: tokType,
        actual: nextToken,
        previous: previousToken,
        ruleName: this.getCurrRuleFullName()
      });
    }
    throw this.SAVE_ERROR(new MismatchedTokenException(msg, nextToken, previousToken));
  }
  consumeInternalRecovery(tokType, idx, eFromConsumption) {
    if (this.recoveryEnabled && // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
    eFromConsumption.name === "MismatchedTokenException" && !this.isBackTracking()) {
      const follows = this.getFollowsForInRuleRecovery(tokType, idx);
      try {
        return this.tryInRuleRecovery(tokType, follows);
      } catch (eFromInRuleRecovery) {
        if (eFromInRuleRecovery.name === IN_RULE_RECOVERY_EXCEPTION) {
          throw eFromConsumption;
        } else {
          throw eFromInRuleRecovery;
        }
      }
    } else {
      throw eFromConsumption;
    }
  }
  saveRecogState() {
    const savedErrors = this.errors;
    const savedRuleStack = this.RULE_STACK.slice(0, this.RULE_STACK_IDX + 1);
    return {
      errors: savedErrors,
      lexerState: this.exportLexerState(),
      RULE_STACK: savedRuleStack,
      CST_STACK: this.CST_STACK
    };
  }
  reloadRecogState(newState) {
    this.errors = newState.errors;
    this.importLexerState(newState.lexerState);
    const saved = newState.RULE_STACK;
    for (let i = 0; i < saved.length; i++) {
      this.RULE_STACK[i] = saved[i];
    }
    this.RULE_STACK_IDX = saved.length - 1;
    if (this.RULE_STACK_IDX >= 0) {
      this.currRuleShortName = this.RULE_STACK[this.RULE_STACK_IDX];
      this.currRuleLookaheadFuncs = this.lookAheadFuncsCache[this.currRuleShortName];
    }
  }
  ruleInvocationStateUpdate(shortName, fullName, idxInCallingRule) {
    this.RULE_OCCURRENCE_STACK[++this.RULE_OCCURRENCE_STACK_IDX] = idxInCallingRule;
    this.RULE_STACK[++this.RULE_STACK_IDX] = shortName;
    this.currRuleShortName = shortName;
    this.currRuleLookaheadFuncs = this.lookAheadFuncsCache[shortName];
    this.cstInvocationStateUpdate(fullName);
  }
  isBackTracking() {
    return this.isBackTrackingStack.length !== 0;
  }
  getCurrRuleFullName() {
    const shortName = this.currRuleShortName;
    return this.shortRuleNameToFull[shortName];
  }
  shortRuleNameToFullName(shortName) {
    return this.shortRuleNameToFull[shortName];
  }
  isAtEndOfInput() {
    return this.tokenMatcher(this.LA(1), EOF);
  }
  reset() {
    this.resetLexerState();
    this.subruleIdx = 0;
    this.currRuleShortName = -1;
    this.currRuleLookaheadFuncs = [];
    this.isBackTrackingStack = [];
    this.errors = [];
    this.RULE_STACK_IDX = -1;
    this.RULE_OCCURRENCE_STACK_IDX = -1;
    this.CST_STACK = [];
  }
  /**
   * Hook called before the root-level parsing rule is invoked.
   * This is only called when a rule is invoked directly by the consumer
   * (e.g., `parser.json()`), not when invoked as a sub-rule via SUBRULE.
   *
   * Override this method to perform actions before parsing begins.
   * The default implementation is a no-op.
   *
   * @param ruleName - The name of the root rule being invoked.
   */
  onBeforeParse(ruleName) {
    for (let i = 0; i < this.maxLookahead + 1; i++) {
      this.tokVector.push(END_OF_FILE);
    }
  }
  /**
   * Hook called after the root-level parsing rule has completed (or thrown).
   * This is only called when a rule is invoked directly by the consumer
   * (e.g., `parser.json()`), not when invoked as a sub-rule via SUBRULE.
   *
   * This hook is called in a `finally` block, so it executes regardless of
   * whether parsing succeeded or threw an error.
   *
   * Override this method to perform actions after parsing completes.
   * The default implementation is a no-op.
   *
   * @param ruleName - The name of the root rule that was invoked.
   */
  onAfterParse(ruleName) {
    if (this.isAtEndOfInput() === false) {
      const firstRedundantTok = this.LA(1);
      const errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
        firstRedundant: firstRedundantTok,
        ruleName: this.getCurrRuleFullName()
      });
      this.SAVE_ERROR(new NotAllInputParsedException(errMsg, firstRedundantTok));
    }
    while (this.tokVector.at(-1) === END_OF_FILE) {
      this.tokVector.pop();
    }
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js
var ErrorHandler = class {
  static {
    __name(this, "ErrorHandler");
  }
  initErrorHandler(config) {
    this._errors = [];
    this.errorMessageProvider = Object.hasOwn(config, "errorMessageProvider") ? config.errorMessageProvider : DEFAULT_PARSER_CONFIG.errorMessageProvider;
  }
  SAVE_ERROR(error) {
    if (isRecognitionException(error)) {
      error.context = {
        ruleStack: this.getHumanReadableRuleStack(),
        ruleOccurrenceStack: this.RULE_OCCURRENCE_STACK.slice(0, this.RULE_OCCURRENCE_STACK_IDX + 1)
      };
      this._errors.push(error);
      return error;
    } else {
      throw Error("Trying to save an Error which is not a RecognitionException");
    }
  }
  get errors() {
    return [...this._errors];
  }
  set errors(newErrors) {
    this._errors = newErrors;
  }
  // TODO: consider caching the error message computed information
  raiseEarlyExitException(occurrence, prodType, userDefinedErrMsg) {
    const ruleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[ruleName];
    const lookAheadPathsPerAlternative = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead);
    const insideProdPaths = lookAheadPathsPerAlternative[0];
    const actualTokens = [];
    for (let i = 1; i <= this.maxLookahead; i++) {
      actualTokens.push(this.LA(i));
    }
    const msg = this.errorMessageProvider.buildEarlyExitMessage({
      expectedIterationPaths: insideProdPaths,
      actual: actualTokens,
      previous: this.LA(0),
      customUserDescription: userDefinedErrMsg,
      ruleName
    });
    throw this.SAVE_ERROR(new EarlyExitException(msg, this.LA(1), this.LA(0)));
  }
  // TODO: consider caching the error message computed information
  raiseNoAltException(occurrence, errMsgTypes) {
    const ruleName = this.getCurrRuleFullName();
    const ruleGrammar = this.getGAstProductions()[ruleName];
    const lookAheadPathsPerAlternative = getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
    const actualTokens = [];
    for (let i = 1; i <= this.maxLookahead; i++) {
      actualTokens.push(this.LA(i));
    }
    const previousToken = this.LA(0);
    const errMsg = this.errorMessageProvider.buildNoViableAltMessage({
      expectedPathsPerAlt: lookAheadPathsPerAlternative,
      actual: actualTokens,
      previous: previousToken,
      customUserDescription: errMsgTypes,
      ruleName: this.getCurrRuleFullName()
    });
    throw this.SAVE_ERROR(new NoViableAltException(errMsg, this.LA(1), previousToken));
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js
var RECORDING_NULL_OBJECT = {
  description: "This Object indicates the Parser is during Recording Phase"
};
Object.freeze(RECORDING_NULL_OBJECT);
var HANDLE_SEPARATOR = true;
var MAX_METHOD_IDX = 255;
var RFT = createToken({ name: "RECORDING_PHASE_TOKEN", pattern: Lexer.NA });
augmentTokenTypes([RFT]);
var RECORDING_PHASE_TOKEN = createTokenInstance(
  RFT,
  "This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
  // Negative positions are less likely to cause errors if the output of LA or CONSUME
  // is incorrectly used during the recording phase.
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
);
Object.freeze(RECORDING_PHASE_TOKEN);
var RECORDING_PHASE_CSTNODE = {
  name: "This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
  children: {}
};
var GastRecorder = class {
  static {
    __name(this, "GastRecorder");
  }
  initGastRecorder(config) {
    this.recordingProdStack = [];
    this.RECORDING_PHASE = false;
  }
  enableRecording() {
    this.RECORDING_PHASE = true;
    this.TRACE_INIT("Enable Recording", () => {
      for (let i = 0; i < 10; i++) {
        const idx = i > 0 ? i : "";
        this[`CONSUME${idx}`] = function(arg1, arg2) {
          return this.consumeInternalRecord(arg1, i, arg2);
        };
        this[`SUBRULE${idx}`] = function(arg1, arg2) {
          return this.subruleInternalRecord(arg1, i, arg2);
        };
        this[`OPTION${idx}`] = function(arg1) {
          return this.optionInternalRecord(arg1, i);
        };
        this[`OR${idx}`] = function(arg1) {
          return this.orInternalRecord(arg1, i);
        };
        this[`MANY${idx}`] = function(arg1) {
          this.manyInternalRecord(i, arg1);
        };
        this[`MANY_SEP${idx}`] = function(arg1) {
          this.manySepFirstInternalRecord(i, arg1);
        };
        this[`AT_LEAST_ONE${idx}`] = function(arg1) {
          this.atLeastOneInternalRecord(i, arg1);
        };
        this[`AT_LEAST_ONE_SEP${idx}`] = function(arg1) {
          this.atLeastOneSepFirstInternalRecord(i, arg1);
        };
      }
      this[`consume`] = function(idx, arg1, arg2) {
        return this.consumeInternalRecord(arg1, idx, arg2);
      };
      this[`subrule`] = function(idx, arg1, arg2) {
        return this.subruleInternalRecord(arg1, idx, arg2);
      };
      this[`option`] = function(idx, arg1) {
        return this.optionInternalRecord(arg1, idx);
      };
      this[`or`] = function(idx, arg1) {
        return this.orInternalRecord(arg1, idx);
      };
      this[`many`] = function(idx, arg1) {
        this.manyInternalRecord(idx, arg1);
      };
      this[`atLeastOne`] = function(idx, arg1) {
        this.atLeastOneInternalRecord(idx, arg1);
      };
      this.ACTION = this.ACTION_RECORD;
      this.BACKTRACK = this.BACKTRACK_RECORD;
      this.LA = this.LA_RECORD;
    });
  }
  disableRecording() {
    this.RECORDING_PHASE = false;
    this.TRACE_INIT("Deleting Recording methods", () => {
      const that = this;
      for (let i = 0; i < 10; i++) {
        const idx = i > 0 ? i : "";
        delete that[`CONSUME${idx}`];
        delete that[`SUBRULE${idx}`];
        delete that[`OPTION${idx}`];
        delete that[`OR${idx}`];
        delete that[`MANY${idx}`];
        delete that[`MANY_SEP${idx}`];
        delete that[`AT_LEAST_ONE${idx}`];
        delete that[`AT_LEAST_ONE_SEP${idx}`];
      }
      delete that[`consume`];
      delete that[`subrule`];
      delete that[`option`];
      delete that[`or`];
      delete that[`many`];
      delete that[`atLeastOne`];
      delete that.ACTION;
      delete that.BACKTRACK;
      delete that.LA;
    });
  }
  //   Parser methods are called inside an ACTION?
  //   Maybe try/catch/finally on ACTIONS while disabling the recorders state changes?
  // @ts-expect-error -- noop place holder
  ACTION_RECORD(impl) {
  }
  // Executing backtracking logic will break our recording logic assumptions
  BACKTRACK_RECORD(grammarRule, args) {
    return () => true;
  }
  // LA is part of the official API and may be used for custom lookahead logic
  // by end users who may forget to wrap it in ACTION or inside a GATE
  LA_RECORD(howMuch) {
    return END_OF_FILE;
  }
  topLevelRuleRecord(name, def) {
    try {
      const newTopLevelRule = new Rule({ definition: [], name });
      newTopLevelRule.name = name;
      this.recordingProdStack.push(newTopLevelRule);
      def.call(this);
      this.recordingProdStack.pop();
      return newTopLevelRule;
    } catch (originalError) {
      if (originalError.KNOWN_RECORDER_ERROR !== true) {
        try {
          originalError.message = originalError.message + '\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording';
        } catch (mutabilityError) {
          throw originalError;
        }
      }
      throw originalError;
    }
  }
  // Implementation of parsing DSL
  optionInternalRecord(actionORMethodDef, occurrence) {
    return recordProd.call(this, Option, actionORMethodDef, occurrence);
  }
  atLeastOneInternalRecord(occurrence, actionORMethodDef) {
    recordProd.call(this, RepetitionMandatory, actionORMethodDef, occurrence);
  }
  atLeastOneSepFirstInternalRecord(occurrence, options) {
    recordProd.call(this, RepetitionMandatoryWithSeparator, options, occurrence, HANDLE_SEPARATOR);
  }
  manyInternalRecord(occurrence, actionORMethodDef) {
    recordProd.call(this, Repetition, actionORMethodDef, occurrence);
  }
  manySepFirstInternalRecord(occurrence, options) {
    recordProd.call(this, RepetitionWithSeparator, options, occurrence, HANDLE_SEPARATOR);
  }
  orInternalRecord(altsOrOpts, occurrence) {
    return recordOrProd.call(this, altsOrOpts, occurrence);
  }
  subruleInternalRecord(ruleToCall, occurrence, options) {
    assertMethodIdxIsValid(occurrence);
    if (!ruleToCall || !Object.hasOwn(ruleToCall, "ruleName")) {
      const error = new Error(`<SUBRULE${getIdxSuffix(occurrence)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(ruleToCall)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
      error.KNOWN_RECORDER_ERROR = true;
      throw error;
    }
    const prevProd = this.recordingProdStack.at(-1);
    const ruleName = ruleToCall.ruleName;
    const newNoneTerminal = new NonTerminal({
      idx: occurrence,
      nonTerminalName: ruleName,
      label: options === null || options === void 0 ? void 0 : options.LABEL,
      // The resolving of the `referencedRule` property will be done once all the Rule's GASTs have been created
      referencedRule: void 0
    });
    prevProd.definition.push(newNoneTerminal);
    return this.outputCst ? RECORDING_PHASE_CSTNODE : RECORDING_NULL_OBJECT;
  }
  consumeInternalRecord(tokType, occurrence, options) {
    assertMethodIdxIsValid(occurrence);
    if (!hasShortKeyProperty(tokType)) {
      const error = new Error(`<CONSUME${getIdxSuffix(occurrence)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(tokType)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
      error.KNOWN_RECORDER_ERROR = true;
      throw error;
    }
    const prevProd = this.recordingProdStack.at(-1);
    const newNoneTerminal = new Terminal({
      idx: occurrence,
      terminalType: tokType,
      label: options === null || options === void 0 ? void 0 : options.LABEL
    });
    prevProd.definition.push(newNoneTerminal);
    return RECORDING_PHASE_TOKEN;
  }
};
function recordProd(prodConstructor, mainProdArg, occurrence, handleSep = false) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = this.recordingProdStack.at(-1);
  const grammarAction = typeof mainProdArg === "function" ? mainProdArg : mainProdArg.DEF;
  const newProd = new prodConstructor({ definition: [], idx: occurrence });
  if (handleSep) {
    newProd.separator = mainProdArg.SEP;
  }
  if (Object.hasOwn(mainProdArg, "MAX_LOOKAHEAD")) {
    newProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  this.recordingProdStack.push(newProd);
  grammarAction.call(this);
  prevProd.definition.push(newProd);
  this.recordingProdStack.pop();
  return RECORDING_NULL_OBJECT;
}
__name(recordProd, "recordProd");
function recordOrProd(mainProdArg, occurrence) {
  assertMethodIdxIsValid(occurrence);
  const prevProd = this.recordingProdStack.at(-1);
  const hasOptions = Array.isArray(mainProdArg) === false;
  const alts = hasOptions === false ? mainProdArg : mainProdArg.DEF;
  const newOrProd = new Alternation({
    definition: [],
    idx: occurrence,
    ignoreAmbiguities: hasOptions && mainProdArg.IGNORE_AMBIGUITIES === true
  });
  if (Object.hasOwn(mainProdArg, "MAX_LOOKAHEAD")) {
    newOrProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
  }
  const hasPredicates = alts.some((currAlt) => typeof currAlt.GATE === "function");
  newOrProd.hasPredicates = hasPredicates;
  prevProd.definition.push(newOrProd);
  alts.forEach((currAlt) => {
    const currAltFlat = new Alternative({ definition: [] });
    newOrProd.definition.push(currAltFlat);
    if (Object.hasOwn(currAlt, "IGNORE_AMBIGUITIES")) {
      currAltFlat.ignoreAmbiguities = currAlt.IGNORE_AMBIGUITIES;
    } else if (Object.hasOwn(currAlt, "GATE")) {
      currAltFlat.ignoreAmbiguities = true;
    }
    this.recordingProdStack.push(currAltFlat);
    currAlt.ALT.call(this);
    this.recordingProdStack.pop();
  });
  return RECORDING_NULL_OBJECT;
}
__name(recordOrProd, "recordOrProd");
function getIdxSuffix(idx) {
  return idx === 0 ? "" : `${idx}`;
}
__name(getIdxSuffix, "getIdxSuffix");
function assertMethodIdxIsValid(idx) {
  if (idx < 0 || idx > MAX_METHOD_IDX) {
    const error = new Error(
      // The stack trace will contain all the needed details
      `Invalid DSL Method idx value: <${idx}>
	Idx value must be a none negative value smaller than ${MAX_METHOD_IDX + 1}`
    );
    error.KNOWN_RECORDER_ERROR = true;
    throw error;
  }
}
__name(assertMethodIdxIsValid, "assertMethodIdxIsValid");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js
var PerformanceTracer = class {
  static {
    __name(this, "PerformanceTracer");
  }
  initPerformanceTracer(config) {
    if (Object.hasOwn(config, "traceInitPerf")) {
      const userTraceInitPerf = config.traceInitPerf;
      const traceIsNumber = typeof userTraceInitPerf === "number";
      this.traceInitMaxIdent = traceIsNumber ? userTraceInitPerf : Infinity;
      this.traceInitPerf = traceIsNumber ? userTraceInitPerf > 0 : userTraceInitPerf;
    } else {
      this.traceInitMaxIdent = 0;
      this.traceInitPerf = DEFAULT_PARSER_CONFIG.traceInitPerf;
    }
    this.traceInitIndent = -1;
  }
  TRACE_INIT(phaseDesc, phaseImpl) {
    if (this.traceInitPerf === true) {
      this.traceInitIndent++;
      const indent = new Array(this.traceInitIndent + 1).join("	");
      if (this.traceInitIndent < this.traceInitMaxIdent) {
        console.log(`${indent}--> <${phaseDesc}>`);
      }
      const { time, value } = timer(phaseImpl);
      const traceMethod = time > 10 ? console.warn : console.log;
      if (this.traceInitIndent < this.traceInitMaxIdent) {
        traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
      }
      this.traceInitIndent--;
      return value;
    } else {
      return phaseImpl();
    }
  }
};

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js
function applyMixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    const baseProto = baseCtor.prototype;
    Object.getOwnPropertyNames(baseProto).forEach((propName) => {
      if (propName === "constructor") {
        return;
      }
      const basePropDescriptor = Object.getOwnPropertyDescriptor(baseProto, propName);
      if (basePropDescriptor && (basePropDescriptor.get || basePropDescriptor.set)) {
        Object.defineProperty(derivedCtor.prototype, propName, basePropDescriptor);
      } else {
        derivedCtor.prototype[propName] = baseCtor.prototype[propName];
      }
    });
  });
}
__name(applyMixins, "applyMixins");

// ../../node_modules/.pnpm/chevrotain@13.2.0/node_modules/chevrotain/lib/src/parse/parser/parser.js
var END_OF_FILE = createTokenInstance(EOF, "", -1, -1, -1, -1, -1, -1);
Object.freeze(END_OF_FILE);
var DEFAULT_PARSER_CONFIG = Object.freeze({
  recoveryEnabled: false,
  maxLookahead: 3,
  dynamicTokensEnabled: false,
  outputCst: true,
  errorMessageProvider: defaultParserErrorProvider,
  nodeLocationTracking: "none",
  traceInitPerf: false,
  skipValidations: false
});
var DEFAULT_RULE_CONFIG = Object.freeze({
  recoveryValueFunc: /* @__PURE__ */ __name(() => void 0, "recoveryValueFunc"),
  resyncEnabled: true
});
var ParserDefinitionErrorType;
(function(ParserDefinitionErrorType2) {
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["NO_NON_EMPTY_LOOKAHEAD"] = 10] = "NO_NON_EMPTY_LOOKAHEAD";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_PREFIX_ALTS"] = 11] = "AMBIGUOUS_PREFIX_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["TOO_MANY_ALTS"] = 12] = "TOO_MANY_ALTS";
  ParserDefinitionErrorType2[ParserDefinitionErrorType2["CUSTOM_LOOKAHEAD_VALIDATION"] = 13] = "CUSTOM_LOOKAHEAD_VALIDATION";
})(ParserDefinitionErrorType || (ParserDefinitionErrorType = {}));
var Parser = class _Parser {
  static {
    __name(this, "Parser");
  }
  /**
   *  @deprecated use the **instance** method with the same name instead
   */
  static performSelfAnalysis(parserInstance) {
    throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
  }
  performSelfAnalysis() {
    this.TRACE_INIT("performSelfAnalysis", () => {
      let defErrorsMsgs;
      this.selfAnalysisDone = true;
      const className = this.className;
      this.TRACE_INIT("toFastProps", () => {
        toFastProperties(this);
      });
      this.TRACE_INIT("Grammar Recording", () => {
        try {
          this.enableRecording();
          this.definedRulesNames.forEach((currRuleName) => {
            const wrappedRule = this[currRuleName];
            const originalGrammarAction = wrappedRule["originalGrammarAction"];
            let recordedRuleGast;
            this.TRACE_INIT(`${currRuleName} Rule`, () => {
              recordedRuleGast = this.topLevelRuleRecord(currRuleName, originalGrammarAction);
            });
            this.gastProductionsCache[currRuleName] = recordedRuleGast;
          });
        } finally {
          this.disableRecording();
        }
      });
      let resolverErrors = [];
      this.TRACE_INIT("Grammar Resolving", () => {
        resolverErrors = resolveGrammar2({
          rules: Object.values(this.gastProductionsCache)
        });
        this.definitionErrors = this.definitionErrors.concat(resolverErrors);
      });
      this.TRACE_INIT("Grammar Validations", () => {
        if (resolverErrors.length === 0 && this.skipValidations === false) {
          const validationErrors = validateGrammar2({
            rules: Object.values(this.gastProductionsCache),
            tokenTypes: Object.values(this.tokensMap),
            errMsgProvider: defaultGrammarValidatorErrorProvider,
            grammarName: className
          });
          const lookaheadValidationErrors = validateLookahead({
            lookaheadStrategy: this.lookaheadStrategy,
            rules: Object.values(this.gastProductionsCache),
            tokenTypes: Object.values(this.tokensMap),
            grammarName: className
          });
          this.definitionErrors = this.definitionErrors.concat(validationErrors, lookaheadValidationErrors);
        }
      });
      if (this.definitionErrors.length === 0) {
        if (this.recoveryEnabled) {
          this.TRACE_INIT("computeAllProdsFollows", () => {
            const allFollows = computeAllProdsFollows(Object.values(this.gastProductionsCache));
            this.resyncFollows = allFollows;
          });
        }
        this.TRACE_INIT("ComputeLookaheadFunctions", () => {
          var _a, _b;
          (_b = (_a = this.lookaheadStrategy).initialize) === null || _b === void 0 ? void 0 : _b.call(_a, {
            rules: Object.values(this.gastProductionsCache)
          });
          this.preComputeLookaheadFunctions(Object.values(this.gastProductionsCache));
        });
      }
      if (!_Parser.DEFER_DEFINITION_ERRORS_HANDLING && this.definitionErrors.length !== 0) {
        defErrorsMsgs = this.definitionErrors.map((defError) => defError.message);
        throw new Error(`Parser Definition Errors detected:
 ${defErrorsMsgs.join("\n-------------------------------\n")}`);
      }
    });
  }
  constructor(tokenVocabulary, config) {
    this.definitionErrors = [];
    this.selfAnalysisDone = false;
    const that = this;
    that.initErrorHandler(config);
    that.initLexerAdapter();
    that.initLooksAhead(config);
    that.initRecognizerEngine(tokenVocabulary, config);
    that.initRecoverable(config);
    that.initTreeBuilder(config);
    that.initGastRecorder(config);
    that.initPerformanceTracer(config);
    if (Object.hasOwn(config, "ignoredIssues")) {
      throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.");
    }
    this.skipValidations = Object.hasOwn(config, "skipValidations") ? config.skipValidations : DEFAULT_PARSER_CONFIG.skipValidations;
  }
};
Parser.DEFER_DEFINITION_ERRORS_HANDLING = false;
applyMixins(Parser, [
  Recoverable,
  LooksAhead,
  TreeBuilder,
  LexerAdapter,
  RecognizerEngine,
  RecognizerApi,
  ErrorHandler,
  GastRecorder,
  PerformanceTracer
]);
var CstParser = class extends Parser {
  static {
    __name(this, "CstParser");
  }
  constructor(tokenVocabulary, config = DEFAULT_PARSER_CONFIG) {
    const configClone = Object.assign({}, config);
    configClone.outputCst = true;
    super(tokenVocabulary, configClone);
  }
};

// src/diagrams/usecase/parser/usecase.tokens.ts
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
var usecaseLexer = new Lexer(usecaseLexerModes);

// src/diagrams/usecase/parser/usecase.parser.ts
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
    const first2 = /* @__PURE__ */ new Map();
    for (const relation of this.relationshipDrafts) {
      this.recordFirst(first2, relation.source.id, relation.source.location.span[0]);
      this.recordFirst(first2, relation.target.id, relation.target.location.span[0]);
    }
    for (const draft of this.elements) {
      this.recordFirst(first2, draft.id, draft.location.span[0]);
    }
    for (const draft of this.boundaries) {
      this.recordFirst(first2, draft.id, draft.location.span[0]);
    }
    for (const draft of this.jsonDrafts) {
      this.recordFirst(first2, draft.id, draft.location.span[0]);
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
    this.materializeElements(elements, first2);
    this.materializeBoundaries(boundaries, first2);
    this.materializeJson(first2);
    const edges = this.materializeRelationships(symbols, elements, first2);
    this.reorderElements(elements, first2);
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
  materializeElements(states, first2) {
    for (const state2 of [...states.values()].sort(
      (a, b) => (first2.get(a.id) ?? 0) - (first2.get(b.id) ?? 0)
    )) {
      this.setElementModel(state2);
    }
  }
  materializeBoundaries(states, first2) {
    for (const state2 of [...states.values()].sort(
      (a, b) => (first2.get(a.id) ?? 0) - (first2.get(b.id) ?? 0)
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
  materializeJson(first2) {
    for (const draft of [...this.jsonDrafts].sort(
      (a, b) => (first2.get(a.id) ?? 0) - (first2.get(b.id) ?? 0)
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
  materializeRelationships(symbols, states, first2) {
    const edges = /* @__PURE__ */ new Map();
    let anonymous = 0;
    for (const draft of this.relationshipDrafts) {
      const sourceKind = this.resolveEndpoint(draft.source, symbols, states, first2);
      const targetKind = this.resolveEndpoint(draft.target, symbols, states, first2);
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
  resolveEndpoint(endpoint, symbols, states, first2) {
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
    this.recordFirst(first2, endpoint.id, endpoint.location.span[0]);
    return "usecase";
  }
  reorderElements(states, first2) {
    const actors = new Map(this.model.actors);
    const useCases = new Map(this.model.useCases);
    this.model.actors.clear();
    this.model.useCases.clear();
    for (const state2 of [...states.values()].sort(
      (a, b) => (first2.get(a.id) ?? 0) - (first2.get(b.id) ?? 0)
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
    const first2 = this.allTokens(node.children)[0];
    return {
      span: this.nodeSpan(node),
      line: first2.startLine ?? 1,
      column: first2.startColumn ?? 1
    };
  }
  ctxLocation(ctx) {
    const tokens = this.allTokens(ctx).filter(
      (token) => token.tokenType.name !== "NEWLINE" && token.tokenType.name !== "EOF"
    );
    const first2 = tokens[0];
    const last = tokens.at(-1);
    return {
      span: [
        first2.startOffset,
        Math.min(
          this.source.length,
          (last.endOffset ?? last.startOffset + last.image.length - 1) + 1
        )
      ],
      line: first2.startLine ?? 1,
      column: first2.startColumn ?? 1
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
    const first2 = tokens[0];
    const last = tokens.at(-1);
    if (!first2 || !last) {
      throw new Error("Usecase CST node has no source token");
    }
    return [
      first2.startOffset,
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
    const path = select_default(this);
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
