'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'PENDING',    label: 'Chờ xác nhận' },
  { value: 'CONFIRMED',  label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPED',    label: 'Đang giao' },
  { value: 'DELIVERED',  label: 'Hoàn thành' },
  { value: 'CANCELLED',  label: 'Đã hủy' },
]

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: string) {
    setLoading(true)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    })
    setStatus(newStatus)
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-700 outline-none focus:border-blue-400 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
