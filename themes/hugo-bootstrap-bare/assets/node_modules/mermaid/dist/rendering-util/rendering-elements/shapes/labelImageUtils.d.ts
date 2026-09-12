/**
 * Waits for all images in a container to load and applies appropriate styling.
 * This ensures accurate bounding box measurements after images are loaded.
 *
 * @param container - The HTML element containing img tags
 * @returns Promise that resolves when all images are loaded and styled
 */
export declare function configureLabelImages(container: HTMLElement): Promise<void>;
export declare function hasTextBesidesImages(node: Node): boolean;
