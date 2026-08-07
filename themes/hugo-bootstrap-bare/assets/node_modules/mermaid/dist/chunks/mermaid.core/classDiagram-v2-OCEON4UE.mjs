import {
  ClassDB,
  classDiagram_default,
  classRenderer_v3_unified_default,
  styles_default
} from "./chunk-GF5L2VYU.mjs";
import "./chunk-5VM5RSS4.mjs";
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
