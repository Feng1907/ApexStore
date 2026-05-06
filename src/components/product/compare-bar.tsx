'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GitCompare, Trash2 } from 'lucide-react'
import { useCompareStore } from '@/stores/compare.store'
import { Button } from '@/components/ui/button'

export function CompareBar() {
  const { items, remove, clear } = useCompareStore()

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <div className="flex flex-1 items-center gap-3 overflow-x-auto">
              <GitCompare className="h-5 w-5 shrink-0 text-blue-600" />
              <span className="shrink-0 text-sm font-semibold text-zinc-700">So sánh ({items.length}/3)</span>
              {items.map((p) => (
                <div key={p.id} className="flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={p.images[0] ?? ''} alt={p.name} fill className="object-contain p-0.5" sizes="32px" />
                  </div>
                  <span className="max-w-[120px] truncate text-xs font-medium text-zinc-800">{p.name}</span>
                  <button onClick={() => remove(p.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {items.length < 3 && (
                <div className="flex h-[38px] w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-xs text-zinc-400">
                  + Thêm sản phẩm
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clear} className="gap-1.5 text-zinc-500">
                <Trash2 className="h-4 w-4" /> Xóa
              </Button>
              <Button size="sm" className="gap-1.5" disabled={items.length < 2} asChild>
                <Link href={`/compare?ids=${items.map((p) => p.id).join(',')}`}>
                  <GitCompare className="h-4 w-4" /> So sánh ngay
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
