import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';

const initialData = [
  { name: '1. 3/2024', value: 229, label: '229 triệu' },
  { name: '2. 8/2025', value: 127, label: '127 triệu' },
  { name: '3. 1/2023', value: 82, label: '82 triệu' },
  { name: '4. 10/2023', value: 53, label: '53 triệu' },
  { name: '1. 3/2026', value: 14, label: '14 triệu' },
];

export function ProfitsChart() {
  const [data] = useState(initialData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Profits</h3>
        <button className="text-[#FF6B6B] text-sm flex items-center">
          Show all <ChevronRight size={16} />
        </button>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 80,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis type="number" hide />
            {data.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="value"
                fill={index === 0 ? '#D9B396' : '#E6C8B4'}
                radius={[0, 4, 4, 0]}
                background={{ fill: '#F5F5F5', radius: [0, 4, 4, 0] }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm mb-2"
          >
            <span className="text-gray-600">{item.name}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
