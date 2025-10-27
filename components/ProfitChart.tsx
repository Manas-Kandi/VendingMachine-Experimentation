import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfitChartProps {
  data: { day: number; profit: number }[];
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            dataKey="day" 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            axisLine={{ stroke: '#4b5563' }}
            tickLine={{ stroke: '#4b5563' }}
            />
        <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            axisLine={{ stroke: '#4b5563' }}
            tickLine={{ stroke: '#4b5563' }}
            tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900 with opacity
            backdropFilter: 'blur(4px)',
            border: '1px solid #374151',
            borderRadius: '0.75rem',
          }}
          labelStyle={{ color: '#f3f4f6', fontWeight: 'bold' }}
          itemStyle={{ color: '#d1d5db' }}
          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, 'Profit']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area type="monotone" dataKey="profit" stroke="#22c55e" fillOpacity={1} fill="url(#colorProfit)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};