'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { useFlashSale, useCountdown } from '@/hooks/use-flash-sale'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold tabular-nums text-white">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-0.5 text-[10px] text-zinc-500">{label}</span>
    </div>
  )
}

function FlashSaleCard({ sale }: { sale: ReturnType<typeof useFlashSale>['sales'][0] }) {
  const time = useCountdown(sale.endAt)
  const discountPct = Math.round(sale.discount * 100)
  const stockPct = Math.min(100, Math.max(0, (sale.stock / 10) * 100))

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
      {/* Image */}
      <Link href={`/products/${sale.variant.product.slug}`} className="relative block aspect-square bg-zinc-50">
        <Image
          src={sale.variant.product.images[0] ?? '/placeholder-product.png'}
          alt={sale.variant.product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
          -{discountPct}%
        </span>
      </Link>

      <div className="flex flex-col gap-2 p-3">
        <Link href={`/products/${sale.variant.product.slug}`}>
          <p className="line-clamp-1 text-sm font-semibold text-zinc-900 hover:text-blue-600">
            {sale.variant.product.name}
          </p>
        </Link>
        <p className="text-xs text-zinc-500">{sale.variant.storage} · {sale.variant.color}</p>

        {/* Prices */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-red-600">{formatPrice(sale.variant.salePrice)}</span>
          <span className="text-xs text-zinc-400 line-through">{formatPrice(sale.variant.originalPrice)}</span>
        </div>

        {/* Stock bar */}
        <div>
          <div className="mb-1 flex justify-between text-[10px] text-zinc-500">
            <span>Đã bán</span>
            <span>Còn {sale.stock}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: `${100 - stockPct}%` }}
            />
          </div>
        </div>

        {/* Countdown */}
        {!time.done && (
          <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
            <span className="text-[11px] font-medium text-zinc-600">Kết thúc sau</span>
            <div className="flex items-center gap-1">
              <CountdownBlock value={time.h} label="Giờ" />
              <span className="mb-3 text-xs font-bold text-zinc-400">:</span>
              <CountdownBlock value={time.m} label="Phút" />
              <span className="mb-3 text-xs font-bold text-zinc-400">:</span>
              <CountdownBlock value={time.s} label="Giây" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FlashSaleBanner() {
  const { sales, loading } = useFlashSale()

  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white">
            <Zap className="h-4 w-4 fill-white" />
            <span className="font-bold tracking-wide">FLASH SALE</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Cập nhật realtime
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-zinc-100">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sales.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
            <Zap className="mx-auto mb-2 h-8 w-8 text-zinc-200" />
            <p className="text-sm text-zinc-400">Hiện không có Flash Sale. Quay lại sau!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sales.map((sale) => (
              <FlashSaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
