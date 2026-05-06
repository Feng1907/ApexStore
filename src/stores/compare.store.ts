import { create } from 'zustand'
import type { ProductWithVariants } from '@/types'

interface CompareStore {
  items: ProductWithVariants[]
  add: (product: ProductWithVariants) => void
  remove: (productId: string) => void
  clear: () => void
  has: (productId: string) => boolean
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  add: (product) => {
    if (get().items.length >= 3) return
    if (get().has(product.id)) return
    set((s) => ({ items: [...s.items, product] }))
  },
  remove: (productId) => set((s) => ({ items: s.items.filter((p) => p.id !== productId) })),
  clear: () => set({ items: [] }),
  has: (productId) => get().items.some((p) => p.id === productId),
}))
