import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

interface RentEarningsChartProps {
  rentEarnings: {
    earned_amount: number;
    withdrawn_amount: number;
    month: string;
  }[];
}

export const RentEarningsChart = ({ rentEarnings }: RentEarningsChartProps) => {
  if (!rentEarnings || rentEarnings.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        Ingen data registrert ennå.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rentEarnings}>
            <XAxis
              dataKey="month"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kr`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Opptjent
                        </span>
                        <span className="font-bold text-[#345FF6]">
                          {payload[0].value?.toLocaleString()} kr
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Uttatt
                        </span>
                        <span className="font-bold text-[#47C757]">
                          {payload[1].value?.toLocaleString()} kr
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="earned_amount"
              stroke="#345FF6"
              strokeWidth={2}
              dot={false}
              name="Opptjent leie"
            />
            <Line
              type="monotone"
              dataKey="withdrawn_amount"
              stroke="#47C757"
              strokeWidth={2}
              dot={false}
              name="Uttatt leie"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};