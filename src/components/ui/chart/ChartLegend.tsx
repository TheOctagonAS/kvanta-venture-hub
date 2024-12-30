import { useChart } from './ChartContainer';

export const ChartLegend = () => {
  const { data, config } = useChart();
  
  return (
    <div className="flex gap-4 justify-center mt-4">
      {data.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">
            {entry[config.xAxisKey]}
          </span>
        </div>
      ))}
    </div>
  );
};