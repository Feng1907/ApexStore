'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Heart, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý', SHIPPED: 'Đang giao',
  DELIVERED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  PENDING: 'warning', CONFIRMED: 'secondary', PROCESSING: 'secondary',
  SHIPPED: 'outline', DELIVERED: 'success', CANCELLED: 'destructive',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [tab, setTab] = useState<'orders' | 'wishlist' | 'profile'>('orders')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
    })
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const tabs = [
    { id: 'orders', label: 'Đơn hàng', icon: Package },
    { id: 'wishlist', label: 'Yêu thích', icon: Heart },
    { id: 'profile', label: 'Tài khoản', icon: User },
  ] as const

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Xin chào, {user?.user_metadata?.full_name ?? 'bạn'} 👋
          </h1>
          <p className="text-sm text-zinc-500">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-zinc-100 bg-zinc-50 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {tab === 'orders' && (
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="py-10 text-center text-sm text-zinc-400">
            Chưa có đơn hàng nào.{' '}
            <Link href="/products" className="text-blue-600 hover:underline">Mua sắm ngay</Link>
          </p>
        </div>
      )}

      {/* Wishlist tab */}
      {tab === 'wishlist' && (
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="py-10 text-center text-sm text-zinc-400">
            Danh sách yêu thích trống.{' '}
            <Link href="/products" className="text-blue-600 hover:underline">Khám phá sản phẩm</Link>
          </p>
        </div>
      )}

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Họ và tên</label>
            <input
              defaultValue={user?.user_metadata?.full_name ?? ''}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input
              defaultValue={user?.email ?? ''}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none"
              readOnly
            />
          </div>
          <Button variant="outline" className="w-full">Cập nhật thông tin</Button>
        </div>
      )}
    </div>
  )
}
