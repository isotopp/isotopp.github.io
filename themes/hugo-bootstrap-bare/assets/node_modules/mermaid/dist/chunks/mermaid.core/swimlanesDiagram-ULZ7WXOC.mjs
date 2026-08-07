import {
  createFlowDiagram,
  styles_default
} from "./chunk-JQJVKLGR.mjs";
import "./chunk-5VM5RSS4.mjs";
import "./chunk-XXDRQBXY.mjs";
import "./chunk-KBJHAD2P.mjs";
import "./chunk-ZIRB5QZD.mjs";
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

// src/diagrams/swimlanes/styles.ts
var getStyles = /* @__PURE__ */ __name((options) => `${styles_default(options)}
  .swimlane.cluster rect {
    stroke: ${options.clusterBorder} !important;
  }
  [data-look="neo"].cluster rect {
    filter: none;
  }
`, "getStyles");
var styles_default2 = getStyles;

// src/diagrams/swimlanes/swimlanesDiagram.ts
var diagram = createFlowDiagram({ defaultLayout: "swimlane", styles: styles_default2 });
export {
  diagram
};
