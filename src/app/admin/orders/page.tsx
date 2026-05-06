export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Đơn hàng' }

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
  PENDING:    { label: 'Chờ xác nhận', variant: 'warning' },
  CONFIRMED:  { label: 'Đã xác nhận',  variant: 'secondary' },
  PROCESSING: { label: 'Đang xử lý',   variant: 'secondary' },
  SHIPPED:    { label: 'Đang giao',     variant: 'outline' },
  DELIVERED:  { label: 'Hoàn thành',   variant: 'success' },
  CANCELLED:  { label: 'Đã hủy',       variant: 'destructive' },
  REFUNDED:   { label: 'Hoàn tiền',    variant: 'destructive' },
}

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { variant: { include: { product: { select: { name: true } } } } } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Đơn hàng</h1>
        <p className="mt-0.5 text-sm text-zinc-500">{orders.length} đơn hàng</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              {['Mã đơn', 'Sản phẩm', 'Tổng tiền', 'Ngày đặt', 'Trạng thái', 'Cập nhật'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const s = STATUS_MAP[o.status] ?? { label: o.status, variant: 'outline' as const }
                return (
                  <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-zinc-700">
                        #{o.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[200px] truncate text-sm text-zinc-600">
                        {o.items.map((i) => i.variant.product.name).join(', ')}
                      </p>
                      <p className="text-xs text-zinc-400">{o.items.length} sản phẩm</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900">
                      {formatPrice(Number(o.totalAmount))}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500">
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
