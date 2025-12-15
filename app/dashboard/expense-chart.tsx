'use client';

import { formatBRL } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const safeData = Array.isArray(data) ? data.filter((item) => Number.isFinite(item.value)) : [];

  if (safeData.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Nenhuma despesa elegivel para o grafico.
      </div>
    );
  }

  return (
    <div className="h-80" role="img" aria-label="Grafico de barras de despesas por categoria">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ left: 4, right: 12, bottom: 8 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
            interval={0}
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
            cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }}
          />
          <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
