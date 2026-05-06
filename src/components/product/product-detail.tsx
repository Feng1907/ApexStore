'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart.store'
import { formatPrice } from '@/lib/utils'
import type { ProductWithVariants } from '@/types'

interface ProductDetailProps {
  product: ProductWithVariants & { reviews: { id: string; rating: number; comment: string; userName: string; createdAt: Date; userId: string; productId: string }[] }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '')
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  const variant = product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0]
  const storages = [...new Set(product.variants.map((v) => v.storage))]
  const colors = product.variants.filter((v) => v.storage === variant?.storage)

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0

  function handleAddToCart() {
    if (!variant) return
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: `${product.name} ${variant.storage} ${variant.color}`,
      slug: product.slug,
      image: product.images[0] ?? '',
      color: variant.color,
      colorHex: variant.colorHex,
      storage: variant.storage,
      price: variant.price,
      quantity: 1,
      stock: variant.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-50">
          <Image
            src={product.images[activeImage] ?? '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === i ? 'border-blue-600' : 'border-zinc-200'
                }`}
              >
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5">
        <div>
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{product.name}</h1>
          {product.reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-500">({product.reviews.length} đánh giá)</span>
            </div>
          )}
        </div>

        {/* Price */}
        <p className="text-3xl font-bold text-zinc-900">
          {variant ? formatPrice(variant.price) : '—'}
        </p>

        {/* Storage selector */}
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">Bộ nhớ</p>
          <div className="flex flex-wrap gap-2">
            {storages.map((s) => {
              const v = product.variants.find((v) => v.storage === s && v.color === variant?.color)
                ?? product.variants.find((v) => v.storage === s)
              return (
                <button
                  key={s}
                  onClick={() => v && setSelectedVariantId(v.id)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    variant?.storage === s
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">
            Màu sắc — <span className="font-normal text-zinc-500">{variant?.color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                title={v.color}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedVariantId === v.id ? 'border-zinc-900 scale-110' : 'border-zinc-300'
                }`}
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
          </div>
        </div>

        {/* Stock */}
        {variant && (
          <p className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {variant.stock > 5 ? '✓ Còn hàng' : variant.stock > 0 ? `✓ Còn ${variant.stock} chiếc` : '✗ Hết hàng'}
          </p>
        )}

        {/* Add to cart */}
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleAddToCart}
            disabled={!variant || variant.stock === 0}
          >
            {added ? (
              <>
                <Check className="h-5 w-5" /> Đã thêm vào giỏ
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" /> Thêm vào giỏ hàng
              </>
            )}
          </Button>
        </motion.div>

        {/* Description */}
        <div className="border-t border-zinc-100 pt-4">
          <p className="text-sm leading-relaxed text-zinc-600">{product.description}</p>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="border-t border-zinc-100 pt-4">
            <h3 className="mb-3 font-semibold text-zinc-900">Đánh giá từ khách hàng</h3>
            <div className="space-y-3">
              {product.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-xl bg-zinc-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{review.userName}</span>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
