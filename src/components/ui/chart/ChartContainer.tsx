import { createContext, useContext, ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartProps, ChartContextType } from './types';

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartContainer');
  }
  return context;
};

export const ChartContainer = ({ 
  data, 
  config, 
  children 
}: ChartProps) => {
  return (
    <ChartContext.Provider value={{ data, config }}>
      <ResponsiveContainer width="100%" height={400}>
        {children}
      </ResponsiveContainer>
    </ChartContext.Provider>
  );
};