import { ReactElement } from 'react';

export interface ChartConfig {
  xAxisKey: string;
  yAxisKey: string;
  tooltipFormat?: (value: number) => string;
}

export interface ChartContextType {
  data: any[];
  config: ChartConfig;
}

export interface ChartProps {
  data: any[];
  config: ChartConfig;
  children: ReactElement | ReactElement[];
}