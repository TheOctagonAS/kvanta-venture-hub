import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    year: number;
    standard: number;
    compound: number;
  }>;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-2 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2">Simulert vekst over tid</h3>
      <div className="h-[200px] w-full mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 15, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10, fill: '#666' }}
              tickFormatter={(value) => `${value} år`}
              padding={{ left: 30, right: 30 }}
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
              tick={{ fontSize: 10, fill: '#666' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('nb-NO', {
                  style: 'currency',
                  currency: 'NOK',
                  maximumFractionDigits: 0
                }).format(value)
              }
              labelFormatter={(value) => `${value} år`}
              contentStyle={{ fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="standard" 
              stroke="#345FF6" 
              name="Uten reinvest"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="compound" 
              stroke="#47C757" 
              name="Med reinvest"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;