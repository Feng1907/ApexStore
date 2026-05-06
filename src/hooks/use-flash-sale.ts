import { useEffect, useState } from 'react'

export interface FlashSaleItem {
  id: string
  discount: number
  stock: number
  endAt: string
  variant: {
    id: string
    storage: string
    color: string
    originalPrice: number
    salePrice: number
    product: { name: string; slug: string; images: string[] }
  }
}

export function useFlashSale() {
  const [sales, setSales] = useState<FlashSaleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/flash-sale')
      .then((r) => r.json())
      .then((data) => {
        setSales(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { sales, loading }
}

export function useCountdown(endAt: string) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(endAt))

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(endAt)), 1000)
    return () => clearInterval(timer)
  }, [endAt])

  return timeLeft
}

function calcTimeLeft(endAt: string) {
  const diff = Math.max(0, new Date(endAt).getTime() - Date.now())
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { h, m, s, done: diff === 0 }
}
