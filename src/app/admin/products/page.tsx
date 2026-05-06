export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Sản phẩm' }

const CATEGORY_LABEL: Record<string, string> = {
  IPHONE: 'iPhone', IPAD: 'iPad', MACBOOK: 'MacBook',
  AIRPODS: 'AirPods', APPLE_WATCH: 'Apple Watch',
}

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Sản phẩm</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{products.length} sản phẩm</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-zinc-100 bg-zinc-50">
            <tr>
              {['Sản phẩm', 'Danh mục', 'Biến thể', 'Giá từ', 'Tồn kho', 'Trạng thái', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {products.map((p) => {
              const prices = p.variants.map((v) => Number(v.price))
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
              return (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                        <Image
                          src={p.images[0] ?? ''}
                          alt={p.name}
                          fill
                          className="object-contain p-1"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                        <p className="text-xs text-zinc-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{CATEGORY_LABEL[p.category] ?? p.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{p.variants.length}</td>
                  <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                    {formatPrice(Math.min(...prices))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {totalStock > 0 ? `${totalStock} chiếc` : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.featured ? 'default' : 'outline'}>
                      {p.featured ? 'Nổi bật' : 'Thường'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/products/${p.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
