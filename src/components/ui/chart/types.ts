export interface ChartConfig {
  xAxisKey: string;
  tooltipFormat?: (value: number) => string;
}

export interface ChartData {
  [key: string]: any;
  color?: string;
}