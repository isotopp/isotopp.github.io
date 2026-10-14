import type { TreeData } from './find-common-ancestor.js';
/** An edge as far as cycle detection is concerned: the ids of its two ends. */
export interface EdgeEnds {
    source: string;
    target: string;
}
/**
 * Find the edges that close a cycle only because a subgraph is laid out as one node.
 *
 * With `INCLUDE_CHILDREN`, ELK lays out each subgraph as a single node of its parent graph. A node
 * outside a subgraph that both receives an edge from it and sends one into it therefore forms a
 * cycle there, even when the nodes inside do not (`A -> B` inside `G`, then `B -> X -> C` with `C`
 * inside `G`). ELK breaks that cycle by reversing one of the edges and routes it into the
 * subgraph's input side, around the outside of the subgraph.
 *
 * Each edge is looked at on the graph of its lowest common subgraph, with every subgraph below
 * that collapsed. A depth-first search from the sources, in declaration order, marks an edge that
 * points at a node still on the stack as a feedback edge. Only feedback edges with at least one
 * end inside a collapsed subgraph are returned, and ELK lays each of them out downstream of its
 * original target. A feedback edge between plain nodes is left to ELK's own cycle breaking, even
 * when its cycle runs through a subgraph: ELK can then reverse that plain edge, and the edges into
 * the subgraph keep pointing downstream.
 *
 * @param edges - the edges in declaration order
 * @param tree - the subgraph parent lookup
 * @returns one flag per edge, true where the edge should be laid out reversed
 */
export declare function findSubgraphFeedbackEdges(edges: readonly EdgeEnds[], tree: TreeData): boolean[];
