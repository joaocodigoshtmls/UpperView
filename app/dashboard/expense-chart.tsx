'use client';

import { formatBRL } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => formatBRL(value)}
          />
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
          />
          <Bar 
            dataKey="value" 
            fill="#2563eb" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
