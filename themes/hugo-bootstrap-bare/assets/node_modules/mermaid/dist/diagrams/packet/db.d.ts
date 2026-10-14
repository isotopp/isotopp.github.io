import type { DiagramDB } from '../../diagram-api/types.js';
import type { PacketWord } from './types.js';
export declare class PacketDB implements DiagramDB {
    private packet;
    getConfig(): {
        rowHeight: number;
        bitWidth: number;
        bitsPerRow: number;
        showBits: boolean;
        bitOrder: "ascending" | "descending";
        paddingX: number;
        paddingY: number;
        useWidth: number;
        useMaxWidth: boolean;
        theme: "default" | "base" | "dark" | "forest" | "neutral" | "neo" | "neo-dark" | "redux" | "redux-dark" | "redux-color" | "redux-dark-color" | "null";
        look: "classic" | "handDrawn" | "neo";
        layout: string;
    };
    getPacket(): PacketWord[];
    pushWord(word: PacketWord): void;
    clear(): void;
    setAccTitle: (txt: string) => void;
    getAccTitle: () => string;
    setDiagramTitle: (txt: string) => void;
    getDiagramTitle: () => string;
    getAccDescription: () => string;
    setAccDescription: (txt: string) => void;
}
