import type { SVGGroup } from '../../../../diagram-api/types.js';
import type { ChartComponent, Dimension, DrawableElem, Point, XYChartConfig, XYChartData, XYChartThemeConfig } from '../interfaces.js';
import type { TextDimensionCalculator } from '../textDimensionCalculator.js';
export declare class ChartTitle implements ChartComponent {
    private textDimensionCalculator;
    private chartConfig;
    private chartData;
    private chartThemeConfig;
    private boundingRect;
    private showChartTitle;
    private titleWidth;
    constructor(textDimensionCalculator: TextDimensionCalculator, chartConfig: XYChartConfig, chartData: XYChartData, chartThemeConfig: XYChartThemeConfig);
    setBoundingBoxXY(point: Point): void;
    calculateSpace(availableSpace: Dimension): Dimension;
    /**
     * Centre the title over [start, end], shifted as needed to keep it inside the chart.
     * The title has its own row above the plot and legend, so it may use the full chart width.
     */
    alignTo(start: number, end: number): void;
    getDrawableElements(): DrawableElem[];
}
export declare function getChartTitleComponent(chartConfig: XYChartConfig, chartData: XYChartData, chartThemeConfig: XYChartThemeConfig, tmpSVGGroup: SVGGroup): ChartTitle;
