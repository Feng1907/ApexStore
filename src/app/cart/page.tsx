'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-zinc-200" />
        <h1 className="text-xl font-bold text-zinc-900">Giỏ hàng trống</h1>
        <p className="text-zinc-500">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Button asChild>
          <Link href="/products">Khám phá sản phẩm</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Giỏ hàng ({items.length} sản phẩm)</h1>
        <button onClick={clearCart} className="text-sm text-zinc-400 hover:text-red-500 transition-colors">
          Xóa tất cả
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                <Image
                  src={item.image || '/placeholder-product.png'}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold text-zinc-900 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-zinc-500">
                  <span
                    className="mr-1 inline-block h-3 w-3 rounded-full border border-zinc-200"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  {item.color} · {item.storage}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-xl border border-zinc-200">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-zinc-900">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-zinc-900">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Tạm tính</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="my-3 border-t border-zinc-100" />
            <div className="flex justify-between text-base font-bold text-zinc-900">
              <span>Tổng cộng</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
          </div>
          <Button size="lg" className="mt-4 w-full gap-2" asChild>
            <Link href="/checkout">
              Thanh toán <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
