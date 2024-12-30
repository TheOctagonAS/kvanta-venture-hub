import { useChart } from './ChartContainer';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const ChartTooltip = ({ active, payload, label }: TooltipProps) => {
  const { config } = useChart();
  
  if (!active || !payload?.length) {
    return null;
  }

  const formatValue = config.tooltipFormat || ((value: number) => value.toString());

  return (
    <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatValue(entry.value)}
        </p>
      ))}
    </div>
  );
};