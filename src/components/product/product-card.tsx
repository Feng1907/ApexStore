'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import type { ProductWithVariants } from '@/types'

interface ProductCardProps {
  product: ProductWithVariants
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price))
  const maxPrice = Math.max(...product.variants.map((v) => v.price))
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0
  const inStock = product.variants.some((v) => v.stock > 0)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-zinc-50">
        <Image
          src={product.images[0] ?? '/placeholder-product.png'}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.featured && (
          <Badge className="absolute left-3 top-3" variant="default">
            Nổi bật
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge variant="secondary">Hết hàng</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.reviews.length > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-zinc-700">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-zinc-400">({product.reviews.length})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <p className="text-base font-bold text-zinc-900">
            {minPrice === maxPrice ? (
              formatPrice(minPrice)
            ) : (
              <>
                {formatPrice(minPrice)}
                <span className="text-xs font-normal text-zinc-400"> – {formatPrice(maxPrice)}</span>
              </>
            )}
          </p>
        </div>

        <Button
          size="sm"
          className="mt-2 w-full gap-1.5"
          disabled={!inStock}
          asChild={inStock}
        >
          {inStock ? (
            <Link href={`/products/${product.slug}`}>
              <ShoppingBag className="h-4 w-4" />
              Xem & Mua
            </Link>
          ) : (
            <span>Hết hàng</span>
          )}
        </Button>
      </div>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}
