'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

const DEVICE_OPTIONS = [
  { id: 'ip15pm', name: 'iPhone 15 Pro Max', maxValue: 22000000 },
  { id: 'ip15p', name: 'iPhone 15 Pro', maxValue: 18000000 },
  { id: 'ip15', name: 'iPhone 15', maxValue: 14000000 },
  { id: 'ip14pm', name: 'iPhone 14 Pro Max', maxValue: 16000000 },
  { id: 'ip14p', name: 'iPhone 14 Pro', maxValue: 13000000 },
  { id: 'ip14', name: 'iPhone 14', maxValue: 10000000 },
  { id: 'ip13', name: 'iPhone 13', maxValue: 7000000 },
  { id: 'mba-m2', name: 'MacBook Air M2', maxValue: 18000000 },
  { id: 'mba-m1', name: 'MacBook Air M1', maxValue: 13000000 },
]

const CONDITIONS = [
  { id: 'new', label: 'Như mới', desc: 'Không trầy xước, đầy đủ phụ kiện', multiplier: 1.0 },
  { id: 'good', label: 'Còn tốt', desc: 'Trầy nhẹ, hoạt động bình thường', multiplier: 0.8 },
  { id: 'fair', label: 'Trung bình', desc: 'Trầy xước rõ, pin còn 80%+', multiplier: 0.6 },
  { id: 'poor', label: 'Kém', desc: 'Hư hỏng nhẹ, pin yếu', multiplier: 0.35 },
]

const UPGRADE_TARGETS = [
  { id: 'ip16pm', name: 'iPhone 16 Pro Max', price: 34990000, slug: 'iphone-16-pro-max' },
  { id: 'ip16p', name: 'iPhone 16 Pro', price: 29990000, slug: 'iphone-16-pro' },
  { id: 'mbp-m4', name: 'MacBook Pro M4', price: 42990000, slug: 'macbook-pro-m4-14' },
  { id: 'mba-m3', name: 'MacBook Air M3', price: 28990000, slug: 'macbook-air-m3-13' },
]

const STEPS = ['Chọn máy cũ', 'Tình trạng', 'Định giá', 'Chọn máy mới']

function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < current ? 'bg-green-500 text-white' : i === current ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-[10px] sm:block ${i === current ? 'font-semibold text-zinc-900' : 'text-zinc-400'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mb-4 h-px w-12 sm:w-20 ${i < current ? 'bg-green-500' : 'bg-zinc-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function TradeInPage() {
  const [step, setStep] = useState(0)
  const [device, setDevice] = useState<typeof DEVICE_OPTIONS[0] | null>(null)
  const [condition, setCondition] = useState<typeof CONDITIONS[0] | null>(null)
  const [tradeValue, setTradeValue] = useState(0)

  function calcValue() {
    if (!device || !condition) return
    const val = Math.round(device.maxValue * condition.multiplier)
    setTradeValue(val)
    setStep(3)
  }

  function reset() {
    setStep(0); setDevice(null); setCondition(null); setTradeValue(0)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl">♻️</div>
        <h1 className="text-2xl font-bold text-zinc-900">Thu cũ đổi mới</h1>
        <p className="mt-1 text-sm text-zinc-500">Định giá máy cũ ngay, đổi lên đời mới dễ dàng</p>
      </div>

      <StepBar current={step} />

      <AnimatePresence mode="wait">
        {/* Step 0: Chọn máy cũ */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-zinc-900">Bạn đang dùng máy gì?</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DEVICE_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setDevice(d); setStep(1) }}
                    className="rounded-xl border-2 border-zinc-100 p-3 text-left text-sm transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
                  >
                    <span className="font-medium text-zinc-900">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Tình trạng */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <button onClick={() => setStep(0)} className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="h-4 w-4" /> {device?.name}
              </button>
              <h2 className="mb-4 font-semibold text-zinc-900">Tình trạng máy?</h2>
              <div className="space-y-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCondition(c); setStep(2) }}
                    className="flex w-full items-start gap-3 rounded-xl border-2 border-zinc-100 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-[0.99]"
                  >
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                      condition?.id === c.id ? 'border-blue-600 bg-blue-600' : 'border-zinc-300'
                    }`} />
                    <div>
                      <p className="font-medium text-zinc-900">{c.label}</p>
                      <p className="text-xs text-zinc-500">{c.desc}</p>
                    </div>
                    <span className="ml-auto shrink-0 text-sm font-semibold text-zinc-500">
                      ~{Math.round(c.multiplier * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Xem định giá */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm text-center">
              <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="h-4 w-4" /> {condition?.label}
              </button>
              <h2 className="mb-6 font-semibold text-zinc-900">Xem lại thông tin</h2>
              <div className="mx-auto max-w-xs space-y-3 rounded-2xl bg-zinc-50 p-5 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Thiết bị</span>
                  <span className="font-semibold text-zinc-900">{device?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Tình trạng</span>
                  <span className="font-semibold text-zinc-900">{condition?.label}</span>
                </div>
                <div className="border-t border-zinc-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-zinc-700">Giá thu ước tính</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(Math.round((device?.maxValue ?? 0) * (condition?.multiplier ?? 0)))}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="mt-6 w-full gap-2" onClick={calcValue}>
                Xem máy mới phù hợp <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Chọn máy mới */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="mb-6 rounded-2xl bg-green-50 p-4 text-center">
                <p className="text-sm text-zinc-600">Giá thu máy <strong>{device?.name}</strong> ({condition?.label})</p>
                <p className="mt-1 text-3xl font-black text-green-600">{formatPrice(tradeValue)}</p>
              </div>
              <h2 className="mb-4 font-semibold text-zinc-900">Chọn máy mới để lên đời</h2>
              <div className="space-y-3">
                {UPGRADE_TARGETS.map((t) => {
                  const diff = t.price - tradeValue
                  return (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-zinc-100 p-4">
                      <div>
                        <p className="font-semibold text-zinc-900">{t.name}</p>
                        <p className="text-xs text-zinc-500">Giá gốc: {formatPrice(t.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">
                          {diff > 0 ? `Bù thêm ${formatPrice(diff)}` : '🎉 Đủ tiền!'}
                        </p>
                        <Button size="sm" className="mt-1.5" asChild>
                          <Link href={`/products/${t.slug}`}>Xem máy</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={reset} className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Tính lại
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
