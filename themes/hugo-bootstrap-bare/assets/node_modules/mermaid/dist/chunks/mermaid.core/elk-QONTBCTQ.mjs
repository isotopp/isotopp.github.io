import {
  applyLineJumpsToSvg
} from "./chunk-4EMNKR2T.mjs";
import {
  createCommonLayoutRenderer,
  defaultMeasureLayout
} from "./chunk-ZCHMQSOR.mjs";
import {
  clusterPaintsTitle
} from "./chunk-HNE4Q36P.mjs";
import {
  markerOffsets,
  markerOffsets2
} from "./chunk-WQQL4CDK.mjs";
import "./chunk-ZAUX2LTX.mjs";
import "./chunk-HAGFOTED.mjs";
import "./chunk-UHW7PFBP.mjs";
import "./chunk-AQDTSKZB.mjs";
import "./chunk-YZO67HFG.mjs";
import "./chunk-J5ZVWO5B.mjs";
import "./chunk-7S6XSTFO.mjs";
import {
  setConfig2 as setConfig
} from "./chunk-DSNLSHJZ.mjs";
import "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/rendering-util/layout-algorithms/elk/render.ts
import { curveLinear } from "d3";
import ELK from "elkjs/lib/elk.bundled.js";

// src/rendering-util/layout-algorithms/elk/find-common-ancestor.ts
var findCommonAncestor = /* @__PURE__ */ __name((id1, id2, { parentById }) => {
  const visited = /* @__PURE__ */ new Set();
  let currentId = id1;
  if (id1 === id2) {
    return parentById[id1] || "root";
  }
  while (currentId) {
    visited.add(currentId);
    if (currentId === id2) {
      return currentId;
    }
    currentId = parentById[currentId];
  }
  currentId = id2;
  while (currentId) {
    if (visited.has(currentId)) {
      return currentId;
    }
    currentId = parentById[currentId];
  }
  return "root";
}, "findCommonAncestor");

// src/rendering-util/layout-algorithms/elk/subgraphFeedbackEdges.ts
var ROOT = "root";
function childOnPath(id, ancestorId, { parentById }) {
  let current = id;
  while ((parentById[current] ?? ROOT) !== ancestorId) {
    current = parentById[current];
  }
  return current;
}
__name(childOnPath, "childOnPath");
function findSubgraphFeedbackEdges(edges, tree) {
  const flags = edges.map(() => false);
  const levels = /* @__PURE__ */ new Map();
  edges.forEach(({ source, target }, index) => {
    if (source === target) {
      return;
    }
    const ancestor = findCommonAncestor(source, target, tree);
    if (ancestor === source || ancestor === target) {
      return;
    }
    const from = childOnPath(source, ancestor, tree);
    const to = childOnPath(target, ancestor, tree);
    const level = levels.get(ancestor) ?? [];
    level.push({ index, from, to, collapsed: from !== source || to !== target });
    levels.set(ancestor, level);
  });
  for (const level of levels.values()) {
    const successors = /* @__PURE__ */ new Map();
    const nodes = [];
    const inDegree = /* @__PURE__ */ new Map();
    for (const edge of level) {
      for (const node of [edge.from, edge.to]) {
        if (!successors.has(node)) {
          successors.set(node, []);
          nodes.push(node);
          inDegree.set(node, 0);
        }
      }
      successors.get(edge.from).push(edge);
      inDegree.set(edge.to, inDegree.get(edge.to) + 1);
    }
    const ON_STACK = 1;
    const DONE = 2;
    const state = /* @__PURE__ */ new Map();
    const roots = [...nodes.filter((node) => inDegree.get(node) === 0), ...nodes];
    for (const root of roots) {
      if (state.has(root)) {
        continue;
      }
      state.set(root, ON_STACK);
      const stack = [{ node: root, next: 0 }];
      while (stack.length > 0) {
        const frame = stack[stack.length - 1];
        const out = successors.get(frame.node);
        if (frame.next >= out.length) {
          state.set(frame.node, DONE);
          stack.pop();
          continue;
        }
        const edge = out[frame.next++];
        const seen = state.get(edge.to);
        if (seen === ON_STACK) {
          flags[edge.index] = edge.collapsed;
        } else if (seen === void 0) {
          state.set(edge.to, ON_STACK);
          stack.push({ node: edge.to, next: 0 });
        }
      }
    }
  }
  return flags;
}
__name(findSubgraphFeedbackEdges, "findSubgraphFeedbackEdges");

// src/rendering-util/layout-algorithms/elk/lineHops.ts
var JUMP_RADIUS = 6;
function applyElkLineJumps(data4Layout, { measure }) {
  const lineHops = data4Layout.config?.elk?.lineHops;
  if (lineHops === false) {
    return;
  }
  const edgeGeometries = data4Layout.edges.filter(
    (edge) => Array.isArray(edge.points) && edge.points.length >= 2
  ).map((edge) => ({
    id: edge.id,
    points: edge.points,
    curve: edge.curve,
    arrowTypeStart: edge.arrowTypeStart,
    arrowTypeEnd: edge.arrowTypeEnd
  }));
  applyLineJumpsToSvg(measure.groups.edgePaths, edgeGeometries, {
    enabled: true,
    jumpRadius: JUMP_RADIUS,
    jumpStyle: lineHops === "gap" ? "gap" : "arc"
  });
}
__name(applyElkLineJumps, "applyElkLineJumps");

// src/rendering-util/layout-algorithms/elk/elkOptionCatalogue.ts
var PLACEMENT_OPTIONS = {
  // ─── Layering — which layer a node lands in (the column in LR, row in TB) ───
  // Coarsest placement decision there is; relocates 38-48% of nodes.
  // 'elk.layered.layering.strategy': 'COFFMAN_GRAHAM',
  // 'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',      // ELK default: fewest long edges *
  // 'elk.layered.layering.strategy': 'LONGEST_PATH',         // every node as late as possible
  // 'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE',  // same, measured from sources
  // 'elk.layered.layering.strategy': 'MIN_WIDTH',            // narrower drawing, longer edges
  // 'elk.layered.layering.strategy': 'STRETCH_WIDTH',        // wider drawing, shorter edges
  // 'elk.layered.layering.strategy': 'INTERACTIVE',          // honours positions already on nodes
  // Cap on how many nodes COFFMAN_GRAHAM puts in one layer; ignored by the rest.
  // 'elk.layered.layering.coffmanGraham.layerBound': 2,
  // 'elk.layered.layering.coffmanGraham.layerBound': 4,      // ELK default; taller and narrower
  // Pulls nodes into earlier layers to cut dummy nodes on long edges.
  // 'elk.layered.layering.nodePromotion.strategy': 'NONE',   // ELK default
  // 'elk.layered.layering.nodePromotion.strategy': 'NIKOLOV',
  // 'elk.layered.layering.nodePromotion.strategy': 'NIKOLOV_PIXEL',
  // 'elk.layered.layering.nodePromotion.strategy': 'NIKOLOV_IMPROVED',
  // 'elk.layered.layering.nodePromotion.strategy': 'NIKOLOV_IMPROVED_PIXEL',
  // 'elk.layered.layering.nodePromotion.strategy': 'DUMMYNODE_PERCENTAGE',
  // 'elk.layered.layering.nodePromotion.strategy': 'NODECOUNT_PERCENTAGE',
  // 'elk.layered.layering.nodePromotion.strategy': 'NO_BOUNDARY',
  // ─── Crossing minimisation — the order of nodes within a layer ───
  // How node order inside each layer is chosen.
  // 'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',  // ELK default
  //'elk.layered.crossingMinimization.strategy': 'INTERACTIVE',  // keeps existing order
  // 'elk.layered.crossingMinimization.strategy': 'NONE',         // declaration order, no sweep
  // Extra pass that swaps adjacent node pairs when it removes crossings.
  // 'elk.layered.crossingMinimization.greedySwitch.type': 'TWO_SIDED',  // ELK default
  // 'elk.layered.crossingMinimization.greedySwitch.type': 'ONE_SIDED',
  // 'elk.layered.crossingMinimization.greedySwitch.type': 'OFF',
  // How hard declaration order is defended against crossing reduction.
  // 'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
  // 'elk.layered.considerModelOrder.strategy': 'NONE',          // ignore declaration order
  // 'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',  // order edges, let nodes move
  // 'elk.layered.considerModelOrder.strategy': 'PREFER_NODES',  // order nodes, let edges move
  // ─── Node placement — the coordinate within the layer ───
  // Wired to `elk.nodePlacementStrategy`; uncomment to override that config.
  // 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',  // balanced; root under modelOrder/depthFirst
  // 'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',    // ELK default and ours: straight long edges
  // 'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',  // keeps chains aligned
  // 'elk.layered.nodePlacement.strategy': 'SIMPLE',           // cheapest, least tidy
  // Shifts nodes to straighten edges rather than centre them in the layer.
  // 'elk.layered.nodePlacement.favorStraightEdges': true,
  // 'elk.layered.nodePlacement.favorStraightEdges': false,
  // Brandes-Koepf only: which of its four candidate alignments to keep.
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'NONE',      // pick the shortest result; named presets
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',  // average all four; default preset
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'LEFTUP',
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'RIGHTUP',
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'LEFTDOWN',
  // 'elk.layered.nodePlacement.bk.fixedAlignment': 'RIGHTDOWN',
  // Brandes-Koepf only: post-pass that trades compactness for straighter edges.
  // 'elk.layered.nodePlacement.bk.edgeStraightening': 'IMPROVE_STRAIGHTNESS',
  // 'elk.layered.nodePlacement.bk.edgeStraightening': 'NONE',   // ELK default
  // Network-simplex only: what the placer is allowed to stretch to straighten edges.
  // 'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'NONE',  // ELK default
  // 'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'NODE_SIZE',
  // 'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'PORT_POSITION',
  // 'elk.layered.nodePlacement.networkSimplex.nodeFlexibility': 'NODE_SIZE_WHERE_SPACE_PERMITS',
  // ─── Cycles and hierarchy ───
  // Which edges get reversed to make the graph acyclic; decides which ones detour.
  // Wired to `elk.cycleBreakingStrategy`; uncomment to override that config.
  // 'elk.layered.cycleBreaking.strategy': 'GREEDY_MODEL_ORDER',  // our default
  // 'elk.layered.cycleBreaking.strategy': 'GREEDY',              // ELK default; short back edges, +20% total
  // 'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',         // middle ground, +6% total
  // 'elk.layered.cycleBreaking.strategy': 'MODEL_ORDER',         // reverse purely by declaration order
  // 'elk.layered.cycleBreaking.strategy': 'INTERACTIVE',         // reverse by existing positions
  // Whether subgraphs are laid out with the parent or in their own coordinate system.
  // 'elk.hierarchyHandling': 'INCLUDE_CHILDREN',   // our default, one global pass
  // 'elk.hierarchyHandling': 'SEPARATE_CHILDREN',  // shorter edges, far more constraint violations
  // Post-pass that pulls nodes back towards one side to reclaim space.
  // 'elk.layered.compaction.postCompaction.strategy': 'NONE',   // ELK default
  // 'elk.layered.compaction.postCompaction.strategy': 'LEFT',
  // 'elk.layered.compaction.postCompaction.strategy': 'RIGHT',
  // 'elk.layered.compaction.postCompaction.strategy': 'LEFT_RIGHT_CONSTRAINT_LOCKING',
  // 'elk.layered.compaction.postCompaction.strategy': 'LEFT_RIGHT_CONNECTION_LOCKING',
  // 'elk.layered.compaction.postCompaction.strategy': 'EDGE_LENGTH',
  // ─── Spacing and labels ───
  // Base spacing everything else derives from; the single biggest lever on size.
  // 'spacing.baseValue': 40,
  // 'spacing.baseValue': 20,   // ELK default — collapses this corpus, 13/14 invalid
  // Where a container's own title sits inside its frame.
  // 'nodeLabels.placement': '[H_CENTER V_TOP, INSIDE]',
  // ─── Measured inert on this corpus — a null result here means nothing ───
  // Overwritten straight after createRootElkGraph by the diagram's own direction.
  // 'elk.direction': 'UP',
  // ELK ignores this key in every spelling; the gap derives from spacing.baseValue.
  // 'elk.spacing.edgeNode': 20,
  // Only applies when wrapping.strategy is on, and it is off.
  // 'elk.layered.wrapping.cutting.strategy': 'ARD',
  // Routes reversed edges in their own band. No effect measured here.
  // 'elk.layered.feedbackEdges': true,
  // ─── Tried and parked ───
  // 'elk.layered.wrapping.strategy': 'MULTI_EDGE',
  // 'elk.layered.wrapping.strategy': 'SINGLE_EDGE',
  // 'elk.layered.crossingMinimization.semiInteractive': true,
  // 'elk.layered.edgeRouting.splines.sloppy.layerSpacingFactor': 1,
  // 'elk.layered.edgeRouting.polyline.slopedEdgeZoneWidth': 4.0,
  // 'elk.layered.wrapping.validify.strategy': 'LOOK_BACK',
  // 'elk.insideSelfLoops.activate': true,
  // 'elk.separateConnectedComponents': true,
  // 'elk.alignment': 'LEFT',
};
var EDGE_ROUTING_OPTIONS = {
  // Shape of every edge. ORTHOGONAL is ELK's default and what the adapter expects.
  // 'elk.edgeRouting': 'ORTHOGONAL',
  // 'elk.edgeRouting': 'POLYLINE',   // diagonal runs, fewer bends
  // 'elk.edgeRouting': 'SPLINES',    // curved; validateLayout treats these as non-orthogonal
  // 'elk.edgeRouting': 'UNDEFINED',  // let the algorithm decide
  // Drops bends that do not change the path. Already on in the literal below.
  // 'elk.layered.unnecessaryBendpoints': true,
  // 'elk.layered.unnecessaryBendpoints': false,
  // Routes reversed edges in their own band instead of among the forward ones.
  // The obvious candidate for a back-edge detour — measured inert on this corpus.
  // 'elk.layered.feedbackEdges': true,
  // 'elk.layered.feedbackEdges': false,
  // Lets edges that meet at a node share a trunk. Collapses arriving and leaving
  // onto ONE handle, which can imply a connection that does not exist.
  // 'elk.layered.mergeEdges': true,
  // 'elk.layered.mergeEdges': false,
  // Same, for edges that cross a subgraph boundary. On in the literal below.
  // 'elk.layered.mergeHierarchyEdges': true,
  // 'elk.layered.mergeHierarchyEdges': false,
  // How much straightening an edge is worth relative to other objectives.
  // Also settable per edge, which is the targeted way to rescue one bad route.
  // 'elk.layered.priority.straightness': 0,
  // 'elk.layered.priority.shortness': 0,
  // 'elk.layered.priority.direction': 1,
  // ─── Self loops ───
  // Which sides a node's self loops are spread across. EQUALLY ships below.
  // 'elk.layered.edgeRouting.selfLoopDistribution': 'EQUALLY',
  // 'elk.layered.edgeRouting.selfLoopDistribution': 'NORTH',
  // 'elk.layered.edgeRouting.selfLoopDistribution': 'NORTH_SOUTH',
  // Whether stacked self loops nest or sit side by side.
  // 'elk.layered.edgeRouting.selfLoopOrdering': 'STACKED',
  // 'elk.layered.edgeRouting.selfLoopOrdering': 'SEQUENCED',
  // Draw self loops inside the node rather than hanging off it.
  // 'elk.insideSelfLoops.activate': true,
  // ─── Spline and polyline tuning (only read by the matching edgeRouting) ───
  // How closely splines hug the orthogonal path they replace.
  // 'elk.layered.edgeRouting.splines.mode': 'CONSERVATIVE',
  // 'elk.layered.edgeRouting.splines.mode': 'CONSERVATIVE_SOFT',
  // 'elk.layered.edgeRouting.splines.mode': 'SLOPPY',
  // 'elk.layered.edgeRouting.splines.sloppy.layerSpacingFactor': 1,
  // Width of the band a POLYLINE edge may slope through.
  // (Was left uncommented while this block was inert; commented now that it is
  // live, since it would otherwise be permanently on for every diagram.)
  // 'elk.layered.edgeRouting.polyline.slopedEdgeZoneWidth': 4.0,
  // ─── Lanes and clearance ───
  // Gap between two edges sharing a lane; too small trips the proximity checks.
  // 'spacing.edgeEdge': 10,
  // 'elk.layered.spacing.edgeEdgeBetweenLayers': 20,
  // Gap between an edge and a node it passes. Ignored at root; the subgraph
  // value derives from `spacing.baseValue` at roughly half.
  // 'spacing.edgeNode': 20,
  // 'elk.layered.spacing.edgeNodeBetweenLayers': 80,
  // ─── Edge labels ───
  // Which side of its edge a label sits on.
  // 'elk.layered.edgeLabels.sideSelection': 'SMART_DOWN',
  // 'elk.layered.edgeLabels.sideSelection': 'SMART_UP',
  // 'elk.layered.edgeLabels.sideSelection': 'ALWAYS_UP',
  // 'elk.layered.edgeLabels.sideSelection': 'ALWAYS_DOWN',
  // 'elk.layered.edgeLabels.sideSelection': 'DIRECTION_UP',
  // 'elk.layered.edgeLabels.sideSelection': 'DIRECTION_DOWN',
  // Which layer a centre label is parked in when the edge spans several.
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'MEDIAN_LAYER',
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'HEAD_LAYER',
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'TAIL_LAYER',
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'SPACE_EFFICIENT_LAYER',
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'WIDEST_LAYER',
  // 'elk.layered.edgeLabels.centerLabelPlacementStrategy': 'CENTER_LAYER',
};
var ROOT_EXPERIMENT_OVERRIDES = {
  // 'elk.layered.layering.strategy': 'COFFMAN_GRAHAM',
  // 'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
  // 'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
  // 'elk.edgeRouting': 'POLYLINE',
  // 'spacing.baseValue': 60,
};
var SUBGRAPH_EXPERIMENT_OVERRIDES = {
  // 'spacing.nodeNode': 60,
  // 'elk.spacing.edgeEdge': 10,
  // 'elk.layered.spacing.edgeNodeBetweenLayers': 80,
  // 'elk.padding': '[top=24,left=24,bottom=24,right=24]',
  // 'nodeLabels.placement': '[H_CENTER V_TOP, INSIDE]',
  // Equal-width subgraph frames. Tried and DOES NOT WORK: the options reach
  // ELK intact, but every container is forced back to INCLUDE_CHILDREN by
  // `setIncludeChildrenPolicy` (cross-boundary edges), and in that mode ELK
  // sizes a compound node to its contents and ignores the minimum.
  // 'nodeSize.constraints': '[MINIMUM_SIZE]',
  // 'nodeSize.minimum': '(446, 0)',
};

// src/rendering-util/layout-algorithms/elk/geometry.ts
var EPS = 1;
var PUSH_OUT = 10;
var onBorder = /* @__PURE__ */ __name((bounds, p, tol = 0.5) => {
  const halfW = bounds.width / 2;
  const halfH = bounds.height / 2;
  const left = bounds.x - halfW;
  const right = bounds.x + halfW;
  const top = bounds.y - halfH;
  const bottom = bounds.y + halfH;
  const onLeft = Math.abs(p.x - left) <= tol && p.y >= top - tol && p.y <= bottom + tol;
  const onRight = Math.abs(p.x - right) <= tol && p.y >= top - tol && p.y <= bottom + tol;
  const onTop = Math.abs(p.y - top) <= tol && p.x >= left - tol && p.x <= right + tol;
  const onBottom = Math.abs(p.y - bottom) <= tol && p.x >= left - tol && p.x <= right + tol;
  return onLeft || onRight || onTop || onBottom;
}, "onBorder");
var intersection = /* @__PURE__ */ __name((node, outsidePoint, insidePoint) => {
  const x = node.x;
  const y = node.y;
  const dx = Math.abs(x - insidePoint.x);
  const w = node.width / 2;
  let r = insidePoint.x < outsidePoint.x ? w - dx : w + dx;
  const h = node.height / 2;
  const Q = Math.abs(outsidePoint.y - insidePoint.y);
  const R = Math.abs(outsidePoint.x - insidePoint.x);
  if (Math.abs(y - outsidePoint.y) * w > Math.abs(x - outsidePoint.x) * h) {
    const q = insidePoint.y < outsidePoint.y ? outsidePoint.y - h - y : y - h - outsidePoint.y;
    r = R * q / Q;
    const res = {
      x: insidePoint.x < outsidePoint.x ? insidePoint.x + r : insidePoint.x - R + r,
      y: insidePoint.y < outsidePoint.y ? insidePoint.y + Q - q : insidePoint.y - Q + q
    };
    if (R === 0) {
      res.x = outsidePoint.x;
    }
    if (Q === 0) {
      res.y = outsidePoint.y;
    }
    return res;
  } else {
    if (insidePoint.x < outsidePoint.x) {
      r = outsidePoint.x - w - x;
    } else {
      r = x - w - outsidePoint.x;
    }
    const q = Q * r / R;
    let _x = insidePoint.x < outsidePoint.x ? insidePoint.x + R - r : insidePoint.x - R + r;
    let _y = insidePoint.y < outsidePoint.y ? insidePoint.y + q : insidePoint.y - q;
    if (R === 0) {
      _x = outsidePoint.x;
    }
    if (Q === 0) {
      _y = outsidePoint.y;
    }
    return { x: _x, y: _y };
  }
}, "intersection");
var outsideNode = /* @__PURE__ */ __name((node, point) => {
  const x = node.x;
  const y = node.y;
  const dx = Math.abs(point.x - x);
  const dy = Math.abs(point.y - y);
  const w = node.width / 2;
  const h = node.height / 2;
  return dx >= w || dy >= h;
}, "outsideNode");
var ensureTrulyOutside = /* @__PURE__ */ __name((bounds, p, push = PUSH_OUT) => {
  const dx = Math.abs(p.x - bounds.x);
  const dy = Math.abs(p.y - bounds.y);
  const w = bounds.width / 2;
  const h = bounds.height / 2;
  if (Math.abs(dx - w) < EPS || Math.abs(dy - h) < EPS) {
    const dirX = p.x - bounds.x;
    const dirY = p.y - bounds.y;
    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len > 0) {
      return {
        x: bounds.x + dirX / len * (len + push),
        y: bounds.y + dirY / len * (len + push)
      };
    }
  }
  return p;
}, "ensureTrulyOutside");
var makeInsidePoint = /* @__PURE__ */ __name((bounds, outside, center) => {
  const isVertical = Math.abs(outside.x - bounds.x) < EPS;
  const isHorizontal = Math.abs(outside.y - bounds.y) < EPS;
  return {
    x: isVertical ? outside.x : outside.x < bounds.x ? bounds.x - bounds.width / 4 : bounds.x + bounds.width / 4,
    y: isHorizontal ? outside.y : center.y
  };
}, "makeInsidePoint");
var tryNodeIntersect = /* @__PURE__ */ __name((node, bounds, outside) => {
  if (!node?.intersect) {
    return null;
  }
  const res = node.intersect(outside);
  if (!res) {
    return null;
  }
  const wrongSide = outside.x < bounds.x && res.x > bounds.x || outside.x > bounds.x && res.x < bounds.x;
  if (wrongSide) {
    return null;
  }
  const dist = Math.hypot(outside.x - res.x, outside.y - res.y);
  if (dist <= EPS) {
    return null;
  }
  return res;
}, "tryNodeIntersect");
var fallbackIntersection = /* @__PURE__ */ __name((bounds, outside, center) => {
  const inside = makeInsidePoint(bounds, outside, center);
  return intersection(bounds, outside, inside);
}, "fallbackIntersection");
var OUTLINE_RAY_STEPS = 20;
var DEPARTURE_AXIS_EPS = 1e-6;
var insideOutline = /* @__PURE__ */ __name((node, centre, probe) => {
  const crossing = node.intersect?.(probe);
  if (!crossing) {
    return false;
  }
  const probeDist = Math.hypot(probe.x - centre.x, probe.y - centre.y);
  const outlineDist = Math.hypot(crossing.x - centre.x, crossing.y - centre.y);
  return probeDist <= outlineDist + 1e-9;
}, "insideOutline");
var outlineAttachPoint = /* @__PURE__ */ __name((node, bounds, port, next) => {
  if (!node?.intersect) {
    return null;
  }
  const dx = next.x - port.x;
  const dy = next.y - port.y;
  if (dx === 0 && dy === 0) {
    return null;
  }
  if (Math.abs(dx) > DEPARTURE_AXIS_EPS && Math.abs(dy) > DEPARTURE_AXIS_EPS) {
    return null;
  }
  const centre = { x: bounds.x, y: bounds.y };
  const horizontal = Math.abs(dx) > Math.abs(dy);
  const along = /* @__PURE__ */ __name((t) => horizontal ? { x: t, y: port.y } : { x: port.x, y: t }, "along");
  let inner = horizontal ? centre.x : centre.y;
  let outer = horizontal ? port.x : port.y;
  if (!insideOutline(node, centre, along(inner))) {
    return null;
  }
  if (insideOutline(node, centre, along(outer))) {
    return { ...port };
  }
  for (let step = 0; step < OUTLINE_RAY_STEPS; step++) {
    const mid = (inner + outer) / 2;
    if (insideOutline(node, centre, along(mid))) {
      inner = mid;
    } else {
      outer = mid;
    }
  }
  return along(inner);
}, "outlineAttachPoint");
var computeNodeIntersection = /* @__PURE__ */ __name((node, bounds, outside, center) => {
  const outside2 = ensureTrulyOutside(bounds, outside);
  return tryNodeIntersect(node, bounds, outside2) ?? fallbackIntersection(bounds, outside2, center);
}, "computeNodeIntersection");
var replaceEndpoint = /* @__PURE__ */ __name((points, which, value, tol = 0.1) => {
  if (!value || points.length === 0) {
    return;
  }
  if (which === "start") {
    if (points.length > 0 && Math.abs(points[0].x - value.x) < tol && Math.abs(points[0].y - value.y) < tol) {
      points.shift();
    } else {
      points[0] = value;
    }
  } else {
    const last = points.length - 1;
    if (points.length > 0 && Math.abs(points[last].x - value.x) < tol && Math.abs(points[last].y - value.y) < tol) {
      points.pop();
    } else {
      points[last] = value;
    }
  }
}, "replaceEndpoint");

// src/rendering-util/layout-algorithms/elk/render.ts
var MIN_END_MARKER_SEGMENT_LENGTH = 8;
var markerPathOffset = /* @__PURE__ */ __name((arrowType) => {
  if (typeof arrowType !== "string") {
    return 0;
  }
  return Math.max(
    markerOffsets[arrowType] ?? 0,
    markerOffsets2[arrowType] ?? 0
  );
}, "markerPathOffset");
var ARROW_MAP = {
  arrow_open: ["none", "none"],
  arrow_cross: ["none", "arrow_cross"],
  double_arrow_cross: ["arrow_cross", "arrow_cross"],
  arrow_point: ["none", "arrow_point"],
  double_arrow_point: ["arrow_point", "arrow_point"],
  arrow_circle: ["none", "arrow_circle"],
  double_arrow_circle: ["arrow_circle", "arrow_circle"]
};
var PORTS_SURROUNDING_MARGIN = 12;
var PORTS_SURROUNDING = `[top=${PORTS_SURROUNDING_MARGIN},left=${PORTS_SURROUNDING_MARGIN},bottom=${PORTS_SURROUNDING_MARGIN},right=${PORTS_SURROUNDING_MARGIN}]`;
var SUBGRAPH_PADDING = 24;
var DEFAULT_SUBGRAPH_SPACING_BASE_VALUE = 24;
var DEFAULT_SUBGRAPH_NODE_SPACING = 50;
var CONTAINER_PADDING = 15;
var RECTPACKING_CONTAINER_PADDING = 10;
var RECTPACKING_OPTIONS = {
  "spacing.baseValue": 15,
  "spacing.nodeNode": 15,
  "elk.aspectRatio": "1.6",
  "elk.expandNodes": "true",
  "elk.rectpacking.trybox": "true",
  "elk.rectpacking.packing.compaction.rowHeightReevaluation": "true",
  "elk.rectpacking.packing.compaction.iterations": 10,
  "elk.rectpacking.whiteSpaceElimination.strategy": "EQUAL_BETWEEN_STRUCTURES",
  "elk.rectpacking.widthApproximation.strategy": "SCANLINE"
};
var CONTAINER_ALGORITHM_OVERRIDES = [
  "nodeSize.constraints",
  "nodeSize.minimum",
  "elk.algorithm",
  "elk.aspectRatio",
  "elk.contentAlignment",
  "elk.expandNodes",
  "elk.padding",
  ...Object.keys(RECTPACKING_OPTIONS)
];
function clearContainerAlgorithmOptions(layoutOptions) {
  for (const key of CONTAINER_ALGORITHM_OVERRIDES) {
    delete layoutOptions[key];
  }
  layoutOptions["spacing.baseValue"] = DEFAULT_SUBGRAPH_SPACING_BASE_VALUE;
  layoutOptions["spacing.nodeNode"] = DEFAULT_SUBGRAPH_NODE_SPACING;
}
__name(clearContainerAlgorithmOptions, "clearContainerAlgorithmOptions");
var CONTAINER_ALGORITHMS = /* @__PURE__ */ new Set([
  "elk.layered",
  "elk.box",
  "elk.rectpacking",
  "elk.stress",
  "elk.force",
  "elk.mrtree",
  "elk.radial",
  "elk.sporeOverlap"
]);
function resolveContainerAlgorithm(requested, log) {
  if (typeof requested !== "string") {
    return void 0;
  }
  if (!CONTAINER_ALGORITHMS.has(requested)) {
    log?.warn(
      `Unknown container layout algorithm "${requested}". Supported values: ${[...CONTAINER_ALGORITHMS].join(", ")}. Falling back to the diagram's layout algorithm.`
    );
    return void 0;
  }
  return requested;
}
__name(resolveContainerAlgorithm, "resolveContainerAlgorithm");
function dir2ElkDirection(dir) {
  switch (dir) {
    case "LR":
      return "RIGHT";
    case "RL":
      return "LEFT";
    case "TB":
    case "TD":
      return "DOWN";
    case "BT":
      return "UP";
    default:
      return "DOWN";
  }
}
__name(dir2ElkDirection, "dir2ElkDirection");
function groupTitleWidth(node) {
  if (!clusterPaintsTitle(node.shape)) {
    return 0;
  }
  return (node.labelData?.width ?? node.labels?.[0]?.width ?? 0) + (node.padding ?? 0);
}
__name(groupTitleWidth, "groupTitleWidth");
function groupTitleSizeOptions(node) {
  if (!clusterPaintsTitle(node.shape)) {
    return {};
  }
  return {
    "nodeSize.constraints": "[MINIMUM_SIZE, NODE_LABELS]",
    "nodeSize.minimum": `(${groupTitleWidth(node)}, 0)`
  };
}
__name(groupTitleSizeOptions, "groupTitleSizeOptions");
function buildSubgraphLayoutOptions(node, elkConfig, algorithm, log) {
  const labelW = node.labelData?.width ?? 0;
  const pad = node.padding ?? 0;
  const minWidth = labelW + 2 * pad;
  const labelH = node.labelData?.height ?? 0;
  const preset = resolveElkPreset(elkConfig?.preset);
  const layoutOptions = {
    // Reserve the painted title width before routing. Enlarging a frame after
    // ELK has placed its ports leaves those ports inside the painted border.
    ...groupTitleSizeOptions(node),
    "spacing.baseValue": DEFAULT_SUBGRAPH_SPACING_BASE_VALUE,
    // The straight run an edge gets before the node it enters, bought on its
    // own rather than out of `spacing.baseValue` — see the note there. This is
    // the layered-scoped key; the unscoped `spacing.edgeNodeBetweenLayers` is
    // not an ELK id at all and setting it does nothing.
    //
    // 30, which is where the approach run stops improving: 40 measured the same
    // 30px shortest approach and only widened the lane this value also pays
    // for. That lane used to be the reason to go lower — the value is charged
    // TWICE against a group with an edge routed inside its frame, once between
    // the nodes and the lane and again between the lane and the frame, so the
    // group's extra width came out at exactly `36 + 2x`. `evenGroupFrames` now
    // pulls the frame in past the lane regardless, so a wider lane no longer
    // shows as lopsided padding and the only cost left is overall diagram size.
    //
    // Do NOT lower it further on that reasoning. Over the DDLT corpus this is
    // not monotonic: 30 and 40 leave one fixture invalid (the deliberate
    // merge-edge counterexample), while 20 leaves two and 25 leaves three —
    // `right-angles-not-curves` starts tripping `edge-parallel-segment-too-close`
    // because this spacing also separates edges running alongside each other in
    // the layer gap. 30 is the lowest value that keeps the corpus clean.
    "elk.layered.spacing.edgeNodeBetweenLayers": 30,
    // Separation between edges sharing a lane. Also raised off the base value,
    // so that lowering the base does not leave parallel edges touching.
    "elk.spacing.edgeEdge": 20,
    // Node separation, likewise bought on its own — see the note on the constant.
    "spacing.nodeNode": DEFAULT_SUBGRAPH_NODE_SPACING,
    // Breathing room between a frame and its children. Set explicitly rather
    // than left to ELK's default of 12. The top gets the same value as the
    // rest: ELK reserves the subgraph's own title strip on top of whatever is
    // given here, so adding the label height again double-counts it.
    "elk.padding": `[top=${SUBGRAPH_PADDING},left=${SUBGRAPH_PADDING},bottom=${SUBGRAPH_PADDING},right=${SUBGRAPH_PADDING}]`,
    "nodeLabels.placement": "[H_CENTER V_TOP, INSIDE]",
    "elk.layered.mergeEdges": elkConfig?.mergeEdges,
    "elk.layered.nodePlacement.bk.fixedAlignment": elkConfig?.nodePlacementAlignment ?? preset.alignment,
    // The preset resolves child placement separately from root placement.
    // Named presets retain their previous strategies; explicit options win.
    //
    // ONE key, fully qualified. ELK reads `nodePlacement.strategy` and
    // `elk.layered.nodePlacement.strategy` as the same option, so listing both
    // — as this did — leaves the container holding two values for it with no
    // say in which wins, and quietly ignores an explicit `nodePlacementStrategy`.
    "elk.layered.nodePlacement.strategy": elkConfig?.nodePlacementStrategy ?? preset.containerPlacement,
    // Resolved here as well as at the root, because a container laid out on its
    // own never sees the root's value and falls back to ELK's default, GREEDY.
    // That reverses a different edge than the preset asked for, so a composite
    // containing a loop opens on whichever node greedy promoted to a source
    // rather than on its own start node. Same key and same resolution as the
    // root, so `legacy` reproduces the old rendering inside frames too.
    "elk.layered.cycleBreaking.strategy": elkConfig?.cycleBreakingStrategy ?? preset.cycleBreaking,
    // PORT_POSITION lets a node shift so an edge can leave straight rather than
    // bending immediately off the port.
    "elk.layered.nodePlacement.networkSimplex.nodeFlexibility": "PORT_POSITION",
    // Keep a frame's ports off its own corners. See the note in
    // `createRootElkGraph`; a container is where this bites hardest, because a
    // cross-boundary edge attaches to the frame rather than to a node inside it.
    "elk.spacing.portsSurrounding": PORTS_SURROUNDING
  };
  const algo = resolveContainerAlgorithm(node.metadata?.algorithm, log);
  if (algo) {
    const padTop = labelH + CONTAINER_PADDING;
    layoutOptions["nodeSize.constraints"] = "[MINIMUM_SIZE, NODE_LABELS]";
    layoutOptions["nodeSize.minimum"] = `(${minWidth}, ${padTop + CONTAINER_PADDING})`;
    layoutOptions["elk.algorithm"] = algo;
    layoutOptions["elk.hierarchyHandling"] = "SEPARATE_CHILDREN";
    layoutOptions["elk.aspectRatio"] = "2.0";
    layoutOptions["elk.contentAlignment"] = "H_CENTER V_TOP";
    layoutOptions["elk.expandNodes"] = "true";
    layoutOptions["elk.padding"] = `[top=${padTop},left=${CONTAINER_PADDING},bottom=${CONTAINER_PADDING},right=${CONTAINER_PADDING}]`;
    if (algo === "elk.rectpacking") {
      const rectPadTop = labelH + RECTPACKING_CONTAINER_PADDING;
      Object.assign(layoutOptions, RECTPACKING_OPTIONS, {
        "elk.padding": `[top=${rectPadTop},left=${RECTPACKING_CONTAINER_PADDING},bottom=${RECTPACKING_CONTAINER_PADDING},right=${RECTPACKING_CONTAINER_PADDING}]`,
        "nodeSize.minimum": `(${minWidth}, ${rectPadTop + RECTPACKING_CONTAINER_PADDING})`
      });
    }
  } else if (node.dir) {
    layoutOptions["elk.algorithm"] = algorithm;
    layoutOptions["elk.direction"] = dir2ElkDirection(node.dir);
    layoutOptions["elk.hierarchyHandling"] = "SEPARATE_CHILDREN";
  }
  Object.assign(layoutOptions, SUBGRAPH_EXPERIMENT_OVERRIDES);
  return layoutOptions;
}
__name(buildSubgraphLayoutOptions, "buildSubgraphLayoutOptions");
function findCyclicEntryNodes(nodes, edges) {
  const entries = /* @__PURE__ */ new Set();
  const groups = /* @__PURE__ */ new Map();
  for (const { id, parentId } of nodes) {
    const group = groups.get(parentId);
    if (group) {
      group.push(id);
    } else {
      groups.set(parentId, [id]);
    }
  }
  for (const ids of groups.values()) {
    const idSet = new Set(ids);
    const inDegree = new Map(ids.map((id) => [id, 0]));
    const neighbors = new Map(ids.map((id) => [id, []]));
    const internalEdges = [];
    for (const edge of edges) {
      const source = edge.source == null ? void 0 : String(edge.source);
      const target = edge.target == null ? void 0 : String(edge.target);
      if (!source || !target || source === target) {
        continue;
      }
      if (!idSet.has(source) || !idSet.has(target)) {
        continue;
      }
      inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
      neighbors.get(source).push(target);
      neighbors.get(target).push(source);
      internalEdges.push([source, target]);
    }
    const component = /* @__PURE__ */ new Map();
    let componentCount = 0;
    for (const id of ids) {
      if (component.has(id)) {
        continue;
      }
      const stack = [id];
      component.set(id, componentCount);
      while (stack.length > 0) {
        const current = stack.pop();
        for (const next of neighbors.get(current)) {
          if (!component.has(next)) {
            component.set(next, componentCount);
            stack.push(next);
          }
        }
      }
      componentCount++;
    }
    const hasSource = new Array(componentCount).fill(false);
    for (const id of ids) {
      if ((inDegree.get(id) ?? 0) === 0) {
        hasSource[component.get(id)] = true;
      }
    }
    if (!hasSource.includes(false)) {
      continue;
    }
    const forward = new Map(ids.map((id) => [id, []]));
    const residualInDegree = new Map(ids.map((id) => [id, 0]));
    const reaches = /* @__PURE__ */ __name((from, to) => {
      const seen = /* @__PURE__ */ new Set([from]);
      const stack = [from];
      while (stack.length > 0) {
        const current = stack.pop();
        if (current === to) {
          return true;
        }
        for (const next of forward.get(current)) {
          if (!seen.has(next)) {
            seen.add(next);
            stack.push(next);
          }
        }
      }
      return false;
    }, "reaches");
    for (const [source, target] of internalEdges) {
      if (reaches(target, source)) {
        continue;
      }
      forward.get(source).push(target);
      residualInDegree.set(target, (residualInDegree.get(target) ?? 0) + 1);
    }
    const nominated = new Array(componentCount).fill(false);
    for (const id of ids) {
      const c = component.get(id);
      if (!hasSource[c] && !nominated[c] && residualInDegree.get(id) === 0) {
        entries.add(id);
        nominated[c] = true;
      }
    }
  }
  return entries;
}
__name(findCyclicEntryNodes, "findCyclicEntryNodes");
function applyCyclicEntryConstraint(data4Layout, nodeDb) {
  if (!data4Layout.config.elk?.keepEntryNodeOnTop) {
    return;
  }
  const entryNodeIds = findCyclicEntryNodes(
    data4Layout.nodes,
    data4Layout.edges.map((edge) => ({ source: edge.start, target: edge.end }))
  );
  for (const id of entryNodeIds) {
    const elkNode = nodeDb[id];
    if (elkNode) {
      elkNode.layoutOptions = {
        ...elkNode.layoutOptions,
        "elk.layered.layering.layerConstraint": "FIRST"
      };
    }
  }
}
__name(applyCyclicEntryConstraint, "applyCyclicEntryConstraint");
function prepareLayoutForElk(data4Layout, context) {
  const elkContext = getElkLayoutContext(context);
  syncHostConfig(elkContext);
  applyElkEdgeRenderData(data4Layout, elkContext);
  return { algorithm: elkContext.algorithm };
}
__name(prepareLayoutForElk, "prepareLayoutForElk");
async function runElkLayoutCore(data4Layout, context) {
  const elkContext = getElkLayoutContext(context);
  const layoutState = buildElkGraphFromLayoutData(data4Layout, elkContext);
  const elk = new ELK();
  elkContext.log.info("Drawing flowchart using v4 renderer", elk);
  const graph = await runElkLayout(elk, layoutState.elkGraph, elkContext.log);
  applyElkLayoutResult(data4Layout, graph, layoutState, elkContext.log);
  orderNodesForElkPaint(data4Layout.nodes);
  return graph;
}
__name(runElkLayoutCore, "runElkLayoutCore");
function buildElkGraphFromLayoutData(data4Layout, elkContext) {
  const nodeDb = {};
  const elkGraph = createRootElkGraph(
    data4Layout,
    elkContext.algorithm,
    elkContext.rootLayoutOptions
  );
  const dir = data4Layout.direction ?? "DOWN";
  elkGraph.layoutOptions["elk.direction"] = dir2ElkDirection(dir);
  const parentLookupDb = addSubGraphs(data4Layout.nodes, elkContext.log);
  addVertices(data4Layout.nodes, elkGraph, nodeDb, elkContext);
  addEdgesToElkGraph(data4Layout, elkGraph, nodeDb, elkContext);
  configureSubgraphNodes(data4Layout, nodeDb, parentLookupDb, elkContext);
  configureCrossHierarchyEdges(elkGraph, nodeDb, parentLookupDb, elkContext.log);
  if (data4Layout.config.elk?.orientFeedbackEdges !== false) {
    reverseSubgraphFeedbackEdges(elkGraph, parentLookupDb);
  }
  applyCyclicEntryConstraint(data4Layout, nodeDb);
  return { elkGraph, nodeDb, parentLookupDb };
}
__name(buildElkGraphFromLayoutData, "buildElkGraphFromLayoutData");
function reverseSubgraphFeedbackEdges(elkGraph, parentLookupDb) {
  const flags = findSubgraphFeedbackEdges(
    elkGraph.edges.map((edge) => ({ source: edge.sources[0], target: edge.targets[0] })),
    parentLookupDb
  );
  elkGraph.edges.forEach((edge, index) => {
    if (flags[index]) {
      [edge.sources, edge.targets] = [edge.targets, edge.sources];
      edge.layoutReversed = true;
    }
  });
}
__name(reverseSubgraphFeedbackEdges, "reverseSubgraphFeedbackEdges");
var render = createCommonLayoutRenderer({
  afterPaint: applyElkLineJumps,
  prepareLayout: prepareLayoutForElk,
  // ELK derives a compound node's minimum size from the measured cluster label,
  // so the label has to be measured the way `insertCluster` paints it —
  // unwrapped — rather than at the 200px flowchart wrapping width. Requested
  // here rather than sniffed for in core: core has no business knowing which
  // layout it is running.
  measureLayout: /* @__PURE__ */ __name((data4Layout, context) => defaultMeasureLayout(data4Layout, context, { unwrapGroupLabels: true }), "measureLayout"),
  runLayoutCore: runElkLayoutCore,
  paintOptions: {
    skipIntersect: true
  }
});
function syncHostConfig(elkContext) {
  setConfig(elkContext.getConfig());
}
__name(syncHostConfig, "syncHostConfig");
function orderNodesForElkPaint(nodes) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  nodes.sort((a, b) => {
    if (a.isGroup !== b.isGroup) {
      return a.isGroup ? -1 : 1;
    }
    if (a.isGroup && b.isGroup) {
      return getGroupDepth(a, nodeById) - getGroupDepth(b, nodeById);
    }
    return 0;
  });
}
__name(orderNodesForElkPaint, "orderNodesForElkPaint");
function getGroupDepth(node, nodeById) {
  let depth = 0;
  const visited = /* @__PURE__ */ new Set();
  let parentId = node.parentId;
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = nodeById.get(parentId);
    if (!parent?.isGroup) {
      break;
    }
    depth++;
    parentId = parent.parentId;
  }
  return depth;
}
__name(getGroupDepth, "getGroupDepth");
function getElkLayoutContext(context) {
  const helpers = context.helpers;
  if (!helpers) {
    throw new Error("ELK layout requires Mermaid internal helpers");
  }
  return {
    algorithm: context.preparedLayout?.algorithm ?? context.options?.algorithm,
    rootLayoutOptions: context.options?.rootLayoutOptions,
    common: helpers.common,
    getConfig: helpers.getConfig,
    interpolateToCurve: helpers.interpolateToCurve,
    log: helpers.log
  };
}
__name(getElkLayoutContext, "getElkLayoutContext");
var ELK_PRESETS = {
  // Balanced Brandes-Koepf centers simple branches and composite-state entries.
  // Layering and cycle breaking retain the release defaults.
  default: {
    layering: "NETWORK_SIMPLEX",
    placement: "BRANDES_KOEPF",
    containerPlacement: "BRANDES_KOEPF",
    alignment: "BALANCED",
    cycleBreaking: "DEPTH_FIRST"
  },
  // Reproduce the layout before presets, including ELK's own greedy cycle
  // breaking rather than the greedy-model-order value advertised by the schema.
  legacy: {
    layering: "NETWORK_SIMPLEX",
    placement: "BRANDES_KOEPF",
    containerPlacement: "BRANDES_KOEPF",
    alignment: "NONE",
    cycleBreaking: "GREEDY"
  },
  modelOrder: {
    layering: "NETWORK_SIMPLEX",
    placement: "NETWORK_SIMPLEX",
    containerPlacement: "BRANDES_KOEPF",
    alignment: "NONE",
    cycleBreaking: "GREEDY_MODEL_ORDER"
  },
  // Preserve the previous default recipe for callers selecting it by name.
  depthFirst: {
    layering: "NETWORK_SIMPLEX",
    placement: "NETWORK_SIMPLEX",
    containerPlacement: "BRANDES_KOEPF",
    alignment: "NONE",
    cycleBreaking: "DEPTH_FIRST"
  }
};
function resolveElkPreset(name) {
  return name !== void 0 && Object.hasOwn(ELK_PRESETS, name) ? ELK_PRESETS[name] : ELK_PRESETS.default;
}
__name(resolveElkPreset, "resolveElkPreset");
function createRootElkGraph(data4Layout, algorithm, rootLayoutOptions) {
  const preset = resolveElkPreset(data4Layout.config.elk?.preset);
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.hierarchyHandling": "INCLUDE_CHILDREN",
      "elk.algorithm": algorithm,
      "elk.layered.nodePlacement.strategy": data4Layout.config.elk?.nodePlacementStrategy ?? preset.placement,
      "elk.layered.nodePlacement.bk.fixedAlignment": data4Layout.config.elk?.nodePlacementAlignment ?? preset.alignment,
      "elk.layered.mergeEdges": data4Layout.config.elk?.mergeEdges,
      "elk.direction": "DOWN",
      "spacing.baseValue": 40,
      "elk.layered.crossingMinimization.forceNodeModelOrder": data4Layout.config.elk?.forceNodeModelOrder,
      "elk.layered.considerModelOrder.strategy": data4Layout.config.elk?.considerModelOrder,
      "elk.layered.unnecessaryBendpoints": true,
      "elk.layered.cycleBreaking.strategy": data4Layout.config.elk?.cycleBreakingStrategy ?? preset.cycleBreaking,
      "elk.layered.layering.strategy": data4Layout.config.elk?.layeringStrategy ?? preset.layering,
      // Only COFFMAN_GRAHAM reads this; the others ignore it.
      "elk.layered.layering.coffmanGraham.layerBound": data4Layout.config.elk?.layeringLayerBound,
      // 'spacing.nodeNode': 120,
      // 'spacing.nodeNodeBetweenLayers': 25,
      // 'spacing.edgeNode': 20,
      // 'spacing.edgeNodeBetweenLayers': 10,
      // 'spacing.edgeEdge': 10,
      // 'spacing.edgeEdgeBetweenLayers': 20,
      // 'spacing.nodeSelfLoop': 20,
      // Tweaking options
      "elk.layered.wrapping.multiEdge.improveCuts": true,
      "elk.layered.wrapping.multiEdge.improveWrappedEdges": true,
      "elk.layered.edgeRouting.selfLoopDistribution": "EQUALLY",
      "elk.layered.mergeHierarchyEdges": true,
      // Reserve a margin at the ends of every side so a port cannot land on a
      // corner. ELK's default is 0, which permits it — and a corner is the one
      // boundary point with no side to leave from, so the edge came out of the
      // vertex and then ran ALONG the box's own edge before turning away. It
      // showed up on subgraphs first because a cross-boundary edge attaches to
      // the frame, which is large enough for the corner to be visible.
      //
      // Chosen at 12 by measurement, not taste: it is the smallest value that
      // clears the corner on the `elk-edge-cases` corpus. 30 was tried and
      // reorders layers, so this is not a free parameter — raising it changes
      // more than clearance.
      "elk.spacing.portsSurrounding": PORTS_SURROUNDING
    },
    children: [],
    edges: []
  };
  if (algorithm === "elk.rectpacking") {
    Object.assign(graph.layoutOptions, RECTPACKING_OPTIONS, {
      "elk.contentAlignment": "H_CENTER V_TOP",
      "elk.padding": "[top=15,left=15,bottom=15,right=15]"
    });
  }
  if (rootLayoutOptions) {
    Object.assign(graph.layoutOptions, rootLayoutOptions);
  }
  Object.assign(
    graph.layoutOptions,
    PLACEMENT_OPTIONS,
    EDGE_ROUTING_OPTIONS,
    ROOT_EXPERIMENT_OVERRIDES
  );
  return graph;
}
__name(createRootElkGraph, "createRootElkGraph");
function addSubGraphs(nodeArr, log) {
  const parentLookupDb = { parentById: {}, childrenById: {} };
  const subgraphs = nodeArr.filter((node) => node.isGroup);
  log.info("Subgraphs - ", subgraphs);
  subgraphs.forEach((subgraph) => {
    const children = nodeArr.filter((node) => node.parentId === subgraph.id);
    children.forEach((node) => {
      parentLookupDb.parentById[node.id] = subgraph.id;
      parentLookupDb.childrenById[subgraph.id] ??= [];
      parentLookupDb.childrenById[subgraph.id].push(node.id);
    });
  });
  return parentLookupDb;
}
__name(addSubGraphs, "addSubGraphs");
function addVertices(nodeArr, graph, nodeDb, elkContext, parentId) {
  const siblings = nodeArr.filter((node) => node?.parentId === parentId);
  elkContext.log.info("addVertices APA12", siblings, parentId);
  siblings.forEach((node) => {
    addVertex(graph, nodeArr, node, nodeDb, elkContext);
  });
  return graph;
}
__name(addVertices, "addVertices");
function addVertex(graph, nodeArr, node, nodeDb, elkContext) {
  const child = createElkNode(node);
  graph.children.push(child);
  nodeDb[node.id] = child;
  if (node.isGroup) {
    child.children = [];
    addVertices(nodeArr, child, nodeDb, elkContext, node.id);
    child.labelData = getMeasuredLabelData(node, elkContext.getConfig());
  }
}
__name(addVertex, "addVertex");
function createElkNode(node) {
  const child = { ...node };
  delete child.domId;
  if (node.isGroup) {
    child.children = [];
  } else {
    child.width = node.width ?? 0;
    child.height = node.height ?? 0;
    if (node.spreadPorts) {
      child.layoutOptions = {
        ...child.layoutOptions,
        "elk.portAlignment.default": "CENTER"
      };
    }
  }
  return child;
}
__name(createElkNode, "createElkNode");
function getMeasuredLabelData(node, config) {
  const existing = node.labelData;
  if (existing) {
    return existing;
  }
  if (node.labelBBox) {
    return {
      width: node.labelBBox.width,
      height: Math.max(0, node.labelBBox.height - 2),
      wrappingWidth: node.wrappingWidth ?? config.flowchart?.wrappingWidth
    };
  }
  return {
    width: 0,
    height: 0,
    wrappingWidth: node.wrappingWidth ?? config.flowchart?.wrappingWidth
  };
}
__name(getMeasuredLabelData, "getMeasuredLabelData");
function addEdgesToElkGraph(dataForLayout, graph, nodeDb, elkContext) {
  elkContext.log.info("abc78 DAGA edges = ", dataForLayout);
  const linkIdCnt = {};
  dataForLayout.edges.forEach((edge) => {
    const linkIdBase = edge.id;
    linkIdCnt[linkIdBase] = (linkIdCnt[linkIdBase] ?? -1) + 1;
    const linkId = linkIdBase;
    edge.id = linkId;
    elkContext.log.info(
      "abc78 new link id to be used is",
      linkIdBase,
      linkId,
      linkIdCnt[linkIdBase]
    );
    const { source, target, sourceId, targetId } = getEdgeStartEndPoint(edge, nodeDb);
    elkContext.log.debug("abc78 source and target", source, target);
    graph.edges.push({
      ...edge,
      sources: [source],
      targets: [target],
      sourceId,
      targetId,
      labels: [
        {
          width: edge.width ?? 0,
          height: edge.height ?? 0,
          orgWidth: edge.width ?? 0,
          orgHeight: edge.height ?? 0,
          text: edge.label ?? "",
          layoutOptions: {
            "edgeLabels.inline": "true",
            "edgeLabels.placement": "CENTER"
          }
        },
        // Only layered places end labels; the other algorithms leave them at the origin.
        ...(elkContext.rootLayoutOptions?.["elk.algorithm"] ?? elkContext.algorithm ?? "elk.layered") === "elk.layered" ? terminalElkLabels(edge) : []
      ]
    });
  });
  return graph;
}
__name(addEdgesToElkGraph, "addEdgesToElkGraph");
var TERMINAL_LABEL_MARKER_CLEARANCE = 6;
function terminalElkLabels(edge) {
  const texts = {
    startLeft: edge.startLabelLeft,
    startRight: edge.startLabelRight,
    endLeft: edge.endLabelLeft,
    endRight: edge.endLabelRight
  };
  return Object.entries(edge.terminalLabelSizes ?? {}).map(([key, size]) => {
    const atStart = key.startsWith("start");
    const marker = atStart ? edge.arrowTypeStart : edge.arrowTypeEnd;
    const pad = marker && marker !== "none" ? TERMINAL_LABEL_MARKER_CLEARANCE : 0;
    return {
      terminal: key,
      // ELK skips a label without text.
      text: texts[key],
      width: size.width + 2 * pad,
      height: size.height + 2 * pad,
      layoutOptions: { "edgeLabels.placement": atStart ? "TAIL" : "HEAD" }
    };
  });
}
__name(terminalElkLabels, "terminalElkLabels");
function getEdgeStartEndPoint(edge, nodeDb) {
  const sourceId = edge.start;
  const targetId = edge.end;
  const source = sourceId;
  const target = targetId;
  const startNode = sourceId ? nodeDb[sourceId] : void 0;
  const endNode = targetId ? nodeDb[targetId] : void 0;
  if (!startNode || !endNode) {
    return { source, target };
  }
  return { source, target, sourceId, targetId };
}
__name(getEdgeStartEndPoint, "getEdgeStartEndPoint");
function configureSubgraphNodes(data4Layout, nodeDb, parentLookupDb, elkContext) {
  data4Layout.nodes.forEach((n) => {
    const node = nodeDb[n.id];
    if (!node || parentLookupDb.childrenById[node.id] === void 0) {
      return;
    }
    node.labels = [
      {
        text: node.label,
        width: node?.labelData?.width ?? 50,
        height: node?.labelData?.height ?? 50
      }
    ];
    elkContext.log.debug("UIO node label", node?.labelData?.width, node.padding);
    node.layoutOptions = buildSubgraphLayoutOptions(
      node,
      data4Layout.config.elk,
      elkContext.algorithm,
      elkContext.log
    );
    delete node.x;
    delete node.y;
    delete node.width;
    delete node.height;
  });
}
__name(configureSubgraphNodes, "configureSubgraphNodes");
function configureCrossHierarchyEdges(elkGraph, nodeDb, parentLookupDb, log) {
  log.debug("APA01 processing edges, count:", elkGraph.edges.length);
  elkGraph.edges.forEach((edge, index) => {
    log.debug("APA01 processing edge", index, ":", edge);
    const source = edge.sources[0];
    const target = edge.targets[0];
    log.debug("APA01 source:", source, "target:", target);
    log.debug("APA01 nodeDb[source]:", nodeDb[source]);
    log.debug("APA01 nodeDb[target]:", nodeDb[target]);
    if (nodeDb[source] && nodeDb[target] && nodeDb[source].parentId !== nodeDb[target].parentId) {
      const ancestorId = findCommonAncestor(source, target, parentLookupDb);
      setIncludeChildrenPolicy(nodeDb, source, ancestorId, log);
      setIncludeChildrenPolicy(nodeDb, target, ancestorId, log);
    }
  });
}
__name(configureCrossHierarchyEdges, "configureCrossHierarchyEdges");
function setIncludeChildrenPolicy(nodeDb, nodeId, ancestorId, log) {
  const node = nodeDb[nodeId];
  if (!node) {
    return;
  }
  node.layoutOptions ??= {};
  if (node.layoutOptions["elk.hierarchyHandling"] === "SEPARATE_CHILDREN" && resolveContainerAlgorithm(node.metadata?.algorithm)) {
    log.debug("Dropping explicit algorithm for node", node.id, "due to cross-boundary edges");
    clearContainerAlgorithmOptions(node.layoutOptions);
    Object.assign(node.layoutOptions, groupTitleSizeOptions(node));
  }
  node.layoutOptions["elk.hierarchyHandling"] = "INCLUDE_CHILDREN";
  if (node.id !== ancestorId && node.parentId) {
    setIncludeChildrenPolicy(nodeDb, node.parentId, ancestorId, log);
  }
}
__name(setIncludeChildrenPolicy, "setIncludeChildrenPolicy");
async function runElkLayout(elk, elkGraph, log) {
  const profiler = globalThis.__mermaidProfiler;
  try {
    profiler?.begin("layoutCore");
    let graph;
    try {
      graph = await elk.layout(elkGraph);
    } finally {
      profiler?.end();
    }
    log.debug("APA01 after - success");
    log.debug("APA01 layout result:", graph);
    return graph;
  } catch (error) {
    log.error("ELK layout error:", error);
    throw error;
  }
}
__name(runElkLayout, "runElkLayout");
function applyElkLayoutResult(data4Layout, graph, layoutState, log) {
  const nodeById = new Map(data4Layout.nodes.map((node) => [node.id, node]));
  applyElkNodePositions(graph.children ?? [], layoutState, nodeById, 0, 0, 0, log);
  evenGroupFrames(graph.children ?? [], layoutState, nodeById, graph);
  applyElkEdgeLayout(data4Layout, graph, layoutState, log);
}
__name(applyElkLayoutResult, "applyElkLayoutResult");
function collectDescendantIds(elkNode, into = /* @__PURE__ */ new Set()) {
  for (const child of elkNode.children ?? []) {
    into.add(child.id);
    collectDescendantIds(child, into);
  }
  return into;
}
__name(collectDescendantIds, "collectDescendantIds");
function internalEdgePoints(graph, descendants, layoutState, groupId) {
  const points = [];
  for (const edge of graph.edges ?? []) {
    const source = edge.sources?.[0] ?? edge.start;
    const target = edge.targets?.[0] ?? edge.end;
    const isInternal = descendants.has(source) && descendants.has(target);
    const attachesAtStart = source === groupId;
    const attachesAtEnd = target === groupId;
    if (!isInternal && !attachesAtStart && !attachesAtEnd) {
      continue;
    }
    const offset = calcOffset(source, target, layoutState.parentLookupDb, layoutState.nodeDb);
    for (const section of edge.sections ?? []) {
      const sectionPoints = isInternal ? [section.startPoint, ...section.bendPoints ?? [], section.endPoint] : [attachesAtStart ? section.startPoint : null, attachesAtEnd ? section.endPoint : null];
      for (const p of sectionPoints) {
        if (p) {
          points.push({ x: p.x + offset.x, y: p.y + offset.y });
        }
      }
    }
  }
  return points;
}
__name(internalEdgePoints, "internalEdgePoints");
function evenGroupFrames(elkNodes, layoutState, nodeById, graph = {}) {
  for (const elkNode of elkNodes) {
    if (!elkNode?.isGroup) {
      continue;
    }
    const children = elkNode.children ?? [];
    evenGroupFrames(children, layoutState, nodeById, graph);
    const group = layoutState.nodeDb[elkNode.id];
    const boxes = children.map((child) => layoutState.nodeDb[child.id]).filter((child) => child?.offset && child.width && child.height);
    if (!group?.offset || boxes.length === 0) {
      continue;
    }
    const lane = internalEdgePoints(graph, collectDescendantIds(elkNode), layoutState, elkNode.id);
    const xs = [
      ...boxes.map((b) => b.offset.posX),
      ...boxes.map((b) => b.offset.posX + b.width),
      ...lane.map((p) => p.x)
    ];
    const ys = [
      ...boxes.map((b) => b.offset.posY),
      ...boxes.map((b) => b.offset.posY + b.height),
      ...lane.map((p) => p.y)
    ];
    const origin = group.offset;
    const left = Math.max(origin.posX, Math.min(...xs) - SUBGRAPH_PADDING);
    const right = Math.min(origin.posX + group.width, Math.max(...xs) + SUBGRAPH_PADDING);
    const bottom = Math.min(origin.posY + group.height, Math.max(...ys) + SUBGRAPH_PADDING);
    const top = origin.posY;
    const labelFloor = groupTitleWidth(elkNode);
    let x = left;
    let width = right - left;
    if (width < labelFloor) {
      x -= (labelFloor - width) / 2;
      width = labelFloor;
      const origRight = origin.posX + group.width;
      x = Math.max(origin.posX, Math.min(x, origRight - width));
      width = Math.min(width, group.width);
    }
    const height = bottom - top;
    if (height <= 0 || width <= 0) {
      continue;
    }
    group.elkOrigin ??= { posX: origin.posX, posY: origin.posY };
    group.offset.posX = x;
    group.offset.width = width;
    group.offset.height = height;
    group.width = width;
    group.height = height;
    group.x = x + width / 2;
    group.y = top + height / 2;
    const layoutNode = nodeById.get(elkNode.id);
    if (layoutNode) {
      layoutNode.x = group.x;
      layoutNode.y = group.y;
      layoutNode.width = width;
      layoutNode.height = height;
    }
  }
}
__name(evenGroupFrames, "evenGroupFrames");
function applyElkNodePositions(nodeArray, layoutState, nodeById, relX, relY, depth, log) {
  nodeArray.forEach((node) => {
    if (!node) {
      return;
    }
    const graphNode = layoutState.nodeDb[node.id] ?? node;
    const width = Math.max(node.width, node.labels ? node.labels[0]?.width || 0 : 0);
    const offset = {
      posX: node.x + relX,
      posY: node.y + relY,
      x: relX,
      y: relY,
      depth,
      width,
      height: node.height
    };
    graphNode.offset = offset;
    graphNode.x = offset.posX + node.width / 2;
    graphNode.y = offset.posY + node.height / 2;
    graphNode.width = node.width;
    graphNode.height = node.height;
    const layoutNode = nodeById.get(node.id);
    if (layoutNode) {
      layoutNode.x = graphNode.x;
      layoutNode.y = graphNode.y;
      layoutNode.width = node.isGroup ? Math.max(node.width, node.labelData?.width ?? 0) : node.width;
      layoutNode.height = node.height;
      const layoutNodeLabels = layoutNode;
      layoutNodeLabels.labelData = node.labelData;
      layoutNodeLabels.labels = node.labels;
    }
    if (node.isGroup) {
      log.debug("Id abc88 subgraph = ", node.id, node.x, node.y, node.labelData);
      applyElkNodePositions(
        node.children ?? [],
        layoutState,
        nodeById,
        offset.posX,
        offset.posY,
        depth + 1,
        log
      );
    } else {
      log.info(
        "Id NODE = ",
        node.id,
        node.x,
        node.y,
        relX,
        relY,
        `translate(${graphNode.x}, ${graphNode.y})`
      );
    }
  });
}
__name(applyElkNodePositions, "applyElkNodePositions");
var TERMINAL_JOG_MAX = 16;
var TERMINAL_RUN_MAX = 30;
var JOG_EPS = 0.01;
function axisOf(a, b) {
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  if (dx > JOG_EPS && dy <= JOG_EPS) {
    return "h";
  }
  if (dy > JOG_EPS && dx <= JOG_EPS) {
    return "v";
  }
  return void 0;
}
__name(axisOf, "axisOf");
function straightenTerminalJogsWithRuns(points) {
  const runs = [];
  let pts = points;
  const front = straightenFront(pts);
  if (front) {
    pts = front.points;
    runs.push(front.run);
  }
  const reversed = [...pts].reverse();
  const back = straightenFront(reversed);
  if (back) {
    pts = back.points.reverse();
    runs.push(back.run);
  }
  return { points: pts, runs };
}
__name(straightenTerminalJogsWithRuns, "straightenTerminalJogsWithRuns");
function straightenFront(pts) {
  if (pts.length < 5) {
    return null;
  }
  const [p0, p1, p2, p3] = pts;
  const axis = axisOf(p0, p1);
  if (!axis || axisOf(p2, p3) !== axis || axisOf(p1, p2) !== (axis === "h" ? "v" : "h")) {
    return null;
  }
  if (Math.hypot(p1.x - p0.x, p1.y - p0.y) > TERMINAL_RUN_MAX) {
    return null;
  }
  const jog = axis === "h" ? Math.abs(p2.y - p1.y) : Math.abs(p2.x - p1.x);
  if (jog < JOG_EPS || jog > TERMINAL_JOG_MAX) {
    return null;
  }
  const forward = axis === "h" ? Math.sign(p1.x - p0.x) === Math.sign(p3.x - p2.x) : Math.sign(p1.y - p0.y) === Math.sign(p3.y - p2.y);
  if (!forward) {
    return null;
  }
  let last = 3;
  while (last + 1 < pts.length && axisOf(pts[last], pts[last + 1]) === axis) {
    last++;
  }
  if (last === pts.length - 1) {
    return null;
  }
  const moved = [...pts];
  for (let i = 2; i <= last; i++) {
    moved[i] = axis === "h" ? { x: pts[i].x, y: p0.y } : { x: p0.x, y: pts[i].y };
  }
  const run = {
    old: { a: pts[2], b: pts[last] },
    new: { a: moved[2], b: moved[last] }
  };
  moved.splice(1, 2);
  return { points: moved, run };
}
__name(straightenFront, "straightenFront");
function segmentsCrossStrict(a1, a2, b1, b2) {
  const side = /* @__PURE__ */ __name((o, p, q) => (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x), "side");
  const d1 = side(b1, b2, a1);
  const d2 = side(b1, b2, a2);
  const d3 = side(a1, a2, b1);
  const d4 = side(a1, a2, b2);
  return (d1 > 0 && d2 < 0 || d1 < 0 && d2 > 0) && (d3 > 0 && d4 < 0 || d3 < 0 && d4 > 0);
}
__name(segmentsCrossStrict, "segmentsCrossStrict");
function crossingCount(a, b) {
  let n = 0;
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      if (segmentsCrossStrict(a[i], a[i + 1], b[j], b[j + 1])) {
        n++;
      }
    }
  }
  return n;
}
__name(crossingCount, "crossingCount");
function paramOnSegment(p, a, b) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;
  if (lenSq === 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq));
}
__name(paramOnSegment, "paramOnSegment");
function pointAtParam(a, b, t) {
  return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
}
__name(pointAtParam, "pointAtParam");
function projectLabelOntoStraightenedRun(label, runs) {
  let best = null;
  for (const run of runs) {
    const t = paramOnSegment(label, run.old.a, run.old.b);
    const oldPoint = pointAtParam(run.old.a, run.old.b, t);
    const dx = oldPoint.x - label.x;
    const dy = oldPoint.y - label.y;
    const distSq = dx * dx + dy * dy;
    if (!best || distSq < best.distSq) {
      best = { distSq, point: pointAtParam(run.new.a, run.new.b, t) };
    }
  }
  return best?.point ?? null;
}
__name(projectLabelOntoStraightenedRun, "projectLabelOntoStraightenedRun");
function segmentHitsBox(a, b, box) {
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  for (const [p, q] of [
    [-dx, a.x - box.x1],
    [dx, box.x2 - a.x],
    [-dy, a.y - box.y1],
    [dy, box.y2 - a.y]
  ]) {
    if (p === 0) {
      if (q < 0) {
        return false;
      }
    } else if (p < 0) {
      t0 = Math.max(t0, q / p);
    } else {
      t1 = Math.min(t1, q / p);
    }
  }
  return t0 < t1;
}
__name(segmentHitsBox, "segmentHitsBox");
var labelBox = /* @__PURE__ */ __name((center, size) => ({
  x1: center.x - size.width / 2,
  y1: center.y - size.height / 2,
  x2: center.x + size.width / 2,
  y2: center.y + size.height / 2
}), "labelBox");
function straightenEdgeTerminals(edges) {
  const routes = edges.map((edge) => edge.points ?? []);
  const labels = edges.map(
    (edge) => edge.x == null || edge.y == null || !edge.label || !edge.width || !edge.height ? void 0 : { centre: { x: edge.x, y: edge.y }, size: { width: edge.width, height: edge.height } }
  );
  const covers = /* @__PURE__ */ __name((route, label) => {
    const box = label && labelBox(label.centre, label.size);
    return !!box && route.some((p, i) => i < route.length - 1 && segmentHitsBox(p, route[i + 1], box));
  }, "covers");
  const changed = [];
  for (const [index, edge] of edges.entries()) {
    const original = routes[index];
    if (original.length < 5) {
      continue;
    }
    const { points: candidate, runs } = straightenTerminalJogsWithRuns(original);
    if (candidate === original) {
      continue;
    }
    const label = labels[index];
    const moved = label && projectLabelOntoStraightenedRun(label.centre, runs);
    const candidateLabel = label && moved ? { centre: moved, size: label.size } : label;
    let before = 0;
    let after = 0;
    let coveredBefore = 0;
    let coveredAfter = 0;
    for (const [other, route] of routes.entries()) {
      if (other === index || route.length < 2) {
        continue;
      }
      before += crossingCount(original, route);
      after += crossingCount(candidate, route);
      coveredBefore += Number(covers(route, label)) + Number(covers(original, labels[other]));
      coveredAfter += Number(covers(route, candidateLabel)) + Number(covers(candidate, labels[other]));
    }
    if (after > before || coveredAfter > coveredBefore) {
      continue;
    }
    edge.points = candidate;
    routes[index] = candidate;
    labels[index] = candidateLabel;
    changed.push({ edge, runs });
  }
  return changed;
}
__name(straightenEdgeTerminals, "straightenEdgeTerminals");
function applyElkEdgeLayout(data4Layout, graph, layoutState, log) {
  const edgeById = new Map(data4Layout.edges.map((edge) => [edge.id, edge]));
  const straightenEdges = data4Layout.config.elk?.straightenEdges !== false;
  const terminalLabelPorts = /* @__PURE__ */ new Map();
  for (const edge of data4Layout.edges) {
    delete edge.terminalLabelCenters;
  }
  const layoutNodeById = new Map(data4Layout.nodes.map((node) => [node.id, node]));
  const alignedNodes = /* @__PURE__ */ new Set();
  graph.edges?.forEach((edge) => {
    if (!edge.sections?.length) {
      return;
    }
    const startNode = layoutState.nodeDb[edge.sources?.[0] ?? edge.start];
    const endNode = layoutState.nodeDb[edge.targets?.[0] ?? edge.end];
    if (!startNode || !endNode) {
      return;
    }
    const sourceId = edge.start ?? edge.sourceId ?? edge.sources?.[0];
    const targetId = edge.end ?? edge.targetId ?? edge.targets?.[0];
    const offset = calcOffset(sourceId, targetId, layoutState.parentLookupDb, layoutState.nodeDb);
    const section = edge.sections[0];
    if (startNode.shape !== "rect33") {
      alignDegenerateNodeToAnchor(
        startNode,
        { x: section.startPoint.x + offset.x, y: section.startPoint.y + offset.y },
        layoutNodeById,
        alignedNodes
      );
    }
    if (endNode.shape !== "rect33") {
      alignDegenerateNodeToAnchor(
        endNode,
        { x: section.endPoint.x + offset.x, y: section.endPoint.y + offset.y },
        layoutNodeById,
        alignedNodes
      );
    }
  });
  graph.edges?.forEach((edge) => {
    const layoutEdge = edgeById.get(edge.id);
    if (!layoutEdge) {
      return;
    }
    const reversed = edge.layoutReversed === true;
    let startId = edge.sources?.[0] ?? edge.start;
    let endId = edge.targets?.[0] ?? edge.end;
    if (reversed) {
      [startId, endId] = [endId, startId];
    }
    const startNode = layoutState.nodeDb[startId];
    const endNode = layoutState.nodeDb[endId];
    if (!startNode || !endNode) {
      return;
    }
    if (!edge.sections?.length) {
      const centre = /* @__PURE__ */ __name((node) => ({
        x: (node.offset?.posX ?? node.x ?? 0) + (node.width ?? 0) / 2,
        y: (node.offset?.posY ?? node.y ?? 0) + (node.height ?? 0) / 2
      }), "centre");
      const from = centre(startNode);
      const to = centre(endNode);
      startNode.x = from.x;
      startNode.y = from.y;
      endNode.x = to.x;
      endNode.y = to.y;
      const straightPoints = sanitizeElkEdgePoints([from, to], startNode, endNode, log);
      layoutEdge.points = straightPoints;
      layoutEdge.curve = "linear";
      const lineStart = straightPoints[0];
      const lineEnd = straightPoints[straightPoints.length - 1];
      layoutEdge.x = (lineStart.x + lineEnd.x) / 2;
      layoutEdge.y = (lineStart.y + lineEnd.y) / 2;
      log.debug("APA18 no edge sections, using a straight line", edge.id, layoutEdge.points);
      return;
    }
    const sourceId = edge.start ?? edge.sourceId ?? startId;
    const targetId = edge.end ?? edge.targetId ?? endId;
    const offset = calcOffset(sourceId, targetId, layoutState.parentLookupDb, layoutState.nodeDb);
    log.debug("APA18 offset", offset, sourceId, " ==> ", targetId, "edge:", edge, startNode);
    const section = edge.sections[0];
    const points = createEdgePointsFromSection(section, offset);
    if (reversed) {
      points.reverse();
    }
    const elkPorts = { start: points[0], end: points[points.length - 1] };
    startNode.x = startNode.offset.posX + startNode.width / 2;
    startNode.y = startNode.offset.posY + startNode.height / 2;
    endNode.x = endNode.offset.posX + endNode.width / 2;
    endNode.y = endNode.offset.posY + endNode.height / 2;
    if (startNode.shape !== "rect33") {
      points.unshift({ x: startNode.x, y: startNode.y });
    }
    if (endNode.shape !== "rect33") {
      points.push({ x: endNode.x, y: endNode.y });
    }
    const clipped = sanitizeElkEdgePoints(points, startNode, endNode, log);
    layoutEdge.points = ensureStartMarkerSegmentLength(
      ensureEndMarkerSegmentLength(
        clipped,
        boundsFor(endNode),
        getEndMarkerPathOffset(layoutEdge),
        log
      ),
      boundsFor(startNode),
      getStartMarkerPathOffset(layoutEdge),
      log
    );
    layoutEdge.curve = "rounded";
    const label = edge.labels?.[0];
    if (label) {
      layoutEdge.x = label.x + offset.x + label.width / 2;
      layoutEdge.y = label.y + offset.y + label.height / 2;
    }
    for (const terminal of edge.labels ?? []) {
      if (!terminal.terminal || !terminal.x && !terminal.y) {
        continue;
      }
      layoutEdge.terminalLabelCenters ??= {};
      layoutEdge.terminalLabelCenters[terminal.terminal] = {
        x: terminal.x + offset.x + terminal.width / 2,
        y: terminal.y + offset.y + terminal.height / 2
      };
    }
    if (layoutEdge.terminalLabelCenters) {
      terminalLabelPorts.set(layoutEdge, elkPorts);
    }
  });
  if (straightenEdges) {
    const straightened = straightenEdgeTerminals(data4Layout.edges);
    for (const { edge, runs } of straightened) {
      if (edge.x == null || edge.y == null) {
        continue;
      }
      const projected = projectLabelOntoStraightenedRun({ x: edge.x, y: edge.y }, runs);
      if (projected) {
        edge.x = projected.x;
        edge.y = projected.y;
      }
    }
  }
  for (const [layoutEdge, ports] of terminalLabelPorts) {
    followMovedEndpoints(layoutEdge, ports);
  }
  slideTerminalLabelsOffFrames(data4Layout.edges, data4Layout.nodes);
  putTerminalLabelsOnTheirSide(data4Layout.edges, data4Layout.nodes);
  separateOppositeEdgeLabels(data4Layout.edges);
}
__name(applyElkEdgeLayout, "applyElkEdgeLayout");
var OPPOSITE_LABEL_MIN_GAP = 4;
function separateOppositeEdgeLabels(edges) {
  const byPair = /* @__PURE__ */ new Map();
  for (const edge of edges) {
    if (edge.x == null || edge.y == null || !edge.label || !edge.width) {
      continue;
    }
    const key = [edge.start ?? "", edge.end ?? ""].sort().join("\0");
    const bucket = byPair.get(key);
    if (bucket) {
      bucket.push(edge);
    } else {
      byPair.set(key, [edge]);
    }
  }
  for (const bucket of byPair.values()) {
    if (bucket.length !== 2) {
      continue;
    }
    const [a, b] = bucket;
    if (Math.abs(a.y - b.y) > Math.max(a.height ?? 0, b.height ?? 0)) {
      continue;
    }
    const required = a.width / 2 + b.width / 2 + OPPOSITE_LABEL_MIN_GAP;
    const current = b.x - a.x;
    const deficit = required - Math.abs(current);
    if (deficit <= 0) {
      continue;
    }
    const sign = Math.sign(current) || 1;
    a.x = a.x - sign * deficit / 2;
    b.x = b.x + sign * deficit / 2;
  }
}
__name(separateOppositeEdgeLabels, "separateOppositeEdgeLabels");
var boxesOverlap = /* @__PURE__ */ __name((a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2, "boxesOverlap");
function terminalLabelObstacles(edges, nodes) {
  const placed = nodes.filter((node) => node.x !== void 0 && node.y !== void 0);
  const boxOf = /* @__PURE__ */ __name((node) => labelBox({ x: node.x, y: node.y }, { width: node.width ?? 0, height: node.height ?? 0 }), "boxOf");
  const nodeBoxes = placed.filter((node) => !node.isGroup).map(boxOf);
  const frameSegments = placed.filter((node) => node.isGroup).map(boxOf).flatMap(({ x1, y1, x2, y2 }) => [
    [
      { x: x1, y: y1 },
      { x: x2, y: y1 }
    ],
    [
      { x: x2, y: y1 },
      { x: x2, y: y2 }
    ],
    [
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ],
    [
      { x: x1, y: y2 },
      { x: x1, y: y1 }
    ]
  ]);
  const centreLabelBoxes = edges.filter((edge) => edge.label && edge.width && edge.height && edge.x !== void 0).map(
    (edge) => labelBox({ x: edge.x, y: edge.y }, { width: edge.width, height: edge.height })
  );
  const hitsFrame = /* @__PURE__ */ __name((box, frameClearance = 0) => {
    const padded = {
      x1: box.x1 - frameClearance,
      y1: box.y1 - frameClearance,
      x2: box.x2 + frameClearance,
      y2: box.y2 + frameClearance
    };
    return frameSegments.some(([a, b]) => segmentHitsBox(a, b, padded));
  }, "hitsFrame");
  const blocked = /* @__PURE__ */ __name((box, edge, key, segment, frameClearance = 0) => nodeBoxes.some((node) => boxesOverlap(box, node)) || centreLabelBoxes.some((label) => boxesOverlap(box, label)) || hitsFrame(box, frameClearance) || edges.some(
    (other) => (other.points ?? []).some(
      (point, i, all) => i < all.length - 1 && !(other === edge && i === segment) && segmentHitsBox(point, all[i + 1], box)
    )
  ) || edges.some(
    (other) => Object.entries(other.terminalLabelCenters ?? {}).some(([otherKey, otherCenter]) => {
      const otherSize = other.terminalLabelSizes?.[otherKey];
      return !(other === edge && otherKey === key) && otherSize !== void 0 && boxesOverlap(box, labelBox(otherCenter, otherSize));
    })
  ), "blocked");
  return { hitsFrame, blocked };
}
__name(terminalLabelObstacles, "terminalLabelObstacles");
function* placedTerminalLabels(edges) {
  for (const edge of edges) {
    const points = edge.points;
    if (!points || points.length < 2 || !edge.terminalLabelCenters || !edge.terminalLabelSizes) {
      continue;
    }
    for (const [key, center] of Object.entries(edge.terminalLabelCenters)) {
      const size = edge.terminalLabelSizes[key];
      const atStart = key.startsWith("start");
      const segment = atStart ? 0 : points.length - 2;
      const [from, to] = [points[segment], points[segment + 1]];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      if (!size || length === 0) {
        continue;
      }
      yield { edge, key, center, size, atStart, segment, from, to, length };
    }
  }
}
__name(placedTerminalLabels, "placedTerminalLabels");
var TERMINAL_LABEL_FRAME_CLEARANCE = 2;
function slideTerminalLabelsOffFrames(edges, nodes) {
  const { hitsFrame, blocked } = terminalLabelObstacles(edges, nodes);
  for (const {
    edge,
    key,
    center,
    size,
    atStart,
    segment,
    from,
    to,
    length
  } of placedTerminalLabels(edges)) {
    if (!hitsFrame(labelBox(center, size))) {
      continue;
    }
    const [far, end] = atStart ? [to, from] : [from, to];
    const dir = { x: (end.x - far.x) / length, y: (end.y - far.y) / length };
    const halfExtent = (Math.abs(dir.x) * size.width + Math.abs(dir.y) * size.height) / 2;
    const along = /* @__PURE__ */ __name((c) => (c.x - end.x) * dir.x + (c.y - end.y) * dir.y, "along");
    const onSegment = /* @__PURE__ */ __name((c) => along(c) + halfExtent <= 0 && along(c) - halfExtent >= -length, "onSegment");
    for (let step = 1; step <= length; step++) {
      const found = [step, -step].map((shift) => ({ x: center.x + shift * dir.x, y: center.y + shift * dir.y })).find(
        (moved) => onSegment(moved) && !blocked(labelBox(moved, size), edge, key, segment, TERMINAL_LABEL_FRAME_CLEARANCE)
      );
      if (found) {
        edge.terminalLabelCenters[key] = found;
        break;
      }
    }
  }
}
__name(slideTerminalLabelsOffFrames, "slideTerminalLabelsOffFrames");
function putTerminalLabelsOnTheirSide(edges, nodes) {
  const { blocked } = terminalLabelObstacles(edges, nodes);
  for (const { edge, key, center, size, segment, from, to, length } of placedTerminalLabels(
    edges
  )) {
    const normal = { x: -(to.y - from.y) / length, y: (to.x - from.x) / length };
    const offset = (center.x - from.x) * normal.x + (center.y - from.y) * normal.y;
    if (offset === 0 || offset > 0 === key.endsWith("Right")) {
      continue;
    }
    const mirrored = { x: center.x - 2 * offset * normal.x, y: center.y - 2 * offset * normal.y };
    if (!blocked(labelBox(mirrored, size), edge, key, segment)) {
      edge.terminalLabelCenters[key] = mirrored;
    }
  }
}
__name(putTerminalLabelsOnTheirSide, "putTerminalLabelsOnTheirSide");
function followMovedEndpoints(edge, ports) {
  const points = edge.points;
  if (!points?.length || !edge.terminalLabelCenters) {
    return;
  }
  const moved = {
    start: { x: points[0].x - ports.start.x, y: points[0].y - ports.start.y },
    end: {
      x: points[points.length - 1].x - ports.end.x,
      y: points[points.length - 1].y - ports.end.y
    }
  };
  for (const [key, center] of Object.entries(edge.terminalLabelCenters)) {
    const delta = key.startsWith("start") ? moved.start : moved.end;
    edge.terminalLabelCenters[key] = {
      x: center.x + delta.x,
      y: center.y + delta.y
    };
  }
}
__name(followMovedEndpoints, "followMovedEndpoints");
function alignDegenerateNodeToAnchor(node, anchor, layoutNodeById, alignedNodes) {
  const width = node.width ?? 0;
  const height = node.height ?? 0;
  const top = node.offset.posY;
  const bottom = top + height;
  const tol = 0.5;
  const alongWidth = Math.abs(anchor.y - top) <= tol || Math.abs(anchor.y - bottom) <= tol;
  if ((alongWidth ? width : height) >= 2 * PORTS_SURROUNDING_MARGIN) {
    return;
  }
  if (alignedNodes.has(node.id)) {
    return;
  }
  alignedNodes.add(node.id);
  const delta = alongWidth ? anchor.x - (node.offset.posX + width / 2) : anchor.y - (node.offset.posY + height / 2);
  if (Math.abs(delta) < 0.01) {
    return;
  }
  if (alongWidth) {
    node.offset.posX += delta;
    node.x = node.offset.posX + width / 2;
  } else {
    node.offset.posY += delta;
    node.y = node.offset.posY + height / 2;
  }
  const layoutNode = layoutNodeById.get(node.id);
  if (layoutNode) {
    layoutNode.x = node.offset.posX + width / 2;
    layoutNode.y = node.offset.posY + height / 2;
  }
}
__name(alignDegenerateNodeToAnchor, "alignDegenerateNodeToAnchor");
function createEdgePointsFromSection(section, offset) {
  const src = section.startPoint;
  const dest = section.endPoint;
  const segments = section.bendPoints ? section.bendPoints : [];
  const segPoints = segments.map((segment) => ({
    x: segment.x + offset.x,
    y: segment.y + offset.y
  }));
  return [
    { x: src.x + offset.x, y: src.y + offset.y },
    ...segPoints,
    { x: dest.x + offset.x, y: dest.y + offset.y }
  ];
}
__name(createEdgePointsFromSection, "createEdgePointsFromSection");
function calcOffset(src, dest, parentLookupDb, nodeDb) {
  const ancestor = findCommonAncestor(src, dest, parentLookupDb);
  if (ancestor === void 0 || ancestor === "root") {
    return { x: 0, y: 0 };
  }
  const node = nodeDb[ancestor];
  const ancestorOffset = node?.elkOrigin ?? node?.offset;
  return {
    x: ancestorOffset?.posX ?? 0,
    y: ancestorOffset?.posY ?? 0
  };
}
__name(calcOffset, "calcOffset");
function sanitizeElkEdgePoints(points, startNode, endNode, log) {
  const prevPoints = Array.isArray(points) ? [...points] : [];
  const endBounds = boundsFor(endNode);
  log.debug(
    "PPP cutter2: Points before cutter2:",
    JSON.stringify(points),
    "endBounds:",
    endBounds,
    onBorder(endBounds, points[points.length - 1])
  );
  let clippedPoints;
  {
    const startBounds = boundsFor(startNode);
    const endBounds2 = boundsFor(endNode);
    const startIsGroup = !!startNode?.isGroup;
    const endIsGroup = !!endNode?.isGroup;
    const { candidate: startCandidate, centerApprox: startCenterApprox } = getCandidateBorderPoint(
      prevPoints,
      startNode,
      "start"
    );
    const { candidate: endCandidate, centerApprox: endCenterApprox } = getCandidateBorderPoint(
      prevPoints,
      endNode,
      "end"
    );
    let skipStart = startIsGroup && onBorder(startBounds, startCandidate);
    let skipEnd = endIsGroup && onBorder(endBounds2, endCandidate);
    dropAutoCenterPoint(prevPoints, "start", skipStart && startCenterApprox);
    dropAutoCenterPoint(prevPoints, "end", skipEnd && endCenterApprox);
    if (startIsGroup && !skipStart) {
      skipStart = clipGroupEndpoint(prevPoints, startBounds, "start");
    }
    if (endIsGroup && !skipEnd) {
      skipEnd = clipGroupEndpoint(prevPoints, endBounds2, "end");
    }
    if (skipStart || skipEnd) {
      if (!skipStart) {
        applyStartIntersectionIfNeeded(prevPoints, startNode, startBounds, log);
      }
      if (!skipEnd) {
        applyEndIntersectionIfNeeded(prevPoints, endNode, endBounds2, log);
      }
      log.debug("PPP cutter2: skipping cutter2 due to on-border group endpoint(s)", {
        skipStart,
        skipEnd,
        startCenterApprox,
        endCenterApprox,
        startCandidate,
        endCandidate
      });
      clippedPoints = prevPoints;
    } else {
      clippedPoints = cutter2(startNode, endNode, prevPoints, log);
    }
  }
  log.debug("PPP cutter2: Points after cutter2:", JSON.stringify(clippedPoints));
  if (!Array.isArray(clippedPoints) || clippedPoints.length < 2 || hasInvalidPoint(clippedPoints)) {
    log.warn("POI cutter2: Invalid points from cutter2, falling back to prevPoints", clippedPoints);
    const cleaned = prevPoints.filter((p) => Number.isFinite(p?.x) && Number.isFinite(p?.y));
    clippedPoints = cleaned.length >= 2 ? cleaned : prevPoints;
  }
  log.debug("UIO cutter2: Points after cutter2 (sanitized):", clippedPoints);
  return dedupeConsecutivePoints(clippedPoints, log);
}
__name(sanitizeElkEdgePoints, "sanitizeElkEdgePoints");
function hasInvalidPoint(points) {
  return points?.some((point) => !Number.isFinite(point?.x) || !Number.isFinite(point?.y));
}
__name(hasInvalidPoint, "hasInvalidPoint");
function dedupeConsecutivePoints(points, log) {
  const deduped = points.filter((point, index, arr) => {
    if (index === 0) {
      return true;
    }
    const prev = arr[index - 1];
    return Math.abs(point.x - prev.x) > 1e-6 || Math.abs(point.y - prev.y) > 1e-6;
  });
  if (deduped.length !== points.length) {
    log.debug("UIO cutter2: removed consecutive duplicate points", {
      before: points,
      after: deduped
    });
  }
  return deduped;
}
__name(dedupeConsecutivePoints, "dedupeConsecutivePoints");
function getEndMarkerPathOffset(edge) {
  return markerPathOffset(edge.arrowTypeEnd);
}
__name(getEndMarkerPathOffset, "getEndMarkerPathOffset");
function getStartMarkerPathOffset(edge) {
  return markerPathOffset(edge.arrowTypeStart);
}
__name(getStartMarkerPathOffset, "getStartMarkerPathOffset");
function ensureStartMarkerSegmentLength(points, startBounds, markerOffset, log) {
  if (markerOffset <= 0 || points.length < 3) {
    return points;
  }
  const start = points[0];
  const exit = points[1];
  const segmentLength = Math.hypot(exit.x - start.x, exit.y - start.y);
  if (segmentLength >= Math.max(MIN_END_MARKER_SEGMENT_LENGTH, markerOffset * 2)) {
    return points;
  }
  if (!onBorder(startBounds, exit, 1)) {
    return points;
  }
  const adjusted = [start, ...points.slice(2)];
  log.debug("UIO cutter2: removed short start marker segment", {
    before: points,
    after: adjusted,
    markerOffset,
    segmentLength
  });
  return adjusted;
}
__name(ensureStartMarkerSegmentLength, "ensureStartMarkerSegmentLength");
function ensureEndMarkerSegmentLength(points, endBounds, markerOffset, log) {
  if (markerOffset <= 0 || points.length < 3) {
    return points;
  }
  const end = points[points.length - 1];
  const entry = points[points.length - 2];
  const segmentLength = Math.hypot(end.x - entry.x, end.y - entry.y);
  if (segmentLength >= Math.max(MIN_END_MARKER_SEGMENT_LENGTH, markerOffset * 2)) {
    return points;
  }
  if (!onBorder(endBounds, entry, 1)) {
    return points;
  }
  const adjusted = [...points.slice(0, -2), end];
  log.debug("UIO cutter2: removed short end marker segment", {
    before: points,
    after: adjusted,
    markerOffset,
    segmentLength
  });
  return adjusted;
}
__name(ensureEndMarkerSegmentLength, "ensureEndMarkerSegmentLength");
function applyElkEdgeRenderData(data4Layout, elkContext) {
  const defaultInterpolate = data4Layout.edges.defaultInterpolate;
  const defaultStyle = data4Layout.edges.defaultStyle;
  const conf = elkContext.getConfig();
  data4Layout.edges.forEach((edge) => {
    const edgeData = buildEdgeData(
      edge,
      {
        defaultStyle,
        defaultInterpolate,
        confCurve: conf.curve
      },
      elkContext
    );
    Object.assign(edge, edgeData);
  });
}
__name(applyElkEdgeRenderData, "applyElkEdgeRenderData");
function buildFallbackEdgeClasses(edge) {
  if (edge.classes !== void 0) {
    return edge.classes;
  }
  if (edge.start && edge.end) {
    return `flowchart-link LS_${edge.start} LE_${edge.end}`;
  }
  return void 0;
}
__name(buildFallbackEdgeClasses, "buildFallbackEdgeClasses");
function computeStroke(stroke, defaultStyle, defaultLabelStyle) {
  let thickness = "normal";
  let pattern = "solid";
  let style = [];
  let labelStyle = [];
  if (stroke === "dotted") {
    pattern = "dotted";
    style = ["fill:none", "stroke-width:2px", "stroke-dasharray:3"];
  } else if (stroke === "thick") {
    thickness = "thick";
    style = ["stroke-width: 3.5px", "fill:none"];
  } else {
    style = defaultStyle ?? ["fill:none"];
    if (defaultLabelStyle !== void 0) {
      labelStyle = defaultLabelStyle;
    }
  }
  return { thickness, pattern, style, labelStyle };
}
__name(computeStroke, "computeStroke");
function getCurve(edgeInterpolate, edgesDefaultInterpolate, confCurve) {
  if (edgeInterpolate !== void 0) {
    return edgeInterpolate;
  }
  if (edgesDefaultInterpolate !== void 0) {
    return edgesDefaultInterpolate;
  }
  return confCurve;
}
__name(getCurve, "getCurve");
function buildEdgeData(edge, defaults, elkContext) {
  const edgeData = {};
  edgeData.minlen = edge.minlen ?? edge.length ?? 1;
  edgeData.text = edge.text ?? edge.label;
  edgeData.arrowhead = edge.arrowhead ?? (edge.type === "arrow_open" ? "none" : "normal");
  const arrowMap = ARROW_MAP[edge.type ?? "arrow_open"] ?? ARROW_MAP.arrow_open;
  edgeData.arrowTypeStart = edge.arrowTypeStart ?? arrowMap[0];
  edgeData.arrowTypeEnd = edge.arrowTypeEnd ?? arrowMap[1];
  edgeData.startLabelRight = edge.startLabelRight;
  edgeData.endLabelLeft = edge.endLabelLeft;
  const strokeRes = computeStroke(edge.stroke, defaults.defaultStyle, defaults.defaultLabelStyle);
  edgeData.thickness = edge.thickness ?? strokeRes.thickness;
  edgeData.pattern = edge.pattern ?? strokeRes.pattern;
  edgeData.style = edge.style ?? strokeRes.style;
  edgeData.labelStyle = edge.labelStyle ?? strokeRes.labelStyle;
  edgeData.classes = buildFallbackEdgeClasses(edge);
  edgeData.curve = elkContext.interpolateToCurve(
    getCurve(edge.curve ?? edge.interpolate, defaults.defaultInterpolate, defaults.confCurve),
    curveLinear
  );
  const hasText = (edgeData.text ?? "") !== "";
  if (edge.arrowheadStyle !== void 0) {
    edgeData.arrowheadStyle = edge.arrowheadStyle;
  } else if (hasText || edge.style !== void 0) {
    edgeData.arrowheadStyle = "fill: #333";
  }
  edgeData.labelpos = edge.labelpos ?? (hasText ? "c" : void 0);
  edgeData.labelType = edge.labelType;
  edgeData.label = (edge.label ?? edgeData.text ?? "").replace(
    elkContext.common.lineBreakRegex,
    "\n"
  );
  return edgeData;
}
__name(buildEdgeData, "buildEdgeData");
function getEffectiveGroupWidth(node) {
  return Math.max(node.width ?? 0, groupTitleWidth(node));
}
__name(getEffectiveGroupWidth, "getEffectiveGroupWidth");
function boundsFor(node) {
  const width = node?.isGroup ? getEffectiveGroupWidth(node) : node.width;
  return {
    x: node.offset.posX + node.width / 2,
    y: node.offset.posY + node.height / 2,
    width: width ?? 0,
    height: node.height ?? 0,
    padding: node.padding
  };
}
__name(boundsFor, "boundsFor");
function approxEq(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}
__name(approxEq, "approxEq");
function isCenterApprox(point, node) {
  return approxEq(point.x, node.x ?? 0) && approxEq(point.y, node.y ?? 0);
}
__name(isCenterApprox, "isCenterApprox");
function getCandidateBorderPoint(points, node, side) {
  if (!points?.length) {
    return { candidate: { x: node.x ?? 0, y: node.y ?? 0 }, centerApprox: true };
  }
  if (side === "start") {
    const first = points[0];
    const centerApprox = isCenterApprox(first, node);
    const candidate = centerApprox && points.length > 1 ? points[1] : first;
    return { candidate, centerApprox };
  } else {
    const last = points[points.length - 1];
    const centerApprox = isCenterApprox(last, node);
    const candidate = centerApprox && points.length > 1 ? points[points.length - 2] : last;
    return { candidate, centerApprox };
  }
}
__name(getCandidateBorderPoint, "getCandidateBorderPoint");
function dropAutoCenterPoint(points, side, doDrop) {
  if (!doDrop) {
    return;
  }
  if (side === "start") {
    if (points.length > 0) {
      points.shift();
    }
  } else {
    if (points.length > 0) {
      points.pop();
    }
  }
}
__name(dropAutoCenterPoint, "dropAutoCenterPoint");
function clipGroupEndpoint(points, bounds, side) {
  const step = side === "start" ? 1 : -1;
  let index = side === "start" ? 0 : points.length - 1;
  const terminalIndex = index;
  while (index >= 0 && index < points.length && !outsideNode(bounds, points[index])) {
    index += step;
  }
  if (index === terminalIndex || index < 0 || index >= points.length) {
    return false;
  }
  const outside = points[index];
  const inside = points[index - step];
  const dx = outside.x - inside.x;
  const dy = outside.y - inside.y;
  const tx = dx === 0 ? Infinity : (bounds.x + Math.sign(dx) * bounds.width / 2 - inside.x) / dx;
  const ty = dy === 0 ? Infinity : (bounds.y + Math.sign(dy) * bounds.height / 2 - inside.y) / dy;
  const t = Math.min(tx, ty);
  const crossing = { x: inside.x + t * dx, y: inside.y + t * dy };
  if (side === "start") {
    points.splice(0, index, crossing);
  } else {
    points.splice(index + 1, points.length - index - 1, crossing);
  }
  return true;
}
__name(clipGroupEndpoint, "clipGroupEndpoint");
function applyStartIntersectionIfNeeded(points, startNode, startBounds, log) {
  let firstOutsideStartIndex = -1;
  for (const [index, point] of points.entries()) {
    if (outsideNode(startBounds, point)) {
      firstOutsideStartIndex = index;
      break;
    }
  }
  if (firstOutsideStartIndex !== -1) {
    const outsidePointForStart = points[firstOutsideStartIndex];
    const startCenter = points[0];
    const startIntersection = computeNodeIntersection(
      startNode,
      startBounds,
      outsidePointForStart,
      startCenter
    );
    replaceEndpoint(points, "start", startIntersection);
    log.debug("UIO cutter2: start-only intersection applied", { startIntersection });
  }
}
__name(applyStartIntersectionIfNeeded, "applyStartIntersectionIfNeeded");
function applyEndIntersectionIfNeeded(points, endNode, endBounds, log) {
  let outsideIndexForEnd = -1;
  for (let index = points.length - 1; index >= 0; index--) {
    if (outsideNode(endBounds, points[index])) {
      outsideIndexForEnd = index;
      break;
    }
  }
  if (outsideIndexForEnd !== -1) {
    const outsidePointForEnd = points[outsideIndexForEnd];
    const endCenter = points[points.length - 1];
    const endIntersection = computeNodeIntersection(
      endNode,
      endBounds,
      outsidePointForEnd,
      endCenter
    );
    replaceEndpoint(points, "end", endIntersection);
    log.debug("UIO cutter2: end-only intersection applied", { endIntersection });
  }
}
__name(applyEndIntersectionIfNeeded, "applyEndIntersectionIfNeeded");
function attachAlongDepartureAxis(node, bounds, points, portIndex, step) {
  if (node?.isGroup) {
    return null;
  }
  const port = points[portIndex];
  const next = points[portIndex + step];
  if (!port || !next) {
    return null;
  }
  return outlineAttachPoint(node, bounds, port, next);
}
__name(attachAlongDepartureAxis, "attachAlongDepartureAxis");
function cutter2(startNode, endNode, originalPoints, log) {
  const startBounds = boundsFor(startNode);
  const endBounds = boundsFor(endNode);
  if (originalPoints.length === 0) {
    return [];
  }
  const points = [...originalPoints];
  const startCenter = points[0];
  const endCenter = points[points.length - 1];
  log.debug("PPP cutter2: bounds", { startBounds, endBounds });
  log.debug("PPP cutter2: original points", originalPoints);
  let firstOutsideStartIndex = -1;
  for (const [index, point] of points.entries()) {
    if (firstOutsideStartIndex === -1 && outsideNode(startBounds, point)) {
      firstOutsideStartIndex = index;
    }
  }
  if (firstOutsideStartIndex !== -1) {
    const outsidePointForStart = points[firstOutsideStartIndex];
    const startIntersection = (
      // Prefer an attachment on the edge's own departure axis; see
      // `outlineAttachPoint`. Falls back to the centre-ray intersection, which
      // is all a non-axis-aligned or shapeless endpoint can offer.
      attachAlongDepartureAxis(startNode, startBounds, points, firstOutsideStartIndex, 1) ?? computeNodeIntersection(startNode, startBounds, outsidePointForStart, startCenter)
    );
    log.debug("UIO cutter2: start intersection", startIntersection);
    replaceEndpoint(points, "start", startIntersection);
  }
  let outsidePointForEnd = null;
  let outsideIndexForEnd = -1;
  for (let index = points.length - 1; index >= 0; index--) {
    if (outsideNode(endBounds, points[index])) {
      outsidePointForEnd = points[index];
      outsideIndexForEnd = index;
      break;
    }
  }
  if (!outsidePointForEnd && points.length > 1) {
    outsidePointForEnd = points[points.length - 2];
    outsideIndexForEnd = points.length - 2;
  }
  if (outsidePointForEnd) {
    const endIntersection = attachAlongDepartureAxis(endNode, endBounds, points, outsideIndexForEnd, -1) ?? computeNodeIntersection(endNode, endBounds, outsidePointForEnd, endCenter);
    log.debug("UIO cutter2: end intersection", { endIntersection, outsideIndexForEnd });
    replaceEndpoint(points, "end", endIntersection);
  }
  if (points.length > 1) {
    const lastPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];
    const distance = Math.sqrt(
      (lastPoint.x - secondLastPoint.x) ** 2 + (lastPoint.y - secondLastPoint.y) ** 2
    );
    if (distance < 2) {
      log.debug("UIO cutter2: trimming tail point (too close)", {
        distance,
        lastPoint,
        secondLastPoint
      });
      points.pop();
    }
  }
  log.debug("UIO cutter2: final points", points);
  return points;
}
__name(cutter2, "cutter2");
export {
  render
};
