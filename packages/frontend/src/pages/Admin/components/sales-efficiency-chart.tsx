import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const generateData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
};

export function SalesEfficiencyChart() {
  const [data] = useState(generateData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Sales Efficiency</h3>
      </div>

      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="natural"
              dataKey="value"
              stroke="#D9B396"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-right">
        <span className="text-xs text-gray-500">1.11</span>
      </div>
    </div>
  );
}
