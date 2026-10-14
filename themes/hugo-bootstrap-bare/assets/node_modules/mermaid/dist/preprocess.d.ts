/**
 * Preprocess the given code by cleaning it up, extracting front matter and directives,
 * cleaning and merging configuration, and removing comments.
 *
 * Returns a {@link DiagramCode} object exposing `raw`, `cleaned`, `withComments`,
 * and `frontmatterLineOffset`. Diagrams that do not opt into inline-position
 * capture continue to use `cleaned` and see no behavioural change.
 *
 * @param code - The code to preprocess.
 * @returns The object containing the preprocessed code, title, and configuration.
 */
export declare function preprocessDiagram(code: string): {
    code: {
        raw: string;
        cleaned: string;
        withComments: string;
        frontmatterLineOffset: number;
    };
    title: string | undefined;
    config: import("./config.type.js").MermaidConfig;
};
