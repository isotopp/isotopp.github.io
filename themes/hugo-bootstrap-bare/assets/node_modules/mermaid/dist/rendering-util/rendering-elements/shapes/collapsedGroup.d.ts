import type { D3Selection } from '../../../types.js';
import type { Node } from '../../types.js';
/**
 * Collapsed subgraph shape (flowchart `@{ view: collapsed }`).
 *
 * Renders a two-row layout that keeps the subgraph's visual identity while
 * signalling that it hides further content:
 *
 *   ┌─────────────────┐
 *   │   Title Text    │
 *   │─ ─ ─ ─ ─ ─ ─ ─ ─│  (separator line)
 *   │      • • •      │  (ellipsis indicator)
 *   └─────────────────┘
 */
export declare function collapsedGroup<T extends SVGGraphicsElement>(parent: D3Selection<T>, node: Node): Promise<import("d3-selection").Selection<SVGGElement, unknown, Element | null, unknown>>;
