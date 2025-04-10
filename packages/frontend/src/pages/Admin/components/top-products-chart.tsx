import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';

const COLORS = ['#D9B396', '#E6C8B4', '#F2DFD3', '#F9EFE8', '#FFFFFF'];

const initialData = [
  { name: 'White Dress', value: 45 },
  { name: 'Long Dress', value: 22 },
  { name: 'Metal Core', value: 17 },
  { name: 'Liquid etc', value: 11 },
  { name: 'Electronic', value: 5 },
];

export function TopProductsChart() {
  const [data] = useState(initialData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Top 5 Product, %</h3>
        <button className="text-[#FF6B6B] text-sm flex items-center">
          Show all <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex">
        <div className="w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan x="50%" dy="-10" fontSize="24" fontWeight="bold">
                  45
                </tspan>
                <tspan x="50%" dy="25" fontSize="16">
                  %
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2">
          <ul className="space-y-2">
            {data.map((item, index) => (
              <li key={index} className="flex items-center text-sm">
                <span className="mr-2">{index + 1}.</span>
                <span className="flex-1">{item.name}</span>
                <span className="text-gray-500">- {item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
