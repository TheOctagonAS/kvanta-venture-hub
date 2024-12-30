import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GrowthChartProps {
  data: Array<{
    year: number;
    standard: number;
    compound: number;
  }>;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="mt-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-nordic-charcoal mb-4">
          Din mulige vekst — med reinvestering vs. uten
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year"
                padding={{ left: 30, right: 30 }}
                tick={{ fill: '#666' }}
              />
              <YAxis
                tick={{ fill: '#666' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={formatCurrency}
                labelFormatter={(year) => `År ${year}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px'
                }}
              />
              <Legend 
                align="left"
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Line
                name="Standard Avkastning"
                type="monotone"
                dataKey="standard"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                name="Med Reinvestering"
                type="monotone"
                dataKey="compound"
                stroke="#47C757"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;