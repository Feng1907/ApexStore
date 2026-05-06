export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductCard } from '@/components/product/product-card'
import { ProductViewer3D } from '@/components/three/product-viewer-3d'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!product) notFound()

  const related = await db.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    include: {
      variants: true,
      reviews: { select: { rating: true, comment: true, userName: true, id: true, createdAt: true } },
    },
    take: 4,
  })

  const serialized = {
    ...product,
    basePrice: Number(product.basePrice),
    variants: product.variants.map((v) => ({ ...v, price: Number(v.price) })),
  }

  const relatedSerialized = related.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductDetail product={serialized} />

      {/* 3D Viewer — chỉ hiện cho iPhone */}
      {product.category === 'IPHONE' && (
        <section className="mt-16">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-900">Khám phá 3D</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Interactive</span>
          </div>
          <ProductViewer3D />
        </section>
      )}

      {relatedSerialized.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-xl font-bold text-zinc-900">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedSerialized.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
