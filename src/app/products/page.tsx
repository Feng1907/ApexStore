export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { db } from '@/lib/db'
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card'
import { ProductFilters } from '@/components/product/product-filters'
import type { FilterParams } from '@/types'
import { Category } from '@prisma/client'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

async function ProductGrid({ filters }: { filters: FilterParams }) {
  const where: Record<string, unknown> = {}

  if (filters.category) where.category = filters.category as Category
  if (filters.search) where.name = { contains: filters.search, mode: 'insensitive' }

  const orderBy: Record<string, string> =
    filters.sort === 'newest'
      ? { createdAt: 'desc' }
      : filters.sort === 'popular'
        ? { createdAt: 'asc' }
        : { createdAt: 'desc' }

  const products = await db.product.findMany({
    where,
    include: {
      variants: true,
      reviews: { select: { rating: true, comment: true, userName: true, id: true, createdAt: true } },
    },
    orderBy,
    take: 24,
  })

  let filtered = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
  }))

  if (filters.minPrice || filters.maxPrice) {
    filtered = filtered.filter((p) => {
      const min = Math.min(...p.variants.map((v) => v.price))
      if (filters.minPrice && min < filters.minPrice) return false
      if (filters.maxPrice && min > filters.maxPrice) return false
      return true
    })
  }

  if (filters.storage) {
    filtered = filtered.filter((p) =>
      p.variants.some((v) => v.storage === filters.storage)
    )
  }

  if (filters.sort === 'price_asc') {
    filtered.sort((a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)))
  } else if (filters.sort === 'price_desc') {
    filtered.sort((a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)))
  }

  if (filtered.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-zinc-400">Không tìm thấy sản phẩm phù hợp.</p>
      </div>
    )
  }

  return (
    <>
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </>
  )
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: FilterParams = {
    category: params.category,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    storage: params.storage,
    sort: (params.sort as FilterParams['sort']) ?? 'newest',
  }

  const categoryLabel: Record<string, string> = {
    IPHONE: 'iPhone',
    IPAD: 'iPad',
    MACBOOK: 'MacBook',
    AIRPODS: 'AirPods',
    APPLE_WATCH: 'Apple Watch',
  }

  const title = filters.category ? categoryLabel[filters.category] ?? 'Sản phẩm' : 'Tất cả sản phẩm'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">{title}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-56">
          <ProductFilters currentFilters={filters} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            <Suspense
              fallback={Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            >
              <ProductGrid filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
