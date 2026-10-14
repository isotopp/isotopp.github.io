import {
  parse
} from "./chunk-UOLPKQDX.mjs";
import "./chunk-GSKXJ5HP.mjs";
import "./chunk-ZNVHHPUW.mjs";
import "./chunk-UWAP2SB3.mjs";
import "./chunk-N4MLXEYH.mjs";
import "./chunk-35LWCMBR.mjs";
import "./chunk-OG2W3CY3.mjs";
import "./chunk-PFLNU6FT.mjs";
import "./chunk-OYEFJUKB.mjs";
import "./chunk-DFH22MUF.mjs";
import "./chunk-GM6EOIBZ.mjs";
import "./chunk-PVJZUHH5.mjs";
import "./chunk-HNEZ3WHL.mjs";
import "./chunk-L2LWOXJX.mjs";
import "./chunk-5B6E75V7.mjs";
import "./chunk-II7VFZ6N.mjs";
import "./chunk-LKH355KK.mjs";
import {
  selectSvgElement
} from "./chunk-CI7DDXBJ.mjs";
import {
  configureSvgSize
} from "./chunk-DLUCIBNR.mjs";
import {
  log
} from "./chunk-OHNBJXQ2.mjs";
import {
  __name
} from "./chunk-35ZOQMXA.mjs";

// src/diagrams/info/infoParser.ts
var parser = {
  parse: /* @__PURE__ */ __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};

// src/diagrams/info/infoDb.ts
var DEFAULT_INFO_DB = {
  version: "12.2.0" + (true ? "" : "-tiny")
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
