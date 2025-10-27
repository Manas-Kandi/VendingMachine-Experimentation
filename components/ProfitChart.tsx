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
          top: 5,
          right: 20,
          left: -10,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
            dataKey="day" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
            />
        <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={{ stroke: '#cbd5e1' }}
            tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
          labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
          itemStyle={{ color: '#334155' }}
          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, 'Profit']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};