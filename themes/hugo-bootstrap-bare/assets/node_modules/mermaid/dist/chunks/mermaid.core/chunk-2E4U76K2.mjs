import {
  clear,
  insertCluster
} from "./chunk-L3NEJ4N5.mjs";
import {
  clear as clear2,
  edgeLabels,
  hasEdgeLabel,
  insertEdge,
  insertEdgeLabel,
  markers_default,
  terminalLabels
} from "./chunk-OSK3NFVY.mjs";
import {
  clear as clear3,
  getSubGraphTitleMargins,
  insertNode,
  positionNode
} from "./chunk-GVQU2GXP.mjs";
import {
  labelHelper
} from "./chunk-4HAMMTFA.mjs";
import {
  utils_default
} from "./chunk-75Z2AOVW.mjs";
import {
  getConfig,
  getConfig2
} from "./chunk-DU6HZSFF.mjs";
import {
  log
} from "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/rendering-util/createGraph.ts
import * as graphlib from "dagre-d3-es/src/graphlib/index.js";
function createLayoutElementGroups(element, { edgePathsClass = "edges edgePaths" } = {}) {
  const rootGroups = element.insert("g").attr("class", "root");
  const clusters = rootGroups.insert("g").attr("class", "clusters");
  const edgePaths = rootGroups.insert("g").attr("class", edgePathsClass);
  const edgeLabels2 = rootGroups.insert("g").attr("class", "edgeLabels");
  const nodes = rootGroups.insert("g").attr("class", "nodes");
  return { clusters, edgePaths, edgeLabels: edgeLabels2, nodes, rootGroups };
}
__name(createLayoutElementGroups, "createLayoutElementGroups");
async function measureGroupLabel(nodesGroup, node) {
  if (node.label) {
    const { shapeSvg, bbox } = await labelHelper(nodesGroup, node);
    node.labelBBox = { width: bbox.width, height: bbox.height };
    shapeSvg.remove();
  } else {
    node.labelBBox = { width: 0, height: 0 };
  }
}
__name(measureGroupLabel, "measureGroupLabel");
async function insertMeasuredNode(nodesGroup, node, renderOptions) {
  const childNodeEl = await insertNode(nodesGroup, node, renderOptions);
  const boundingBox = childNodeEl.node()?.getBBox() ?? { width: 0, height: 0 };
  node.width = boundingBox.width;
  node.height = boundingBox.height;
  return childNodeEl;
}
__name(insertMeasuredNode, "insertMeasuredNode");
async function createGraphWithElements(element, data4Layout) {
  const graph = new graphlib.Graph({
    multigraph: true,
    compound: true
  });
  const edgesToProcess = [...data4Layout.edges];
  const config = getConfig2();
  const groups = createLayoutElementGroups(element);
  const { edgeLabels: edgeLabels2, nodes: nodesGroup } = groups;
  const nodeElements = /* @__PURE__ */ new Map();
  const hasDom = element.node() != null;
  await Promise.all(
    data4Layout.nodes.map(async (node) => {
      if (node.isGroup) {
        if (hasDom) {
          await measureGroupLabel(nodesGroup, node);
        }
        graph.setNode(node.id, { ...node });
      } else {
        if (hasDom) {
          const childNodeEl = await insertMeasuredNode(nodesGroup, node, {
            config,
            dir: node.dir
          });
          nodeElements.set(node.id, childNodeEl);
        }
        graph.setNode(node.id, { ...node });
      }
    })
  );
  for (const edge of edgesToProcess) {
    if (hasDom && hasEdgeLabel(edge)) {
      await insertEdgeLabel(edgeLabels2, edge);
    }
    graph.setEdge(edge.start, edge.end, { ...edge }, edge.id);
    const edgeExists = data4Layout.edges.some((existingEdge) => existingEdge.id === edge.id);
    if (!edgeExists) {
      data4Layout.edges.push(edge);
    }
  }
  if (globalThis.mermaidCaptureSizes) {
    const { captureNodeSizes } = await import("./sizeCapture-INFHLROL.mjs");
    captureNodeSizes(element, data4Layout);
  }
  return {
    graph,
    groups,
    nodeElements
  };
}
__name(createGraphWithElements, "createGraphWithElements");

// src/rendering-util/layout-algorithms/dagre/mermaid-graphlib.js
import * as graphlib2 from "dagre-d3-es/src/graphlib/index.js";
var clusterDb = /* @__PURE__ */ new Map();
var descendants = /* @__PURE__ */ new Map();
var parents = /* @__PURE__ */ new Map();
var clear4 = /* @__PURE__ */ __name(() => {
  descendants.clear();
  parents.clear();
  clusterDb.clear();
}, "clear");
var isDescendant = /* @__PURE__ */ __name((id, ancestorId) => {
  const ancestorDescendants = descendants.get(ancestorId) || [];
  log.trace("In isDescendant", ancestorId, " ", id, " = ", ancestorDescendants.includes(id));
  return ancestorDescendants.includes(id);
}, "isDescendant");
var edgeInCluster = /* @__PURE__ */ __name((edge, clusterId) => {
  const clusterDescendants = descendants.get(clusterId) || [];
  log.info("Descendants of ", clusterId, " is ", clusterDescendants);
  log.info("Edge is ", edge);
  if (edge.v === clusterId || edge.w === clusterId) {
    return false;
  }
  if (!clusterDescendants) {
    log.debug("Tilt, ", clusterId, ",not in descendants");
    return false;
  }
  return clusterDescendants.includes(edge.v) || isDescendant(edge.v, clusterId) || isDescendant(edge.w, clusterId) || clusterDescendants.includes(edge.w);
}, "edgeInCluster");
var copy = /* @__PURE__ */ __name((clusterId, graph, newGraph, rootId) => {
  log.debug(
    "Copying children of ",
    clusterId,
    "root",
    rootId,
    "data",
    graph.node(clusterId),
    rootId
  );
  const nodes = graph.children(clusterId) || [];
  if (clusterId !== rootId) {
    nodes.push(clusterId);
  }
  log.debug("Copying (nodes) clusterId", clusterId, "nodes", nodes);
  nodes.forEach((node) => {
    if (graph.children(node).length > 0) {
      copy(node, graph, newGraph, rootId);
    } else {
      const data = graph.node(node);
      log.info("cp ", node, " to ", rootId, " with parent ", clusterId);
      newGraph.setNode(node, data);
      if (rootId !== graph.parent(node)) {
        log.debug("Setting parent", node, graph.parent(node));
        newGraph.setParent(node, graph.parent(node));
      }
      if (clusterId !== rootId && node !== clusterId) {
        log.debug("Setting parent", node, clusterId);
        newGraph.setParent(node, clusterId);
      } else {
        log.info("In copy ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
        log.debug(
          "Not Setting parent for node=",
          node,
          "cluster!==rootId",
          clusterId !== rootId,
          "node!==clusterId",
          node !== clusterId
        );
      }
      const edges = graph.edges(node);
      log.debug("Copying Edges", edges);
      edges.forEach((edge) => {
        log.info("Edge", edge);
        const data2 = graph.edge(edge.v, edge.w, edge.name);
        log.info("Edge data", data2, rootId);
        try {
          if (edgeInCluster(edge, rootId)) {
            log.info("Copying as ", edge.v, edge.w, data2, edge.name);
            newGraph.setEdge(edge.v, edge.w, data2, edge.name);
            log.info("newGraph edges ", newGraph.edges(), newGraph.edge(newGraph.edges()[0]));
          } else {
            log.info(
              "Skipping copy of edge ",
              edge.v,
              "-->",
              edge.w,
              " rootId: ",
              rootId,
              " clusterId:",
              clusterId
            );
          }
        } catch (e) {
          log.error(e);
        }
      });
    }
    log.debug("Removing node", node);
    graph.removeNode(node);
  });
}, "copy");
var extractDescendants = /* @__PURE__ */ __name((id, graph) => {
  const children = graph.children(id);
  let res = [...children];
  for (const child of children) {
    parents.set(child, id);
    res = [...res, ...extractDescendants(child, graph)];
  }
  return res;
}, "extractDescendants");
var findCommonEdges = /* @__PURE__ */ __name((graph, id1, id2) => {
  const edges1 = graph.edges().filter((edge) => edge.v === id1 || edge.w === id1);
  const edges2 = graph.edges().filter((edge) => edge.v === id2 || edge.w === id2);
  const edges1Prim = edges1.map((edge) => {
    return { v: edge.v === id1 ? id2 : edge.v, w: edge.w === id1 ? id1 : edge.w };
  });
  const edges2Prim = edges2.map((edge) => {
    return { v: edge.v, w: edge.w };
  });
  const result = edges1Prim.filter((edgeIn1) => {
    return edges2Prim.some((edge) => edgeIn1.v === edge.v && edgeIn1.w === edge.w);
  });
  return result;
}, "findCommonEdges");
var findNonClusterChild = /* @__PURE__ */ __name((id, graph, clusterId) => {
  const children = graph.children(id);
  log.trace("Searching children of id ", id, children);
  if (children.length < 1) {
    return id;
  }
  let reserve;
  for (const child of children) {
    const _id = findNonClusterChild(child, graph, clusterId);
    const commonEdges = findCommonEdges(graph, clusterId, _id);
    if (_id) {
      if (commonEdges.length > 0) {
        reserve = _id;
      } else {
        return _id;
      }
    }
  }
  return reserve;
}, "findNonClusterChild");
var getAnchorId = /* @__PURE__ */ __name((id) => {
  if (!clusterDb.has(id)) {
    return id;
  }
  if (!clusterDb.get(id).externalConnections) {
    return id;
  }
  if (clusterDb.has(id)) {
    return clusterDb.get(id).id;
  }
  return id;
}, "getAnchorId");
var adjustClustersAndEdges = /* @__PURE__ */ __name((graph, depth) => {
  if (!graph || depth > 10) {
    log.debug("Opting out, no graph ");
    return;
  } else {
    log.debug("Opting in, graph ");
  }
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    if (children.length > 0) {
      log.debug(
        "Cluster identified",
        id,
        " Replacement id in edges: ",
        findNonClusterChild(id, graph, id)
      );
      descendants.set(id, extractDescendants(id, graph));
      clusterDb.set(id, { id: findNonClusterChild(id, graph, id), clusterData: graph.node(id) });
    }
  });
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    const edges = graph.edges();
    if (children.length > 0) {
      log.debug("Cluster identified", id, descendants);
      edges.forEach((edge) => {
        const d1 = isDescendant(edge.v, id);
        const d2 = isDescendant(edge.w, id);
        if (d1 ^ d2) {
          log.debug("Edge: ", edge, " leaves cluster ", id);
          log.debug("Descendants of XXX ", id, ": ", descendants.get(id));
          clusterDb.get(id).externalConnections = true;
        }
      });
    } else {
      log.debug("Not a cluster ", id, descendants);
    }
  });
  for (let id of clusterDb.keys()) {
    const nonClusterChild = clusterDb.get(id).id;
    const parent = graph.parent(nonClusterChild);
    if (parent !== id && clusterDb.has(parent) && !clusterDb.get(parent).externalConnections) {
      clusterDb.get(id).id = parent;
    }
    const hasDirectOutgoingEdge = graph.edges().some((edge) => edge.v === id);
    if (nonClusterChild && clusterDb.get(id)?.externalConnections && hasDirectOutgoingEdge && isNodeInExtractableCluster(graph, nonClusterChild, id)) {
      const safeAnchor = findSafeAnchorNode(graph, id, graph.parent(nonClusterChild));
      if (safeAnchor) {
        clusterDb.get(id).id = safeAnchor;
      }
    }
  }
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    log.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    log.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
    let v = e.v;
    let w = e.w;
    log.debug(
      "Fix XXX",
      clusterDb,
      "ids:",
      e.v,
      e.w,
      "Translating: ",
      clusterDb.get(e.v),
      " --- ",
      clusterDb.get(e.w)
    );
    if (clusterDb.get(e.v) || clusterDb.get(e.w)) {
      log.debug("Fixing and trying - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      if (v !== e.v) {
        const parent = graph.parent(v);
        clusterDb.get(parent).externalConnections = true;
        edge.fromCluster = e.v;
      }
      if (w !== e.w) {
        const parent = graph.parent(w);
        clusterDb.get(parent).externalConnections = true;
        edge.toCluster = e.w;
      }
      log.debug("Fix Replacing with XXX", v, w, e.name);
      graph.setEdge(v, w, edge, e.name);
    }
  });
  extractor(graph, 0);
  log.trace(clusterDb);
}, "adjustClustersAndEdges");
var extractor = /* @__PURE__ */ __name((graph, depth) => {
  if (depth > 10) {
    log.error("Bailing out");
    return;
  }
  let nodes = graph.nodes();
  let hasChildren = false;
  for (const node of nodes) {
    const children = graph.children(node);
    hasChildren = hasChildren || children.length > 0;
  }
  if (!hasChildren) {
    log.debug("Done, no node has children", graph.nodes());
    return;
  }
  log.debug("Nodes = ", nodes, depth);
  for (const node of nodes) {
    log.debug(
      "Extracting node",
      node,
      clusterDb,
      clusterDb.has(node) && !clusterDb.get(node).externalConnections,
      !graph.parent(node),
      graph.node(node),
      graph.children("D"),
      " Depth ",
      depth
    );
    if (!clusterDb.has(node)) {
      log.debug("Not a cluster", node, depth);
    } else if (!clusterDb.get(node).externalConnections && graph.children(node) && graph.children(node).length > 0) {
      log.debug(
        "Cluster without external connections, without a parent and with children",
        node,
        depth
      );
      const graphSettings = graph.graph();
      let dir = graphSettings.rankdir === "TB" ? "LR" : "TB";
      if (clusterDb.get(node)?.clusterData?.dir) {
        dir = clusterDb.get(node).clusterData.dir;
        log.debug("Fixing dir", clusterDb.get(node).clusterData.dir, dir);
      }
      const clusterGraph = new graphlib2.Graph({
        multigraph: true,
        compound: true
      }).setGraph({
        rankdir: dir,
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      copy(node, graph, clusterGraph, node);
      graph.setNode(node, {
        clusterNode: true,
        id: node,
        clusterData: clusterDb.get(node).clusterData,
        label: clusterDb.get(node).label,
        graph: clusterGraph
      });
    } else {
      log.debug(
        "Cluster ** ",
        node,
        " **not meeting the criteria !externalConnections:",
        !clusterDb.get(node).externalConnections,
        " no parent: ",
        !graph.parent(node),
        " children ",
        graph.children(node) && graph.children(node).length > 0,
        graph.children("D"),
        depth
      );
      log.debug(clusterDb);
    }
  }
  nodes = graph.nodes();
  log.debug("New list of nodes", nodes);
  for (const node of nodes) {
    const data = graph.node(node);
    log.debug(" Now next level", node, data);
    if (data?.clusterNode) {
      extractor(data.graph, depth + 1);
    }
  }
}, "extractor");
var sorter = /* @__PURE__ */ __name((graph, nodes) => {
  if (nodes.length === 0) {
    return [];
  }
  let result = Object.assign([], nodes);
  nodes.forEach((node) => {
    const children = graph.children(node);
    const sorted = sorter(graph, children);
    result = [...result, ...sorted];
  });
  return result;
}, "sorter");
var sortNodesByHierarchy = /* @__PURE__ */ __name((graph) => sorter(graph, graph.children()), "sortNodesByHierarchy");
var isNodeInExtractableCluster = /* @__PURE__ */ __name((graph, node, rootId) => {
  let parent = graph.parent(node);
  while (parent && parent !== rootId) {
    const cluster = clusterDb.get(parent);
    if (cluster && !cluster.externalConnections) {
      return true;
    }
    parent = graph.parent(parent);
  }
  return false;
}, "isNodeInExtractableCluster");
var findSafeAnchorNode = /* @__PURE__ */ __name((graph, clusterId, excludedCluster) => {
  const children = graph.children(clusterId) ?? [];
  for (const child of children) {
    if (child === excludedCluster || isDescendant(child, excludedCluster)) {
      continue;
    }
    const candidate = findNonClusterChild(child, graph, clusterId);
    if (!candidate) {
      continue;
    }
    if (!isNodeInExtractableCluster(graph, candidate, clusterId)) {
      return candidate;
    }
  }
  return null;
}, "findSafeAnchorNode");

// src/rendering-util/layout-algorithms/common/index.ts
function createCommonLayoutRenderer({
  prepareLayout,
  measureLayout,
  runLayoutCore,
  paintLayout,
  afterPaint,
  paintOptions
}) {
  const measureLayoutFn = measureLayout ?? defaultMeasureLayout;
  return /* @__PURE__ */ __name(async function render(data4Layout, svg, helpers, options) {
    const element = svg.select("g");
    (helpers?.insertMarkers ?? markers_default)(
      element,
      data4Layout.markers,
      data4Layout.type,
      data4Layout.diagramId
    );
    clearLayoutRenderState();
    const renderContext = {
      element,
      // root SVG <g>
      helpers,
      // Mermaid helper functions
      options
      // { algorithm: "elk.layered" }
    };
    renderContext.preparedLayout = false ? await profiler.span("prepare", () => prepareLayout?.(data4Layout, renderContext)) : await prepareLayout?.(data4Layout, renderContext);
    const measure = false ? await profiler.span("measure", () => measureLayoutFn(data4Layout, renderContext)) : await measureLayoutFn(data4Layout, renderContext);
    const coreResult = false ? await profiler.span("layout", () => runLayoutCore(data4Layout, renderContext)) : await runLayoutCore(data4Layout, renderContext);
    const paintContext = {
      ...renderContext,
      measure
    };
    if (false) {
      profiler.begin("paint");
    }
    if (paintLayout) {
      await paintLayout(data4Layout, paintContext, coreResult);
    } else {
      await paintLayoutData(
        data4Layout,
        paintContext,
        paintOptions
      );
    }
    await afterPaint?.(data4Layout, paintContext, coreResult);
    if (false) {
      profiler.end();
    }
  }, "render");
}
__name(createCommonLayoutRenderer, "createCommonLayoutRenderer");
function clearLayoutRenderState() {
  clear3();
  clear2();
  clear();
  clear4();
}
__name(clearLayoutRenderState, "clearLayoutRenderState");
async function defaultMeasureLayout(data4Layout, { element }) {
  return await createGraphWithElements(element, data4Layout);
}
__name(defaultMeasureLayout, "defaultMeasureLayout");
async function paintLayoutData(data4Layout, context, options = {}) {
  const { measure } = context;
  const { groups } = measure;
  for (const node of options.getNodes?.(data4Layout, context) ?? data4Layout.nodes) {
    if (options.skipNode?.(node, context)) {
      continue;
    }
    await paintLayoutNode(groups, node, context, options);
  }
  const nodeById = buildNodeLookup(data4Layout.nodes);
  for (const edge of data4Layout.edges) {
    if (shouldSkipPaintEdge(edge, options)) {
      continue;
    }
    await paintLayoutEdge(groups, edge, nodeById, data4Layout, options, context);
  }
}
__name(paintLayoutData, "paintLayoutData");
async function paintLayoutNode(groups, node, context, options) {
  if (node.clusterNode) {
    positionNode(node);
  } else if (shouldPaintAsCluster(node, context, options)) {
    await insertCluster(groups.clusters, node);
  } else {
    positionNode(node);
  }
}
__name(paintLayoutNode, "paintLayoutNode");
function shouldPaintAsCluster(node, context, options) {
  return node.isGroup === true && (options.isCluster?.(node, context) ?? true);
}
__name(shouldPaintAsCluster, "shouldPaintAsCluster");
function buildNodeLookup(nodes) {
  const nodeById = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    if (node?.id) {
      nodeById.set(node.id, node);
    }
  }
  return nodeById;
}
__name(buildNodeLookup, "buildNodeLookup");
function shouldSkipPaintEdge(edge, options) {
  return edge.isLayoutOnly || Boolean(options.skipEdge?.(edge));
}
__name(shouldSkipPaintEdge, "shouldSkipPaintEdge");
async function paintLayoutEdge(groups, edge, nodeById, data4Layout, options, context) {
  const paths = insertEdge(
    groups.edgePaths,
    { ...edge },
    options.clusterDb ?? /* @__PURE__ */ new Map(),
    data4Layout.type,
    getRenderedNode(edge.start, edge, nodeById, context, options),
    getRenderedNode(edge.end, edge, nodeById, context, options),
    data4Layout.diagramId,
    shouldSkipIntersect(edge, options)
  );
  if (hasEdgeLabel(edge)) {
    if (!edgeLabels.has(edge.id)) {
      await insertEdgeLabel(groups.edgeLabels, edge);
    }
    positionRenderedEdgeLabel(edge, paths);
  }
}
__name(paintLayoutEdge, "paintLayoutEdge");
function getRenderedNode(id, edge, nodeById, context, options) {
  return options.getEdgeNode?.(id, edge, context) ?? (id ? nodeById.get(id) ?? {} : {});
}
__name(getRenderedNode, "getRenderedNode");
function shouldSkipIntersect(edge, options) {
  return typeof options.skipIntersect === "function" ? options.skipIntersect(edge) : options.skipIntersect ?? false;
}
__name(shouldSkipIntersect, "shouldSkipIntersect");
function positionRenderedEdgeLabel(edge, paths) {
  const path = paths?.updatedPath ?? paths?.originalPath;
  const siteConfig = getConfig();
  const { subGraphTitleTotalMargin } = getSubGraphTitleMargins({
    flowchart: siteConfig.flowchart ?? {}
  });
  if (edge.label) {
    const el = edgeLabels.get(edge.id);
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = utils_default.calcLabelPosition(path);
      log.debug(
        "Moving label " + edge.label + " from (",
        x,
        ",",
        y,
        ") to (",
        pos.x,
        ",",
        pos.y,
        ") abc88"
      );
      if (paths?.updatedPath) {
        x = pos.x;
        y = pos.y;
      }
    }
    el.attr("transform", `translate(${x}, ${y + subGraphTitleTotalMargin / 2})`);
  }
  if (edge?.startLabelLeft) {
    const el = terminalLabels.get(edge.id).startLeft;
    let x = edge?.x;
    let y = edge?.y;
    if (path) {
      const pos = utils_default.calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_left", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.startLabelRight) {
    const el = terminalLabels.get(edge.id).startRight;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = utils_default.calcTerminalLabelPosition(
        edge.arrowTypeStart ? 10 : 0,
        "start_right",
        path
      );
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.endLabelLeft) {
    const el = terminalLabels.get(edge.id).endLeft;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = utils_default.calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_left", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
  if (edge.endLabelRight) {
    const el = terminalLabels.get(edge.id).endRight;
    let x = edge.x;
    let y = edge.y;
    if (path) {
      const pos = utils_default.calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_right", path);
      x = pos.x;
      y = pos.y;
    }
    el.attr("transform", `translate(${x}, ${y})`);
  }
}
__name(positionRenderedEdgeLabel, "positionRenderedEdgeLabel");

export {
  createLayoutElementGroups,
  insertMeasuredNode,
  clusterDb,
  findNonClusterChild,
  adjustClustersAndEdges,
  sortNodesByHierarchy,
  createCommonLayoutRenderer,
  clearLayoutRenderState,
  defaultMeasureLayout,
  paintLayoutData
};
