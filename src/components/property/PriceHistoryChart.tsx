import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface PriceHistoryChartProps {
  propertyId: string
}

export const PriceHistoryChart = ({ propertyId }: PriceHistoryChartProps) => {
  const { data: priceHistory, isLoading } = useQuery({
    queryKey: ["priceHistory", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_price_history")
        .select("price, timestamp")
        .eq("property_id", propertyId)
        .order("timestamp", { ascending: true })

      if (error) throw error
      return data
    },
  })

  if (isLoading || !priceHistory) {
    return (
      <Card className="p-6">
        <div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />
      </Card>
    )
  }

  const chartData = priceHistory.map((record) => ({
    date: format(new Date(record.timestamp), "MMM d"),
    price: record.price,
  }))

  const config = {
    price: {
      label: "Price",
      color: "#345FF6",
    },
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Price History</h3>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#345FF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#345FF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
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
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#345FF6"
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}