import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceHistoryChartProps {
  propertyId: string;
}

interface PriceData {
  timestamp: string;
  price: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="text-sm text-gray-600">
          {new Date(label).toLocaleDateString()}
        </p>
        <p className="text-sm font-bold text-nordic-blue">
          {payload[0].value.toLocaleString()} NOK
        </p>
      </div>
    );
  }
  return null;
};

const ChartSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-[20px] w-[200px]" />
    <Skeleton className="h-[300px] w-full" />
  </div>
);

export const PriceHistoryChart = ({ propertyId }: PriceHistoryChartProps) => {
  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ['priceHistory', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('token_price_history')
        .select('price, timestamp')
        .eq('property_id', propertyId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data as PriceData[];
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <ChartSkeleton />
      </Card>
    );
  }

  if (!priceHistory?.length) {
    return (
      <Card className="p-6">
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Prisdata ikke tilgjengelig enda</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Token Price History</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={priceHistory}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0066FF"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};