import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';

const initialData = [
  { name: 'Mo', value: 502 },
  { name: 'Tu', value: 487 },
  { name: 'We', value: 864 },
  { name: 'Th', value: 205 },
  { name: 'Fr', value: 512 },
  { name: 'Sa', value: 87 },
  { name: 'Su', value: 136 },
];

export function OrdersChart() {
  const [data] = useState(initialData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Number of Orders</h3>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
            barSize={30}
          >
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <Bar dataKey="value" fill="#D9B396" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium">{item.value}</div>
            <div className="text-xs text-gray-500">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
