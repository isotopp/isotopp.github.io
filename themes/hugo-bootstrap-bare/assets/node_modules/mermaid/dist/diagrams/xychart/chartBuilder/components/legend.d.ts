import type { SVGGroup } from '../../../../diagram-api/types.js';
import type { ChartComponent, Dimension, DrawableElem, Point, XYChartConfig, XYChartData, XYChartThemeConfig } from '../interfaces.js';
import type { TextDimensionCalculator } from '../textDimensionCalculator.js';
export declare class ChartLegend implements ChartComponent {
    private textDimensionCalculator;
    private chartConfig;
    private chartData;
    private chartThemeConfig;
    private boundingRect;
    private visiblePlots;
    constructor(textDimensionCalculator: TextDimensionCalculator, chartConfig: XYChartConfig, chartData: XYChartData, chartThemeConfig: XYChartThemeConfig);
    setBoundingBoxXY(point: Point): void;
    calculateSpace(availableSpace: Dimension): Dimension;
    getDrawableElements(): DrawableElem[];
}
export declare function getChartLegendComponent(chartConfig: XYChartConfig, chartData: XYChartData, chartThemeConfig: XYChartThemeConfig, tmpSVGGroup: SVGGroup): ChartComponent;
