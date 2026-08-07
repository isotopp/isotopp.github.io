import {
  StateDB,
  stateDiagram_default,
  stateRenderer_v3_unified_default,
  styles_default
} from "./chunk-5RXB4S5H.mjs";
import "./chunk-XXDRQBXY.mjs";
import "./chunk-KBJHAD2P.mjs";
import "./chunk-J7OUQ5F2.mjs";
import "./chunk-2GRJ4B5K.mjs";
import "./chunk-7Z6QIM7H.mjs";
import "./chunk-QR6OTTB3.mjs";
import "./chunk-W5SLKNZC.mjs";
import "./chunk-7BUUIJ7U.mjs";
import "./chunk-UBXNYLIW.mjs";
import "./chunk-WRU74C26.mjs";
import "./chunk-4I5QYGJK.mjs";
import "./chunk-NSK5VX7P.mjs";
import "./chunk-I66GZJ75.mjs";
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
