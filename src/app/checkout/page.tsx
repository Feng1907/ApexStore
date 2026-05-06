'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const steps = ['Thông tin', 'Vận chuyển', 'Thanh toán']

const infoSchema = z.object({
  fullName: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ'),
})

const shippingSchema = z.object({
  address: z.string().min(5, 'Địa chỉ ít nhất 5 ký tự'),
  ward: z.string().min(1, 'Vui lòng nhập phường/xã'),
  district: z.string().min(1, 'Vui lòng nhập quận/huyện'),
  city: z.string().min(1, 'Vui lòng nhập tỉnh/thành'),
})

type InfoForm = z.infer<typeof infoSchema>
type ShippingForm = z.infer<typeof shippingSchema>

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                i < current
                  ? 'bg-green-600 text-white'
                  : i === current
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-xs ${i === current ? 'font-semibold text-zinc-900' : 'text-zinc-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mb-5 h-px w-16 sm:w-24 ${i < current ? 'bg-green-600' : 'bg-zinc-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState(0)
  const [infoData, setInfoData] = useState<InfoForm | null>(null)
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay' | 'stripe'>('cod')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const infoForm = useForm<InfoForm>({ resolver: zodResolver(infoSchema) })
  const shippingForm = useForm<ShippingForm>({ resolver: zodResolver(shippingSchema) })

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-zinc-500">Giỏ hàng trống. Hãy thêm sản phẩm trước khi thanh toán.</p>
        <Button asChild>
          <Link href="/products">Khám phá sản phẩm</Link>
        </Button>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Đặt hàng thành công!</h1>
        <p className="max-w-sm text-zinc-500">
          Cảm ơn bạn đã mua sắm tại ApexStore. Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất.
        </p>
        <Button asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Thanh toán</h1>
      <StepIndicator current={step} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 font-semibold text-zinc-900">Thông tin người đặt</h2>
                <form
                  onSubmit={infoForm.handleSubmit((data) => {
                    setInfoData(data)
                    setStep(1)
                  })}
                  className="space-y-4"
                >
                  {(['fullName', 'email', 'phone'] as const).map((field) => (
                    <div key={field}>
                      <label className="mb-1 block text-sm font-medium text-zinc-700">
                        {field === 'fullName' ? 'Họ và tên' : field === 'email' ? 'Email' : 'Số điện thoại'}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...infoForm.register(field)}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder={field === 'fullName' ? 'Nguyễn Văn A' : field === 'email' ? 'email@example.com' : '0901234567'}
                      />
                      {infoForm.formState.errors[field] && (
                        <p className="mt-1 text-xs text-red-500">{infoForm.formState.errors[field]?.message}</p>
                      )}
                    </div>
                  ))}
                  <Button type="submit" className="w-full gap-2">
                    Tiếp theo <ChevronRight className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 font-semibold text-zinc-900">Địa chỉ giao hàng</h2>
                <form
                  onSubmit={shippingForm.handleSubmit((data) => {
                    setShippingData(data)
                    setStep(2)
                  })}
                  className="space-y-4"
                >
                  {([
                    { name: 'address', label: 'Số nhà, tên đường', placeholder: '123 Nguyễn Huệ' },
                    { name: 'ward', label: 'Phường / Xã', placeholder: 'Phường Bến Nghé' },
                    { name: 'district', label: 'Quận / Huyện', placeholder: 'Quận 1' },
                    { name: 'city', label: 'Tỉnh / Thành phố', placeholder: 'TP. Hồ Chí Minh' },
                  ] as const).map((f) => (
                    <div key={f.name}>
                      <label className="mb-1 block text-sm font-medium text-zinc-700">
                        {f.label}<span className="text-red-500">*</span>
                      </label>
                      <input
                        {...shippingForm.register(f.name)}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      {shippingForm.formState.errors[f.name] && (
                        <p className="mt-1 text-xs text-red-500">{shippingForm.formState.errors[f.name]?.message}</p>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <Button variant="outline" type="button" onClick={() => setStep(0)} className="flex-1">
                      Quay lại
                    </Button>
                    <Button type="submit" className="flex-1 gap-2">
                      Tiếp theo <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-4 font-semibold text-zinc-900">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  {([
                    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
                    { value: 'vnpay', label: 'VNPAY / QR Code', icon: '📱' },
                    { value: 'stripe', label: 'Thẻ tín dụng / Stripe', icon: '💳' },
                  ] as const).map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                        paymentMethod === m.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-sm font-medium text-zinc-900">{m.label}</span>
                      {paymentMethod === m.value && (
                        <Check className="ml-auto h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      clearCart()
                      setOrderPlaced(true)
                    }}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-zinc-900">Đơn hàng</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-50">
                  <Image
                    src={item.image || '/placeholder-product.png'}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="line-clamp-1 text-xs font-medium text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">x{item.quantity}</p>
                  <p className="text-xs font-semibold text-zinc-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-zinc-100" />
          <div className="flex justify-between text-sm font-bold text-zinc-900">
            <span>Tổng cộng</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
