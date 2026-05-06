'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

function formatMillions(value: number) {
  if (value === 0) return '0'
  return `${(value / 1_000_000).toFixed(0)}tr`
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="mb-5 font-semibold text-zinc-900">Doanh thu 7 ngày</h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v) => [`${Number(v).toLocaleString('vi-VN')}đ`, 'Doanh thu']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #f4f4f5', fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={{ fill: '#2563eb', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
