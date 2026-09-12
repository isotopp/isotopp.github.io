import {
  ClassDB,
  classDiagram_default,
  classRenderer_v3_unified_default,
  styles_default
} from "./chunk-AEUN2JU2.mjs";
import "./chunk-RTBOCTTP.mjs";
import "./chunk-Z7BGCTMV.mjs";
import "./chunk-CXMX27UD.mjs";
import "./chunk-GFLU7YR5.mjs";
import "./chunk-YJHQES7P.mjs";
import "./chunk-R2G3K5KZ.mjs";
import "./chunk-YD6RSKXN.mjs";
import "./chunk-VOXL5ABF.mjs";
import "./chunk-BULPQSRM.mjs";
import "./chunk-PLCLPJVV.mjs";
import "./chunk-ECMXQ4X3.mjs";
import "./chunk-LBQO3HYP.mjs";
import "./chunk-AYHZ2ZZ4.mjs";
import "./chunk-TYR5776D.mjs";
import "./chunk-IPM4HZQ6.mjs";
import "./chunk-AHS5MEEA.mjs";
import "./chunk-X5WJYYCX.mjs";
import {
  __name
} from "./chunk-PTVI3W5X.mjs";

// src/diagrams/class/classDiagram-v2.ts
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
