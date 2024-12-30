import React, { ReactNode } from "react";

interface ChartContainerProps {
  children: ReactNode;
}

export const ChartContainer = ({ children }: ChartContainerProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      {children}
    </div>
  );
};