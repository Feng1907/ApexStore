export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { RevenueChart } from '@/components/admin/revenue-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Tổng quan' }

async function getStats() {
  const [totalProducts, totalOrders, orders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.findMany({
      select: { totalAmount: true, createdAt: true, status: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((s, o) => s + Number(o.totalAmount), 0)

  // Doanh thu 7 ngày gần nhất
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const revenueByDay = last7Days.map((date) => {
    const dayStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    const revenue = orders
      .filter((o) => {
        const d = new Date(o.createdAt)
        return d.toDateString() === date.toDateString() &&
          o.status !== 'CANCELLED' && o.status !== 'REFUNDED'
      })
      .reduce((s, o) => s + Number(o.totalAmount), 0)
    return { date: dayStr, revenue }
  })

  return { totalProducts, totalOrders, totalRevenue, revenueByDay }
}

export default async function AdminPage() {
  const { totalProducts, totalOrders, totalRevenue, revenueByDay } = await getStats()

  const stats = [
    { label: 'Tổng sản phẩm', value: totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Tổng đơn hàng', value: totalOrders, icon: ShoppingCart, color: 'bg-purple-50 text-purple-600' },
    { label: 'Doanh thu', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Khách hàng', value: '—', icon: Users, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-zinc-500">Thống kê hoạt động của ApexStore</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-zinc-900">{value}</p>
            <p className="mt-0.5 text-sm text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByDay} />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}
