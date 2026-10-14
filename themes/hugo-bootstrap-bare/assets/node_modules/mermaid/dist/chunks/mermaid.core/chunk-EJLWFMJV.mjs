import {
  insertLookDefs
} from "./chunk-DUW6YSOI.mjs";
import {
  insertCluster
} from "./chunk-HNE4Q36P.mjs";
import {
  insertEdge,
  insertEdgeLabel,
  markers_default,
  positionEdgeLabel
} from "./chunk-WQQL4CDK.mjs";
import {
  insertNode
} from "./chunk-ZAUX2LTX.mjs";
import {
  labelHelper
} from "./chunk-HAGFOTED.mjs";
import {
  interpolateToCurve
} from "./chunk-7S6XSTFO.mjs";
import {
  common_default,
  getConfig
} from "./chunk-DSNLSHJZ.mjs";
import {
  log
} from "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/internals.ts
var internalHelpers = {
  common: common_default,
  getConfig,
  insertCluster,
  insertEdge,
  insertEdgeLabel,
  insertMarkers: markers_default,
  insertNode,
  interpolateToCurve,
  labelHelper,
  log,
  positionEdgeLabel
};

// src/rendering-util/layout-algorithms/elk/algorithms.ts
var ELK_ALGORITHMS = [
  "elk.stress",
  "elk.force",
  "elk.mrtree",
  "elk.sporeOverlap",
  "elk.box",
  "elk.rectpacking"
];

// src/rendering-util/render.ts
var layoutAlgorithms = /* @__PURE__ */ Object.create(null);
var registerLayoutLoaders = /* @__PURE__ */ __name((loaders) => {
  for (const loader of loaders) {
    layoutAlgorithms[loader.name] = loader;
  }
}, "registerLayoutLoaders");
var elkLayoutLoaders = /* @__PURE__ */ __name(() => {
  const loader = /* @__PURE__ */ __name(async () => await import("./elk-QONTBCTQ.mjs"), "loader");
  return [
    { name: "elk", loader, algorithm: "elk.layered" },
    ...ELK_ALGORITHMS.map((algorithm) => ({ name: algorithm, loader, algorithm }))
  ];
}, "elkLayoutLoaders");
var registerDefaultLayoutLoaders = /* @__PURE__ */ __name(() => {
  registerLayoutLoaders([
    {
      name: "dagre",
      loader: /* @__PURE__ */ __name(async () => await import("./dagre-NK4GIZVX.mjs"), "loader")
    },
    {
      name: "swimlane",
      loader: /* @__PURE__ */ __name(async () => await import("./swimlanes-B3ENRKFQ.mjs"), "loader")
    },
    // elkjs is ~1.6 MB of source, so it is excluded from the tiny build along
    // with the other large features. `getRegisteredLayoutAlgorithm` then falls
    // back to dagre for diagrams that ask for an ELK layout there.
    ...true ? [
      {
        name: "cose-bilkent",
        loader: /* @__PURE__ */ __name(async () => await import("./cose-bilkent-JH36ORCC.mjs"), "loader")
      },
      ...elkLayoutLoaders()
    ] : []
  ]);
}, "registerDefaultLayoutLoaders");
registerDefaultLayoutLoaders();
var render = /* @__PURE__ */ __name(async (data4Layout, svg) => {
  if (!Object.hasOwn(layoutAlgorithms, data4Layout.layoutAlgorithm)) {
    throw new Error(`Unknown layout algorithm: ${data4Layout.layoutAlgorithm}`);
  }
  if (data4Layout.diagramId) {
    for (const node of data4Layout.nodes) {
      const originalDomId = node.domId || node.id;
      node.domId = `${data4Layout.diagramId}-${originalDomId}`;
    }
  }
  const layoutDefinition = layoutAlgorithms[data4Layout.layoutAlgorithm];
  const layoutRenderer = await layoutDefinition.loader();
  insertLookDefs(svg, data4Layout.config);
  return layoutRenderer.render(data4Layout, svg, internalHelpers, {
    algorithm: layoutDefinition.algorithm
  });
}, "render");
var LAST_RESORT_LAYOUT = "dagre";
var getRegisteredLayoutAlgorithm = /* @__PURE__ */ __name((algorithm = "", { fallback = LAST_RESORT_LAYOUT } = {}) => {
  if (Object.hasOwn(layoutAlgorithms, algorithm)) {
    return algorithm;
  }
  for (const candidate of [fallback, LAST_RESORT_LAYOUT]) {
    if (Object.hasOwn(layoutAlgorithms, candidate)) {
      log.warn(`Layout algorithm ${algorithm} is not registered. Using ${candidate} as fallback.`);
      return candidate;
    }
  }
  throw new Error(
    `Neither layout algorithm ${algorithm}, ${fallback}, nor ${LAST_RESORT_LAYOUT} is registered.`
  );
}, "getRegisteredLayoutAlgorithm");

export {
  registerLayoutLoaders,
  render,
  getRegisteredLayoutAlgorithm
};
