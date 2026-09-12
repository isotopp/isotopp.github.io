import {
  parse
} from "./chunk-5EDX277H.mjs";
import "./chunk-WKU43CU3.mjs";
import "./chunk-2HS3KVXU.mjs";
import "./chunk-XOOU5E5Q.mjs";
import "./chunk-SXDK7GA3.mjs";
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
import {
  selectSvgElement
} from "./chunk-Y5RK4UJQ.mjs";
import {
  configureSvgSize
} from "./chunk-AHS5MEEA.mjs";
import {
  log
} from "./chunk-X5WJYYCX.mjs";
import {
  __name
} from "./chunk-PTVI3W5X.mjs";

// src/diagrams/info/infoParser.ts
var parser = {
  parse: /* @__PURE__ */ __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};

// src/diagrams/info/infoDb.ts
var DEFAULT_INFO_DB = {
  version: "11.17.2" + (true ? "" : "-tiny")
};
var getVersion = /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};

// src/diagrams/info/infoRenderer.ts
var draw = /* @__PURE__ */ __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };

// src/diagrams/info/infoDiagram.ts
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
