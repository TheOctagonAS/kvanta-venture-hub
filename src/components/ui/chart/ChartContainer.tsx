import React, { createContext, useContext, useMemo } from 'react';
import { ResponsiveContainer } from 'recharts';
import type { ChartData } from './types';

interface ChartContextType {
  data: ChartData[];
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
};

export const ChartContainer = ({ 
  children, 
  data 
}: { 
  children: React.ReactNode;
  data: ChartData[];
}) => {
  const value = useMemo(() => ({ data }), [data]);

  return (
    <ChartContext.Provider value={value}>
      <ResponsiveContainer width="100%" height={400}>
        {children}
      </ResponsiveContainer>
    </ChartContext.Provider>
  );
};