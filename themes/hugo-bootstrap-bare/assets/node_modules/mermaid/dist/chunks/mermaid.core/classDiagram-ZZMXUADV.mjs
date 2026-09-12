import {
  ClassDB,
  classDiagram_default,
  classRenderer_v3_unified_default,
  styles_default
} from "./chunk-TICWLB2K.mjs";
import "./chunk-5VM5RSS4.mjs";
import "./chunk-XXDRQBXY.mjs";
import "./chunk-POPQ4Y6H.mjs";
import "./chunk-TLUHSLCS.mjs";
import "./chunk-F27PBJKO.mjs";
import "./chunk-L3NEJ4N5.mjs";
import "./chunk-OSK3NFVY.mjs";
import "./chunk-GVQU2GXP.mjs";
import "./chunk-4HAMMTFA.mjs";
import "./chunk-P2QGCYS3.mjs";
import "./chunk-GMAD6QVW.mjs";
import "./chunk-PWAF6VOD.mjs";
import "./chunk-75Z2AOVW.mjs";
import "./chunk-DU6HZSFF.mjs";
import "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/diagrams/class/classDiagram.ts
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
