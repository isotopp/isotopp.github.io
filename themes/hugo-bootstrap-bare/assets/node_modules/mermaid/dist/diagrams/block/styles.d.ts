/** Returns the styles given options */
export interface BlockChartStyleOptions {
    arrowheadColor: string;
    border2: string;
    clusterBkg: string;
    clusterBorder: string;
    edgeLabelBackground: string;
    fontFamily: string;
    lineColor: string;
    mainBkg: string;
    nodeBorder: string;
    nodeTextColor: string;
    strokeWidth?: number;
    tertiaryColor: string;
    textColor: string;
    titleColor: string;
    theme?: string;
    look?: string;
    borderColorArray?: string[];
    bkgColorArray?: string[];
    THEME_COLOR_LIMIT?: number;
}
declare const getStyles: (options: BlockChartStyleOptions) => string;
export default getStyles;
