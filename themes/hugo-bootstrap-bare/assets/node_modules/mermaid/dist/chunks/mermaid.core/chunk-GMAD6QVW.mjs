import {
  getIconSVG,
  isIconAvailable
} from "./chunk-PWAF6VOD.mjs";
import {
  decodeEntities
} from "./chunk-75Z2AOVW.mjs";
import {
  common_default,
  getConfig,
  hasKatex,
  renderKatexSanitized,
  sanitizeText
} from "./chunk-DU6HZSFF.mjs";
import {
  log
} from "./chunk-X3CZISLH.mjs";
import {
  __name
} from "./chunk-Y2CYZVJY.mjs";

// src/profiler.ts
var hasPerformance = typeof performance !== "undefined" && typeof performance.now === "function";
var now = /* @__PURE__ */ __name(() => hasPerformance ? performance.now() : 0, "now");
var MEASURE_PREFIX = "\u{1F9DC} ";
var DEVTOOLS_TRACK = "Mermaid render";
var DEVTOOLS_TRACK_GROUP = "Mermaid";
var PHASE_COLORS = {
  parse: "tertiary",
  prepare: "secondary",
  measure: "primary",
  layout: "primary-dark",
  layoutCore: "error",
  draw: "primary-light",
  paint: "secondary-dark",
  serialize: "tertiary-dark",
  render: "primary-light"
};
var Profiler = class {
  constructor() {
    /** Runtime toggle. Off by default even in profiling builds. */
    this.enabled = false;
    /** Log a summary to the console automatically when each root span closes. */
    this.autoPrint = true;
    /** Completed render trees, oldest first, capped at {@link maxRecords}. */
    this.records = [];
    this.maxRecords = 200;
    this.roots = [];
    this.stack = [];
    this.buckets = {};
  }
  static {
    __name(this, "Profiler");
  }
  enable() {
    this.enabled = true;
    return this;
  }
  disable() {
    this.enabled = false;
    return this;
  }
  /** Begin a new top-level measurement (one per diagram render). */
  start(label) {
    if (!this.enabled) {
      return;
    }
    this.roots = [];
    this.stack = [];
    this.buckets = {};
    this.begin(label);
  }
  /**
   * Accumulate the wall-clock of a synchronous sub-operation into a named bucket,
   * summed over every call within the render — for hot operations that run too
   * often to be individual tree spans (e.g. per-node `getBBox`). Returns the
   * function's result. No-op (just calls `fn`) unless enabled.
   */
  tickSync(name, fn) {
    if (!this.enabled) {
      return fn();
    }
    const t0 = now();
    try {
      return fn();
    } finally {
      this.buckets[name] = (this.buckets[name] ?? 0) + (now() - t0);
    }
  }
  /**
   * Async variant of {@link tickSync}. WARNING: only meaningful for operations
   * that run one-at-a-time. Do NOT use it for calls awaited concurrently (e.g.
   * `Promise.all(nodes.map(...))`) — their wall-clocks overlap and the summed
   * bucket balloons far past the real elapsed time. For concurrent CPU
   * attribution use a DevTools CPU profile instead.
   */
  async tick(name, fn) {
    if (!this.enabled) {
      return fn();
    }
    const t0 = now();
    try {
      return await fn();
    } finally {
      this.buckets[name] = (this.buckets[name] ?? 0) + (now() - t0);
    }
  }
  /** End the current top-level measurement and optionally print a summary. */
  stop() {
    if (!this.enabled) {
      return void 0;
    }
    while (this.stack.length > 0) {
      this.end();
    }
    const root = this.roots.at(-1);
    const label = this.runLabel ?? root?.name;
    if (root) {
      this.records.push({ label: label ?? root.name, tree: root, buckets: { ...this.buckets } });
      if (this.records.length > this.maxRecords) {
        this.records.splice(0, this.records.length - this.maxRecords);
      }
      if (this.autoPrint) {
        this.printSummary(root, label);
      }
    }
    this.runLabel = void 0;
    return root;
  }
  /** Open a child span. Pair with {@link end}. No-op unless enabled. */
  begin(name) {
    if (!this.enabled) {
      return;
    }
    const span = { name, start: now(), duration: -1, children: [] };
    const parent = this.stack.at(-1);
    if (parent) {
      parent.children.push(span);
    } else {
      this.roots.push(span);
    }
    this.stack.push(span);
    if (hasPerformance && typeof performance.mark === "function") {
      try {
        performance.mark(`${MEASURE_PREFIX}${name} \u25B6`);
      } catch {
      }
    }
  }
  /** Close the most recently opened span. No-op unless enabled. */
  end() {
    if (!this.enabled) {
      return;
    }
    const span = this.stack.pop();
    if (!span) {
      return;
    }
    const end = now();
    span.duration = end - span.start;
    if (hasPerformance && typeof performance.measure === "function") {
      try {
        performance.measure(`${MEASURE_PREFIX}${span.name}`, {
          start: span.start,
          end,
          detail: {
            devtools: {
              dataType: "track-entry",
              track: DEVTOOLS_TRACK,
              trackGroup: DEVTOOLS_TRACK_GROUP,
              color: PHASE_COLORS[span.name] ?? "primary",
              tooltipText: `${span.name} \u2014 ${span.duration.toFixed(1)} ms`
            }
          }
        });
      } catch {
      }
    }
  }
  /**
   * Measure an async phase. Returns the wrapped function's result and rethrows
   * any error after closing the span, so instrumentation never swallows
   * failures or leaks an open span. No measurement overhead unless enabled.
   */
  async span(name, fn) {
    if (!this.enabled) {
      return fn();
    }
    this.begin(name);
    try {
      return await fn();
    } finally {
      this.end();
    }
  }
  /** The most recent completed render tree, or `undefined`. */
  report() {
    return this.records.at(-1)?.tree ?? this.roots.at(-1);
  }
  /** Drop all collected records and any in-progress spans. */
  clear() {
    this.records.length = 0;
    this.roots = [];
    this.stack = [];
    this.runLabel = void 0;
  }
  reset() {
    this.roots = [];
    this.stack = [];
  }
  printSummary(root = this.report(), label) {
    if (!root) {
      return;
    }
    const total = root.duration;
    const heading = label && label !== root.name ? `${root.name} [${label}]` : root.name;
    const lines = ["ms        %    phase"];
    const walk = /* @__PURE__ */ __name((span, depth) => {
      const indent = "  ".repeat(depth);
      const ms = span.duration.toFixed(1).padStart(8);
      const pct = total > 0 ? `${(span.duration / total * 100).toFixed(0).padStart(3)}%` : "   -";
      lines.push(`${ms}  ${pct}  ${indent}${span.name}`);
      for (const child of span.children) {
        walk(child, depth + 1);
      }
      if (span.children.length > 0) {
        const childTotal = span.children.reduce((sum, c) => sum + c.duration, 0);
        const self = span.duration - childTotal;
        if (self > 0.5) {
          const selfMs = self.toFixed(1).padStart(8);
          lines.push(`${selfMs}       ${indent}  (self)`);
        }
      }
    }, "walk");
    walk(root, 0);
    const bucketNames = Object.keys(this.buckets);
    if (bucketNames.length > 0) {
      lines.push("\u2014\u2014 buckets (summed) \u2014\u2014");
      for (const name of bucketNames) {
        lines.push(`${this.buckets[name].toFixed(1).padStart(8)}       ${name}`);
      }
    }
    console.log(`${MEASURE_PREFIX}mermaid render profile \xB7 ${heading}
${lines.join("\n")}`);
  }
};
globalThis.injected ??= {
  includeLargeFeatures: true,
  profiling: false,
  version: "0.0.0"
};
var profiler = false ? globalThis.__mermaidProfiler ??= new Profiler() : /* @__PURE__ */ new Profiler();

// src/rendering-util/fastdom.ts
import fastdomModule from "fastdom";
import fastdomPromised from "fastdom/extensions/fastdom-promised.js";
var fastdom = (
  // @ts-expect-error -- fastdom types aren't yet ESM-compatible, we need this hack
  fastdomModule.extend({
    /**
     * `requestAnimationFrame` is too slow compared to `queueMicrotask`.
     */
    raf(cb) {
      if (typeof queueMicrotask === "function") {
        queueMicrotask(cb);
      } else {
        setTimeout(cb, 0);
      }
    }
  }).extend(fastdomPromised)
);
var fastdom_default = fastdom;

// src/rendering-util/createText.ts
import { select } from "d3";

// src/rendering-util/handle-markdown-text.ts
import { marked } from "marked";
import { dedent } from "ts-dedent";
function preprocessMarkdown(markdown, { markdownAutoWrap }) {
  const withoutBR = markdown.replace(/<br\/>/g, "\n");
  const withoutMultipleNewlines = withoutBR.replace(/\n{2,}/g, "\n");
  const withoutExtraSpaces = dedent(withoutMultipleNewlines);
  if (markdownAutoWrap === false) {
  }
  return withoutExtraSpaces;
}
__name(preprocessMarkdown, "preprocessMarkdown");
function nonMarkdownToLines(nonMarkdownText) {
  return nonMarkdownText.split(/\\n|\n|<br\s*\/?>/gi).map(
    (line) => line.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((word) => ({ content: word, type: "normal" })) ?? []
  );
}
__name(nonMarkdownToLines, "nonMarkdownToLines");
function markdownToLines(markdown, config = {}) {
  const preprocessedMarkdown = preprocessMarkdown(markdown, config);
  const nodes = marked.lexer(preprocessedMarkdown);
  const lines = [[]];
  let currentLine = 0;
  function processNode(node, parentType = "normal") {
    if (node.type === "text") {
      const textLines = node.text.split("\n");
      textLines.forEach((textLine, index) => {
        if (index !== 0) {
          currentLine++;
          lines.push([]);
        }
        textLine.split(" ").forEach((word) => {
          word = word.replace(/&#39;/g, `'`);
          if (word) {
            lines[currentLine].push({ content: word, type: parentType });
          }
        });
      });
    } else if (node.type === "strong" || node.type === "em") {
      node.tokens.forEach((contentNode) => {
        processNode(contentNode, node.type);
      });
    } else if (node.type === "html") {
      lines[currentLine].push({ content: node.text, type: "normal" });
    }
  }
  __name(processNode, "processNode");
  nodes.forEach((treeNode) => {
    if (treeNode.type === "paragraph") {
      treeNode.tokens?.forEach((contentNode) => {
        processNode(contentNode);
      });
    } else if (treeNode.type === "html") {
      lines[currentLine].push({ content: treeNode.text, type: "normal" });
    } else {
      lines[currentLine].push({ content: treeNode.raw, type: "normal" });
    }
  });
  return lines;
}
__name(markdownToLines, "markdownToLines");
function nonMarkdownToHTML(text) {
  if (!text) {
    return "";
  }
  return `<p>${/**
   * Replace new lines with <br /> tags.
   *
   * Unlike in markdown text, `\n` sequences are treated as line breaks here.
   */
  text.replace(/\\n|\n/g, "<br />")}</p>`;
}
__name(nonMarkdownToHTML, "nonMarkdownToHTML");
function markdownToHTML(markdown, { markdownAutoWrap } = {}) {
  const nodes = marked.lexer(markdown);
  function output(node) {
    if (node.type === "text") {
      if (markdownAutoWrap === false) {
        return node.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;");
      }
      return node.text.replace(/\n */g, "<br/>");
    } else if (node.type === "strong") {
      return `<strong>${node.tokens?.map(output).join("")}</strong>`;
    } else if (node.type === "em") {
      return `<em>${node.tokens?.map(output).join("")}</em>`;
    } else if (node.type === "paragraph") {
      return `<p>${node.tokens?.map(output).join("")}</p>`;
    } else if (node.type === "space") {
      return "";
    } else if (node.type === "html") {
      return `${node.text}`;
    } else if (node.type === "escape") {
      return node.text;
    }
    log.warn(`Unsupported markdown: ${node.type}`);
    return node.raw;
  }
  __name(output, "output");
  return nodes.map(output).join("");
}
__name(markdownToHTML, "markdownToHTML");

// src/rendering-util/splitText.ts
function splitTextToChars(text) {
  if (Intl.Segmenter) {
    return [...new Intl.Segmenter().segment(text)].map((s) => s.segment);
  }
  return [...text];
}
__name(splitTextToChars, "splitTextToChars");
function splitWordToFitWidth(checkFit, word) {
  const characters = splitTextToChars(word.content);
  return splitWordToFitWidthRecursion(checkFit, [], characters, word.type);
}
__name(splitWordToFitWidth, "splitWordToFitWidth");
function splitWordToFitWidthRecursion(checkFit, usedChars, remainingChars, type) {
  if (remainingChars.length === 0) {
    return [
      { content: usedChars.join(""), type },
      { content: "", type }
    ];
  }
  const [nextChar, ...rest] = remainingChars;
  const newWord = [...usedChars, nextChar];
  if (checkFit([{ content: newWord.join(""), type }])) {
    return splitWordToFitWidthRecursion(checkFit, newWord, rest, type);
  }
  if (usedChars.length === 0 && nextChar) {
    usedChars.push(nextChar);
    remainingChars.shift();
  }
  return [
    { content: usedChars.join(""), type },
    { content: remainingChars.join(""), type }
  ];
}
__name(splitWordToFitWidthRecursion, "splitWordToFitWidthRecursion");
function splitLineToFitWidth(line, checkFit) {
  if (line.some(({ content }) => content.includes("\n"))) {
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  }
  return splitLineToFitWidthRecursion(line, checkFit);
}
__name(splitLineToFitWidth, "splitLineToFitWidth");
function splitLineToFitWidthRecursion(words, checkFit, lines = [], newLine = []) {
  if (words.length === 0) {
    if (newLine.length > 0) {
      lines.push(newLine);
    }
    return lines.length > 0 ? lines : [];
  }
  let joiner = "";
  if (words[0].content === " ") {
    joiner = " ";
    words.shift();
  }
  const nextWord = words.shift() ?? { content: " ", type: "normal" };
  const lineWithNextWord = [...newLine];
  if (joiner !== "") {
    lineWithNextWord.push({ content: joiner, type: "normal" });
  }
  lineWithNextWord.push(nextWord);
  if (checkFit(lineWithNextWord)) {
    return splitLineToFitWidthRecursion(words, checkFit, lines, lineWithNextWord);
  }
  if (newLine.length > 0) {
    lines.push(newLine);
    words.unshift(nextWord);
  } else if (nextWord.content) {
    const [line, rest] = splitWordToFitWidth(checkFit, nextWord);
    lines.push([line]);
    if (rest.content) {
      words.unshift(rest);
    }
  }
  return splitLineToFitWidthRecursion(words, checkFit, lines);
}
__name(splitLineToFitWidthRecursion, "splitLineToFitWidthRecursion");

// src/rendering-util/createText.ts
function applyStyle(dom, styleFn) {
  if (styleFn) {
    dom.attr("style", styleFn);
  }
}
__name(applyStyle, "applyStyle");
var maxSafeSizeForWidth = 16384;
async function addHtmlSpan(element, node, width, classes, addBackground = false, config = getConfig()) {
  const fo = element.append("foreignObject");
  fo.attr("width", `${Math.min(10 * width, maxSafeSizeForWidth)}px`);
  fo.attr("height", `${Math.min(10 * width, maxSafeSizeForWidth)}px`);
  const div = fo.append("xhtml:div");
  const sanitizedLabel = hasKatex(node.label) ? await renderKatexSanitized(node.label.replace(common_default.lineBreakRegex, "\n"), config) : sanitizeText(node.label, config);
  const labelClass = node.isNode ? "nodeLabel" : "edgeLabel";
  const span = div.append("span");
  span.html(sanitizedLabel);
  applyStyle(span, node.labelStyle);
  span.attr("class", `${labelClass} ${classes}`);
  applyStyle(div, node.labelStyle);
  div.style("display", "table-cell");
  div.style("white-space", "nowrap");
  div.style("line-height", "1.5");
  if (width !== Number.POSITIVE_INFINITY) {
    div.style("max-width", width + "px");
    div.style("text-align", "center");
  }
  div.attr("xmlns", "http://www.w3.org/1999/xhtml");
  if (addBackground) {
    div.attr("class", "labelBkg");
  }
  const bbox = await fastdom_default.measure(() => div.node().getBoundingClientRect());
  if (bbox.width === width) {
    div.style("display", "table");
    div.style("white-space", "break-spaces");
    div.style("width", width + "px");
  }
  return fo.node();
}
__name(addHtmlSpan, "addHtmlSpan");
function createTspan(textElement, lineIndex, lineHeight, centerText = false) {
  const tspan = textElement.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", lineIndex * lineHeight - 0.1 + "em").attr("dy", lineHeight + "em");
  if (centerText) {
    tspan.attr("text-anchor", "middle");
  }
  return tspan;
}
__name(createTspan, "createTspan");
function computeWidthOfText(parentNode, lineHeight, line) {
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, line);
  const textLength = testSpan.node().getComputedTextLength();
  testElement.remove();
  return textLength;
}
__name(computeWidthOfText, "computeWidthOfText");
function computeDimensionOfText(parentNode, lineHeight, text) {
  const testElement = parentNode.append("text");
  const testSpan = createTspan(testElement, 1, lineHeight);
  updateTextContentAndStyles(testSpan, [{ content: text, type: "normal" }]);
  const textDimension = testSpan.node()?.getBoundingClientRect();
  if (textDimension) {
    testElement.remove();
  }
  return textDimension;
}
__name(computeDimensionOfText, "computeDimensionOfText");
function createFormattedText(width, g, structuredText, addBackground = false, centerText = false) {
  const lineHeight = 1.1;
  const labelGroup = g.append("g");
  const bkg = labelGroup.insert("rect").attr("class", "background").attr("style", "stroke: none");
  const textElement = labelGroup.append("text").attr("y", "-10.1");
  if (centerText) {
    textElement.attr("text-anchor", "middle");
  }
  let lineIndex = 0;
  for (const line of structuredText) {
    const checkWidth = /* @__PURE__ */ __name((line2) => computeWidthOfText(labelGroup, lineHeight, line2) <= width, "checkWidth");
    const linesUnderWidth = checkWidth(line) ? [line] : splitLineToFitWidth(line, checkWidth);
    for (const preparedLine of linesUnderWidth) {
      const tspan = createTspan(textElement, lineIndex, lineHeight, centerText);
      updateTextContentAndStyles(tspan, preparedLine);
      lineIndex++;
    }
  }
  if (addBackground) {
    const bbox = false ? profiler2.tickSync("getBBox", () => textElement.node().getBBox()) : textElement.node().getBBox();
    const padding = 2;
    bkg.attr("x", bbox.x - padding).attr("y", bbox.y - padding).attr("width", bbox.width + 2 * padding).attr("height", bbox.height + 2 * padding);
    return labelGroup.node();
  } else {
    return textElement.node();
  }
}
__name(createFormattedText, "createFormattedText");
function decodeHTMLEntities(text) {
  const regex = /&(amp|lt|gt);/g;
  return text.replace(regex, (match, entity) => {
    switch (entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      default:
        return match;
    }
  });
}
__name(decodeHTMLEntities, "decodeHTMLEntities");
function updateTextContentAndStyles(tspan, wrappedLine) {
  tspan.text("");
  wrappedLine.forEach((word, index) => {
    const innerTspan = tspan.append("tspan").attr("font-style", word.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", word.type === "strong" ? "bold" : "normal");
    if (index === 0) {
      innerTspan.text(decodeHTMLEntities(word.content));
    } else {
      innerTspan.text(" " + decodeHTMLEntities(word.content));
    }
  });
}
__name(updateTextContentAndStyles, "updateTextContentAndStyles");
async function replaceIconSubstring(text, config = {}) {
  const pendingReplacements = [];
  text.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (fullMatch, prefix, iconName) => {
    pendingReplacements.push(
      (async () => {
        const registeredIconName = `${prefix}:${iconName}`;
        if (await isIconAvailable(registeredIconName)) {
          return await getIconSVG(registeredIconName, void 0, { class: "label-icon" });
        } else {
          return `<i class='${sanitizeText(fullMatch, config).replace(":", " ")}'></i>`;
        }
      })()
    );
    return fullMatch;
  });
  const replacements = await Promise.all(pendingReplacements);
  return text.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => replacements.shift() ?? "");
}
__name(replaceIconSubstring, "replaceIconSubstring");
var createText = /* @__PURE__ */ __name(async (el, text = "", {
  style = "",
  isTitle = false,
  classes = "",
  useHtmlLabels = true,
  markdown = true,
  isNode = true,
  /**
   * The width to wrap the text within. Set to `Number.POSITIVE_INFINITY` for no wrapping.
   */
  width = 200,
  addSvgBackground = false
} = {}, config) => {
  log.debug(
    "XYZ createText",
    text,
    style,
    isTitle,
    classes,
    useHtmlLabels,
    isNode,
    "addSvgBackground: ",
    addSvgBackground
  );
  if (useHtmlLabels) {
    const htmlText = markdown ? markdownToHTML(text, config) : nonMarkdownToHTML(text);
    const decodedReplacedText = await replaceIconSubstring(decodeEntities(htmlText), config);
    const inputForKatex = text.replace(/\\\\/g, "\\");
    const node = {
      isNode,
      label: hasKatex(text) ? inputForKatex : decodedReplacedText,
      labelStyle: style.replace("fill:", "color:")
    };
    const vertexNode = await addHtmlSpan(el, node, width, classes, addSvgBackground, config);
    return vertexNode;
  } else {
    const sanitizeBR = decodeEntities(text.replace(/<br\s*\/?>/g, "<br/>"));
    const structuredText = markdown ? markdownToLines(sanitizeBR.replace("<br>", "<br/>"), config) : nonMarkdownToLines(sanitizeBR);
    const svgLabel = createFormattedText(
      width,
      el,
      structuredText,
      text ? addSvgBackground : false,
      !isNode
    );
    if (isNode) {
      if (/stroke:/.exec(style)) {
        style = style.replace("stroke:", "lineColor:");
      }
      const nodeLabelTextStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      select(svgLabel).attr("style", nodeLabelTextStyle);
    } else {
      const edgeLabelRectStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
      select(svgLabel).select("rect").attr("style", edgeLabelRectStyle.replace(/background:/g, "fill:"));
      const edgeLabelTextStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      select(svgLabel).select("text").attr("style", edgeLabelTextStyle);
    }
    if (isTitle) {
      select(svgLabel).selectAll("tspan.text-outer-tspan").classed("title-row", true);
    } else {
      select(svgLabel).selectAll("tspan.text-outer-tspan").classed("row", true);
    }
    return svgLabel;
  }
}, "createText");

export {
  fastdom_default,
  computeDimensionOfText,
  createText
};
