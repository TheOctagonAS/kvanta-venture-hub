import React, { createContext, useContext, ReactNode } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface ChartContextType {
  data: any[];
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within a ChartProvider');
  }
  return context;
};

interface ChartContainerProps {
  children: ReactNode;
  data: any[];
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

export const ChartContainer = ({ children, data, timeframe, setTimeframe }: ChartContainerProps) => {
  return (
    <ChartContext.Provider value={{ data, timeframe, setTimeframe }}>
      <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timestamp" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} NOK`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0088FE"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
        {children}
      </div>
    </ChartContext.Provider>
  );
};