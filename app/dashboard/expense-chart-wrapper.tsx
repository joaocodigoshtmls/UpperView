'use client';

import dynamic from 'next/dynamic';

const ExpenseChart = dynamic(() => import('./expense-chart'), { ssr: false });

interface ExpenseChartWrapperProps {
  data: Array<{ name: string; value: number }>;
}

export default function ExpenseChartWrapper({ data }: ExpenseChartWrapperProps) {
  return <ExpenseChart data={data} />;
}
