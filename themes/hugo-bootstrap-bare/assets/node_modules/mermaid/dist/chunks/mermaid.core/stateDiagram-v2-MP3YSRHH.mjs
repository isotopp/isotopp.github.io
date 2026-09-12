import {
  StateDB,
  stateDiagram_default,
  stateRenderer_v3_unified_default,
  styles_default
} from "./chunk-IMKFNOWR.mjs";
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

// src/diagrams/state/stateDiagram-v2.ts
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
