'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  fullName: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } },
    })
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✉️</div>
          <h2 className="font-bold text-zinc-900">Kiểm tra email của bạn</h2>
          <p className="mt-2 text-sm text-zinc-500">Chúng tôi đã gửi link xác nhận. Vui lòng kiểm tra hộp thư.</p>
          <Button className="mt-4 w-full" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Tạo tài khoản</h1>
        <p className="mb-6 text-sm text-zinc-500">Đăng ký để mua sắm dễ dàng hơn.</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {([
            { name: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
          ] as const).map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-sm font-medium text-zinc-700">{f.label}</label>
              <input
                {...register(f.name)}
                type={f.type}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]?.message}</p>}
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Mật khẩu</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••"
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
