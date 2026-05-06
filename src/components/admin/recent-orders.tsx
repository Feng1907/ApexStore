'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
  PENDING:    { label: 'Chờ xác nhận', variant: 'warning' },
  CONFIRMED:  { label: 'Đã xác nhận',  variant: 'secondary' },
  PROCESSING: { label: 'Đang xử lý',   variant: 'secondary' },
  SHIPPED:    { label: 'Đang giao',     variant: 'outline' },
  DELIVERED:  { label: 'Hoàn thành',   variant: 'success' },
  CANCELLED:  { label: 'Đã hủy',       variant: 'destructive' },
  REFUNDED:   { label: 'Hoàn tiền',    variant: 'destructive' },
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/admin/orders?limit=5')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-zinc-900">Đơn hàng gần đây</h2>
      {orders.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">Chưa có đơn hàng</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const s = STATUS_MAP[o.status] ?? { label: o.status, variant: 'outline' as const }
            return (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-zinc-700">#{o.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-zinc-400">
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-900">{formatPrice(o.totalAmount)}</p>
                  <Badge variant={s.variant} className="mt-0.5 text-[10px]">{s.label}</Badge>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
