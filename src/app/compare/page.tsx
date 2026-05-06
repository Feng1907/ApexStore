export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'So sánh sản phẩm' }

interface PageProps {
  searchParams: Promise<{ ids?: string }>
}

const SPECS = [
  { key: 'category', label: 'Danh mục' },
  { key: 'minPrice', label: 'Giá từ' },
  { key: 'maxPrice', label: 'Giá cao nhất' },
  { key: 'storages', label: 'Bộ nhớ' },
  { key: 'colors', label: 'Màu sắc' },
  { key: 'stock', label: 'Tình trạng' },
  { key: 'rating', label: 'Đánh giá' },
]

export default async function ComparePage({ searchParams }: PageProps) {
  const { ids } = await searchParams
  if (!ids) notFound()

  const idList = ids.split(',').slice(0, 3).filter(Boolean)
  if (idList.length < 2) notFound()

  const products = await db.product.findMany({
    where: { id: { in: idList } },
    include: {
      variants: true,
      reviews: { select: { rating: true } },
    },
  })

  if (products.length < 2) notFound()

  const rows = products.map((p) => {
    const prices = p.variants.map((v) => Number(v.price))
    const avgRating = p.reviews.length
      ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
      : 'Chưa có'
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0] ?? '',
      category: p.category,
      minPrice: formatPrice(Math.min(...prices)),
      maxPrice: formatPrice(Math.max(...prices)),
      storages: [...new Set(p.variants.map((v) => v.storage))].join(' / '),
      colors: [...new Set(p.variants.map((v) => v.color))].join(', '),
      stock: p.variants.some((v) => v.stock > 0) ? '✓ Còn hàng' : '✗ Hết hàng',
      rating: avgRating,
    }
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products"><ArrowLeft className="h-4 w-4" /> Quay lại</Link>
        </Button>
        <h1 className="text-2xl font-bold text-zinc-900">So sánh sản phẩm</h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-100 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="w-36 bg-zinc-50 p-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Thông số
              </th>
              {rows.map((p) => (
                <th key={p.id} className="bg-white p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-xl bg-zinc-50">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-2" sizes="80px" />
                    </div>
                    <Link href={`/products/${p.slug}`} className="text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors">
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPECS.map(({ key, label }, i) => (
              <tr key={key} className={i % 2 === 0 ? 'bg-zinc-50/50' : 'bg-white'}>
                <td className="p-4 text-sm font-medium text-zinc-600">{label}</td>
                {rows.map((p) => {
                  const val = p[key as keyof typeof p]
                  const isGood = key === 'stock' && String(val).startsWith('✓')
                  const isBad = key === 'stock' && String(val).startsWith('✗')
                  return (
                    <td key={p.id} className="p-4 text-center text-sm">
                      <span className={isGood ? 'font-medium text-green-600' : isBad ? 'font-medium text-red-500' : 'text-zinc-700'}>
                        {String(val)}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* CTA row */}
            <tr className="border-t border-zinc-100 bg-white">
              <td className="p-4 text-sm font-medium text-zinc-500">Mua ngay</td>
              {rows.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  <Button size="sm" asChild>
                    <Link href={`/products/${p.slug}`}>Xem sản phẩm</Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
