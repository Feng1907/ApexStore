'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-semibold text-zinc-900">
                  Giỏ hàng ({totalItems()})
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Đóng">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-zinc-200" />
                  <div>
                    <p className="font-medium text-zinc-700">Giỏ hàng trống</p>
                    <p className="mt-1 text-sm text-zinc-400">Thêm sản phẩm để bắt đầu mua sắm</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={onClose} asChild>
                    <Link href="/products">Khám phá sản phẩm</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 rounded-xl border border-zinc-100 p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-50">
                        <Image
                          src={item.image || '/placeholder-product.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="line-clamp-2 text-sm font-medium text-zinc-900 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 rounded-lg border border-zinc-200">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                              aria-label="Giảm"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30"
                              aria-label="Tăng"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-zinc-400 transition-colors hover:text-red-500"
                            aria-label="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-100 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Tạm tính</span>
                  <span className="font-bold text-zinc-900">{formatPrice(totalPrice())}</span>
                </div>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout" onClick={onClose}>
                    Tiến hành thanh toán
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/cart" onClick={onClose}>
                    Xem giỏ hàng
                  </Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
