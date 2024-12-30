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
import { useState } from "react";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { PriceTooltip } from "./PriceTooltip";

interface PriceHistoryChartProps {
  propertyId: string;
}

interface PriceData {
  timestamp: string;
  price: number;
}

const ChartSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-[20px] w-[200px]" />
    <Skeleton className="h-[300px] w-full" />
  </div>
);

const getTimeRangeFilter = (range: string) => {
  const now = new Date();
  switch (range) {
    case "1D":
      return new Date(now.setDate(now.getDate() - 1));
    case "7D":
      return new Date(now.setDate(now.getDate() - 7));
    case "30D":
      return new Date(now.setDate(now.getDate() - 30));
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
};

export const PriceHistoryChart = ({ propertyId }: PriceHistoryChartProps) => {
  const [timeRange, setTimeRange] = useState("30D");

  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ['priceHistory', propertyId, timeRange],
    queryFn: async () => {
      const startDate = getTimeRangeFilter(timeRange);
      
      const { data, error } = await supabase
        .from('token_price_history')
        .select('price, timestamp')
        .eq('property_id', propertyId)
        .gte('timestamp', startDate.toISOString())
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Token Price History</h3>
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
        />
      </div>
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
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return timeRange === "1D" 
                  ? date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
              }}
            />
            <YAxis />
            <Tooltip content={<PriceTooltip />} />
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