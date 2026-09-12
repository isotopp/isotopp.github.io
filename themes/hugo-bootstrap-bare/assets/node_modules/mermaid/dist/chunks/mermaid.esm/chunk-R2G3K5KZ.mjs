import {
  getSubGraphTitleMargins
} from "./chunk-VOXL5ABF.mjs";
import {
  createLabel_default,
  createRoundedRectPathD,
  intersect_rect_default
} from "./chunk-BULPQSRM.mjs";
import {
  at
} from "./chunk-PLCLPJVV.mjs";
import {
  styles2String,
  userNodeOverrides
} from "./chunk-ECMXQ4X3.mjs";
import {
  createText
} from "./chunk-LBQO3HYP.mjs";
import {
  evaluate,
  getConfig2 as getConfig,
  getEffectiveHtmlLabels
} from "./chunk-AHS5MEEA.mjs";
import {
  log,
  select_default
} from "./chunk-X5WJYYCX.mjs";
import {
  __name
} from "./chunk-PTVI3W5X.mjs";

// src/rendering-util/rendering-elements/clusters/swimlane.js
var swimlane = /* @__PURE__ */ __name(async (parent, node) => {
  const siteConfig = getConfig();
  const { themeVariables, handDrawnSeed } = siteConfig;
  const { clusterBkg, clusterBorder } = themeVariables;
  const laneStroke = clusterBorder;
  const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = styles2String(node);
  const shapeSvg = parent.insert("g").attr("class", "cluster swimlane " + (node.cssClasses || "")).attr("id", node.id).attr("data-id", node.id).attr("data-et", "cluster").attr("data-look", node.look);
  const useHtmlLabels = evaluate(siteConfig.flowchart.htmlLabels);
  const isLR = node.direction === "LR";
  const labelEl = shapeSvg.insert("g").attr("class", "cluster-label swimlane-label");
  const text = await createText(labelEl, node.label, {
    style: node.labelStyle,
    useHtmlLabels,
    isNode: true,
    width: node.width
  });
  let bbox = text.getBBox();
  if (useHtmlLabels) {
    const div = text.children[0];
    const dv = select_default(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const padding = node.padding ?? 0;
  const width = node.width <= bbox.width + padding ? bbox.width + padding : node.width;
  if (node.width <= bbox.width + padding) {
    node.diff = (width - node.width) / 2 - padding;
  } else {
    node.diff = -padding;
  }
  const height = node.height;
  const laneTop = node.y - height / 2;
  const laneBottom = node.y + height / 2;
  const laneLeft = node.x - width / 2;
  const contentTop = node.swimlaneContentTop !== void 0 ? node.swimlaneContentTop : laneTop + height / 3;
  const titlePaddingY = isLR ? 4 : 0;
  const desiredTitleSize = bbox.height + 2 * titlePaddingY;
  let titleRect;
  let bodyRect;
  if (isLR) {
    const titleWidth = Math.max(desiredTitleSize, bbox.height + 2 * titlePaddingY);
    const bodyX = laneLeft + titleWidth;
    const bodyWidth = Math.max(0, width - titleWidth);
    if (node.look === "handDrawn") {
      const rc = at.svg(shapeSvg);
      const titleOptions = userNodeOverrides(node, {
        roughness: 0.7,
        fill: clusterBkg,
        stroke: laneStroke,
        fillWeight: 3,
        seed: handDrawnSeed
      });
      const bodyOptions = userNodeOverrides(node, {
        roughness: 0.7,
        fill: "none",
        stroke: laneStroke,
        seed: handDrawnSeed
      });
      const roughTitle = rc.rectangle(laneLeft, laneTop, titleWidth, height, titleOptions);
      titleRect = shapeSvg.insert(() => roughTitle, ":first-child");
      const roughBody = rc.rectangle(bodyX, laneTop, bodyWidth, height, bodyOptions);
      bodyRect = shapeSvg.insert(() => roughBody, ":first-child");
      titleRect.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
      titleRect.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
    } else {
      titleRect = shapeSvg.insert("rect", ":first-child");
      bodyRect = shapeSvg.insert("rect", ":first-child");
      titleRect.attr("class", "swimlane-title").attr("style", nodeStyles).attr("x", laneLeft).attr("y", laneTop).attr("width", titleWidth).attr("height", height).attr("fill", clusterBkg).attr("stroke", laneStroke);
      bodyRect.attr("class", "swimlane-body").attr("style", nodeStyles).attr("x", bodyX).attr("y", laneTop).attr("width", bodyWidth).attr("height", height).attr("fill", "none").attr("stroke", laneStroke);
    }
    const labelCenterX = laneLeft + titleWidth / 2;
    const labelCenterY = node.y;
    labelEl.attr(
      "transform",
      `translate(${labelCenterX}, ${labelCenterY}) rotate(-90) translate(${-bbox.width / 2}, ${-bbox.height / 2})`
    );
  } else {
    const headerMaxHeight = Math.max(0, contentTop - laneTop);
    const titleHeight = Math.min(desiredTitleSize, headerMaxHeight);
    const bodyY = laneTop + titleHeight;
    const contentHeight = Math.max(0, laneBottom - bodyY);
    const x = node.x - width / 2;
    if (node.look === "handDrawn") {
      const rc = at.svg(shapeSvg);
      const titleOptions = userNodeOverrides(node, {
        roughness: 0.7,
        fill: clusterBkg,
        stroke: laneStroke,
        fillWeight: 3,
        seed: handDrawnSeed
      });
      const bodyOptions = userNodeOverrides(node, {
        roughness: 0.7,
        fill: "none",
        stroke: laneStroke,
        seed: handDrawnSeed
      });
      const roughTitle = rc.rectangle(x, laneTop, width, titleHeight, titleOptions);
      titleRect = shapeSvg.insert(() => roughTitle, ":first-child");
      const roughBody = rc.rectangle(x, bodyY, width, contentHeight, bodyOptions);
      bodyRect = shapeSvg.insert(() => roughBody, ":first-child");
      titleRect.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
      titleRect.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
    } else {
      titleRect = shapeSvg.insert("rect", ":first-child");
      bodyRect = shapeSvg.insert("rect", ":first-child");
      titleRect.attr("class", "swimlane-title").attr("style", nodeStyles).attr("x", x).attr("y", laneTop).attr("width", width).attr("height", titleHeight).attr("fill", clusterBkg).attr("stroke", laneStroke);
      bodyRect.attr("class", "swimlane-body").attr("style", nodeStyles).attr("x", x).attr("y", bodyY).attr("width", width).attr("height", contentHeight).attr("fill", "none").attr("stroke", laneStroke);
    }
    const labelX = node.x - bbox.width / 2;
    const labelY = laneTop + (titleHeight - bbox.height) / 2;
    labelEl.attr("transform", `translate(${labelX}, ${labelY})`);
  }
  log.trace("Swimlane data ", node, JSON.stringify(node));
  if (labelStyles) {
    const span = labelEl.select("span");
    if (span) {
      span.attr("style", labelStyles);
    }
  }
  node.offsetX = 0;
  node.width = width;
  node.height = height;
  node.offsetY = bbox.height - padding / 2;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: bbox };
}, "swimlane");

// src/rendering-util/rendering-elements/clusters.js
var rect = /* @__PURE__ */ __name(async (parent, node) => {
  log.info("Creating subgraph rect for ", node.id, node);
  const siteConfig = getConfig();
  const { themeVariables, handDrawnSeed } = siteConfig;
  const { clusterBkg, clusterBorder } = themeVariables;
  const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = styles2String(node);
  const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
  const useHtmlLabels = getEffectiveHtmlLabels(siteConfig);
  const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
  let text;
  if (node.labelType === "markdown") {
    text = await createText(labelEl, node.label, {
      style: node.labelStyle,
      useHtmlLabels,
      isNode: true,
      width: node.width
    });
  } else {
    text = await createLabel_default(labelEl, node.label, node.labelStyle || "", false, true);
  }
  let bbox = text.getBBox();
  if (getEffectiveHtmlLabels(siteConfig)) {
    const div = text.children[0];
    const dv = select_default(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
  if (node.width <= bbox.width + node.padding) {
    node.diff = (width - node.width) / 2 - node.padding;
  } else {
    node.diff = -node.padding;
  }
  const height = node.height;
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  log.trace("Data ", node, JSON.stringify(node));
  let rect2;
  if (node.look === "handDrawn") {
    const rc = at.svg(shapeSvg);
    const options = userNodeOverrides(node, {
      roughness: 0.7,
      fill: clusterBkg,
      // fill: 'red',
      stroke: clusterBorder,
      fillWeight: 3,
      seed: handDrawnSeed
    });
    const roughNode = rc.path(createRoundedRectPathD(x, y, width, height, 0), options);
    rect2 = shapeSvg.insert(() => {
      log.debug("Rough node insert CXC", roughNode);
      return roughNode;
    }, ":first-child");
    rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
    rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
  } else {
    rect2 = shapeSvg.insert("rect", ":first-child");
    rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
  }
  const { subGraphTitleTopMargin } = getSubGraphTitleMargins(siteConfig);
  labelEl.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`
  );
  if (labelStyles) {
    const span = labelEl.select("span");
    if (span) {
      span.attr("style", labelStyles);
    }
  }
  const rectBox = rect2.node().getBBox();
  node.offsetX = 0;
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.offsetY = bbox.height - node.padding / 2;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: bbox };
}, "rect");
var noteGroup = /* @__PURE__ */ __name((parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "note-cluster").attr("id", node.domId);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", node.width + padding).attr("height", node.height + padding).attr("fill", "none");
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: { width: 0, height: 0 } };
}, "noteGroup");
var roundedWithTitle = /* @__PURE__ */ __name(async (parent, node) => {
  const siteConfig = getConfig();
  const { themeVariables, handDrawnSeed } = siteConfig;
  const { altBackground, compositeBackground, compositeTitleBackground, nodeBorder } = themeVariables;
  const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.domId).attr("data-id", node.id).attr("data-look", node.look);
  const outerRectG = shapeSvg.insert("g", ":first-child");
  const label = shapeSvg.insert("g").attr("class", "cluster-label");
  let innerRect = shapeSvg.append("rect");
  const text = await createLabel_default(label, node.label, node.labelStyle, void 0, true);
  let bbox = text.getBBox();
  if (getEffectiveHtmlLabels(siteConfig)) {
    const div = text.children[0];
    const dv = select_default(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  const width = (node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width) + padding;
  if (node.width <= bbox.width + node.padding) {
    node.diff = (width - node.width) / 2 - node.padding;
  } else {
    node.diff = -node.padding;
  }
  const height = node.height + padding;
  const innerHeight = node.height + padding - bbox.height - 6;
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  node.width = width;
  const innerY = node.y - node.height / 2 - halfPadding + bbox.height + 2;
  let rect2;
  if (node.look === "handDrawn") {
    const isAlt = node.cssClasses.includes("statediagram-cluster-alt");
    const rc = at.svg(shapeSvg);
    const roughOuterNode = node.rx || node.ry ? rc.path(createRoundedRectPathD(x, y, width, height, 10), {
      roughness: 0.7,
      fill: compositeTitleBackground,
      fillStyle: "solid",
      stroke: nodeBorder,
      seed: handDrawnSeed
    }) : rc.rectangle(x, y, width, height, { seed: handDrawnSeed });
    rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
    const roughInnerNode = rc.rectangle(x, innerY, width, innerHeight, {
      fill: isAlt ? altBackground : compositeBackground,
      fillStyle: isAlt ? "hachure" : "solid",
      stroke: nodeBorder,
      seed: handDrawnSeed
    });
    rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
    innerRect = shapeSvg.insert(() => roughInnerNode);
  } else {
    rect2 = outerRectG.insert("rect", ":first-child");
    const outerRectClass = "outer";
    rect2.attr("class", outerRectClass).attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
    innerRect.attr("class", "inner").attr("x", x).attr("y", innerY).attr("width", width).attr("height", innerHeight);
  }
  label.attr(
    "transform",
    `translate(${node.x - bbox.width / 2}, ${y + 1 - (getEffectiveHtmlLabels(siteConfig) ? 0 : 3)})`
  );
  const rectBox = rect2.node().getBBox();
  node.height = rectBox.height;
  node.offsetX = 0;
  node.offsetY = bbox.height - node.padding / 2;
  node.labelBBox = bbox;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: bbox };
}, "roundedWithTitle");
var kanbanSection = /* @__PURE__ */ __name(async (parent, node) => {
  log.info("Creating subgraph rect for ", node.id, node);
  const siteConfig = getConfig();
  const { themeVariables, handDrawnSeed } = siteConfig;
  const { clusterBkg, clusterBorder } = themeVariables;
  const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = styles2String(node);
  const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
  const useHtmlLabels = getEffectiveHtmlLabels(siteConfig);
  const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
  const text = await createText(labelEl, node.label, {
    style: node.labelStyle,
    useHtmlLabels,
    isNode: true,
    width: node.width
  });
  let bbox = text.getBBox();
  if (getEffectiveHtmlLabels(siteConfig)) {
    const div = text.children[0];
    const dv = select_default(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
  if (node.width <= bbox.width + node.padding) {
    node.diff = (width - node.width) / 2 - node.padding;
  } else {
    node.diff = -node.padding;
  }
  const height = node.height;
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  log.trace("Data ", node, JSON.stringify(node));
  let rect2;
  if (node.look === "handDrawn") {
    const rc = at.svg(shapeSvg);
    const options = userNodeOverrides(node, {
      roughness: 0.7,
      fill: clusterBkg,
      // fill: 'red',
      stroke: clusterBorder,
      fillWeight: 4,
      seed: handDrawnSeed
    });
    const roughNode = rc.path(createRoundedRectPathD(x, y, width, height, node.rx), options);
    rect2 = shapeSvg.insert(() => {
      log.debug("Rough node insert CXC", roughNode);
      return roughNode;
    }, ":first-child");
    rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
    rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
  } else {
    rect2 = shapeSvg.insert("rect", ":first-child");
    rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
  }
  const { subGraphTitleTopMargin } = getSubGraphTitleMargins(siteConfig);
  labelEl.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`
  );
  if (labelStyles) {
    const span = labelEl.select("span");
    if (span) {
      span.attr("style", labelStyles);
    }
  }
  const rectBox = rect2.node().getBBox();
  node.offsetX = 0;
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.offsetY = bbox.height - node.padding / 2;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: bbox };
}, "kanbanSection");
var divider = /* @__PURE__ */ __name((parent, node) => {
  const siteConfig = getConfig();
  const { themeVariables, handDrawnSeed } = siteConfig;
  const { nodeBorder } = themeVariables;
  const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
  const outerRectG = shapeSvg.insert("g", ":first-child");
  const padding = 0 * node.padding;
  const width = node.width + padding;
  node.diff = -node.padding;
  const height = node.height + padding;
  const x = node.x - width / 2;
  const y = node.y - height / 2;
  node.width = width;
  let rect2;
  if (node.look === "handDrawn") {
    const rc = at.svg(shapeSvg);
    const roughOuterNode = rc.rectangle(x, y, width, height, {
      fill: "lightgrey",
      roughness: 0.5,
      strokeLineDash: [5],
      stroke: nodeBorder,
      seed: handDrawnSeed
    });
    rect2 = shapeSvg.insert(() => roughOuterNode, ":first-child");
  } else {
    rect2 = outerRectG.insert("rect", ":first-child");
    let outerRectClass = "outer";
    if (node.look === "neo") {
      outerRectClass = "divider";
    } else {
      outerRectClass = "divider";
    }
    rect2.attr("class", outerRectClass).attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
  }
  const rectBox = rect2.node().getBBox();
  node.height = rectBox.height;
  node.offsetX = 0;
  node.offsetY = 0;
  node.intersect = function(point) {
    return intersect_rect_default(node, point);
  };
  return { cluster: shapeSvg, labelBBox: {} };
}, "divider");
var squareRect = rect;
var shapes = {
  rect,
  squareRect,
  roundedWithTitle,
  noteGroup,
  divider,
  kanbanSection,
  swimlane
};
var clusterElems = /* @__PURE__ */ new Map();
var insertCluster = /* @__PURE__ */ __name(async (elem, node) => {
  const shape = node.shape || "rect";
  const cluster = await shapes[shape](elem, node);
  clusterElems.set(node.id, cluster);
  return cluster;
}, "insertCluster");
var clear = /* @__PURE__ */ __name(() => {
  clusterElems = /* @__PURE__ */ new Map();
}, "clear");

export {
  insertCluster,
  clear
};
