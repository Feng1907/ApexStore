export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card'
import { db } from '@/lib/db'
import { Suspense } from 'react'

async function FeaturedProducts() {
  const products = await db.product.findMany({
    where: { featured: true },
    include: {
      variants: true,
      reviews: {
        select: { rating: true, comment: true, userName: true, id: true, createdAt: true },
      },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  if (products.length === 0) {
    return (
      <p className="col-span-full py-12 text-center text-sm text-zinc-400">
        Chưa có sản phẩm. Hãy chạy <code>npm run db:seed</code> để thêm dữ liệu mẫu.
      </p>
    )
  }

  return (
    <>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={{
            ...p,
            basePrice: Number(p.basePrice),
            variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
          }}
        />
      ))}
    </>
  )
}

const categories = [
  { label: 'iPhone', href: '/products?category=IPHONE', emoji: '📱', desc: 'Từ iPhone 13 đến 16 Pro Max' },
  { label: 'iPad', href: '/products?category=IPAD', emoji: '🖥️', desc: 'iPad Air, Pro, mini' },
  { label: 'MacBook', href: '/products?category=MACBOOK', emoji: '💻', desc: 'MacBook Air & Pro M-series' },
  { label: 'AirPods', href: '/products?category=AIRPODS', emoji: '🎧', desc: 'AirPods 4, Pro 2, Max' },
]

const perks = [
  { icon: Truck, title: 'Giao hàng nhanh', desc: 'Nội thành 2 giờ, toàn quốc 24 giờ' },
  { icon: Shield, title: 'Bảo hành chính hãng', desc: '12 tháng Apple, hỗ trợ đổi trả 7 ngày' },
  { icon: Zap, title: 'Flash Sale mỗi ngày', desc: 'Ưu đãi giới hạn, cập nhật realtime' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-24 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Badge variant="outline" className="mb-4 border-zinc-600 text-zinc-300">
            ✦ Thiết bị Apple chính hãng
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Công nghệ đỉnh cao. <br />
            <span className="text-blue-400">Trải nghiệm không giới hạn.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
            Mua iPhone, MacBook, iPad chính hãng với giá tốt nhất. Tư vấn AI 24/7, giao hàng siêu tốc.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="primary" asChild>
              <Link href="/products">
                Khám phá ngay <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800"
              asChild
            >
              <Link href="/flash-sale">Flash Sale hôm nay</Link>
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
      </section>

      {/* Perks */}
      <section className="border-b border-zinc-100 bg-zinc-50 px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="text-xs text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <div>
                  <p className="font-semibold text-zinc-900">{cat.label}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-zinc-50 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Sản phẩm nổi bật</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Suspense
              fallback={Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            >
              <FeaturedProducts />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
