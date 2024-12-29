import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    day: number;
    standard: number;
    compound: number;
  }>;
}

const GrowthChart = ({ data }: GrowthChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Simulert vekst over tid</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="day" 
              label={{ value: 'Dager', position: 'bottom' }}
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
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                }).format(value)
              }
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="standard" 
              stroke="#345FF6" 
              name="Uten reinvestering"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="compound" 
              stroke="#47C757" 
              name="Med reinvestering"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;