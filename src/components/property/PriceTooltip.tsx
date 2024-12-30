import { Card } from "@/components/ui/card";

interface PriceTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const PriceTooltip = ({ active, payload, label }: PriceTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <Card className="bg-white p-3 border shadow-sm">
      <p className="text-sm text-gray-600">
        {new Date(label).toLocaleDateString('nb-NO', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      <p className="text-sm font-bold text-nordic-blue">
        {payload[0].value.toLocaleString()} NOK
      </p>
    </Card>
  );
};