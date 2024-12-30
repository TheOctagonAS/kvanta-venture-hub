import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    day: number;
    standard: number;
    compound: number;
  }>;
}

const GrowthChart = ({ data }: GrowthChartProps) => {
  const filteredData = data.filter(item => item.day % 5 === 0);

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-2 rounded-lg shadow-sm dark:border dark:border-[#333]">
      <h3 className="text-sm font-medium mb-2 dark:text-[#eee]">Simulert vekst over tid</h3>
      <div className="h-[160px] w-full mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={filteredData} 
            margin={{ top: 5, right: 5, bottom: 15, left: 5 }}
            className="dark:bg-[#121212] rounded-lg"
          >
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 10, fill: '#bbb' }}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
              stroke="#bbb"
            />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)
              }
              tick={{ fontSize: 10, fill: '#bbb' }}
              stroke="#bbb"
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                }).format(value)
              }
              contentStyle={{ fontSize: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', color: '#ccc' }}
              itemStyle={{ color: '#ccc' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Legend 
              align="right"
              verticalAlign="bottom"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', marginTop: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="standard" 
              stroke="#5a7dfc" 
              name="Uten reinvest"
              strokeWidth={1.5}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="compound" 
              stroke="#47C757" 
              name="Med reinvest"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;