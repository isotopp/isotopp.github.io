import {
  createFlowDiagram,
  styles_default
} from "./chunk-6HLVECFW.mjs";
import "./chunk-RTBOCTTP.mjs";
import "./chunk-Z7BGCTMV.mjs";
import "./chunk-CXMX27UD.mjs";
import "./chunk-QSBWTT6A.mjs";
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
