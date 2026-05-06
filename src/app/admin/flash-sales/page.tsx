export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Flash Sale' }

export default async function AdminFlashSalesPage() {
  const now = new Date()
  const sales = await db.flashSale.findMany({
    orderBy: { startAt: 'desc' },
    include: {
      variant: { include: { product: { select: { name: true, images: true } } } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Flash Sale</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{sales.length} chiến dịch</p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
          <Zap className="mx-auto mb-3 h-8 w-8 text-zinc-200" />
          <p className="text-sm text-zinc-400">Chưa có flash sale. Chạy seed để tạo dữ liệu mẫu.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-zinc-100 bg-zinc-50">
              <tr>
                {['Sản phẩm', 'Giảm giá', 'Giá sale', 'Tồn kho', 'Thời gian', 'Trạng thái'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {sales.map((s) => {
                const isActive = s.active && s.startAt <= now && s.endAt >= now
                const isUpcoming = s.startAt > now
                const salePrice = Math.round(Number(s.variant.price) * (1 - s.discount))
                return (
                  <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-zinc-900">{s.variant.product.name}</p>
                      <p className="text-xs text-zinc-400">{s.variant.storage} · {s.variant.color}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                        -{Math.round(s.discount * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-red-600">{formatPrice(salePrice)}</p>
                      <p className="text-xs text-zinc-400 line-through">{formatPrice(Number(s.variant.price))}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{s.stock}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      <p>{new Date(s.startAt).toLocaleString('vi-VN')}</p>
                      <p>→ {new Date(s.endAt).toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={isActive ? 'success' : isUpcoming ? 'warning' : 'secondary'}>
                        {isActive ? 'Đang diễn ra' : isUpcoming ? 'Sắp tới' : 'Đã kết thúc'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
