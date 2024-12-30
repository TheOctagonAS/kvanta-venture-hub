import React, { createContext, useContext, ReactNode } from "react";

interface ChartContextType {
  data: any[];
  config: {
    xAxisKey: string;
    tooltipFormat?: (value: number) => string;
  };
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return context;
};

interface ChartContainerProps {
  children: ReactNode;
  data: any[];
  config: {
    xAxisKey: string;
    tooltipFormat?: (value: number) => string;
  };
}

export const ChartContainer = ({ children, data, config }: ChartContainerProps) => {
  return (
    <ChartContext.Provider value={{ data, config }}>
      <div className="w-full h-full flex flex-col">
        {children}
      </div>
    </ChartContext.Provider>
  );
};