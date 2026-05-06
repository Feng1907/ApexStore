import { Metadata } from 'next'
import { FlashSaleBanner } from '@/components/flash-sale/flash-sale-banner'
import { Zap } from 'lucide-react'

export const metadata: Metadata = { title: 'Flash Sale' }

export default function FlashSalePage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-linear-to-r from-red-600 to-orange-500 px-4 py-14 text-center text-white sm:px-6">
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 fill-white" />
            <span className="text-2xl font-black tracking-widest">FLASH SALE</span>
            <Zap className="h-6 w-6 fill-white" />
          </div>
          <p className="text-white/80">Ưu đãi sốc có giới hạn — số lượng cập nhật realtime</p>
        </div>
      </div>

      <FlashSaleBanner />
    </div>
  )
}
