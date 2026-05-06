'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { FilterParams } from '@/types'

interface ProductFiltersProps {
  currentFilters: FilterParams
}

const categories = [
  { value: '', label: 'Tất cả' },
  { value: 'IPHONE', label: 'iPhone' },
  { value: 'IPAD', label: 'iPad' },
  { value: 'MACBOOK', label: 'MacBook' },
  { value: 'AIRPODS', label: 'AirPods' },
  { value: 'APPLE_WATCH', label: 'Apple Watch' },
]

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'popular', label: 'Phổ biến' },
]

const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

export function ProductFilters({ currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Sắp xếp</p>
        <div className="flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('sort', opt.value)}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                currentFilters.sort === opt.value || (!currentFilters.sort && opt.value === 'newest')
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'text-zinc-600 hover:bg-zinc-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Danh mục</p>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', cat.value)}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                (currentFilters.category ?? '') === cat.value
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-600 hover:bg-zinc-50'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Bộ nhớ</p>
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((s) => (
            <button
              key={s}
              onClick={() => updateFilter('storage', currentFilters.storage === s ? '' : s)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                currentFilters.storage === s
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
