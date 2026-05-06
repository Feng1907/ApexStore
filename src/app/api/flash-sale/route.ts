import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const now = new Date()
  const sales = await db.flashSale.findMany({
    where: { active: true, startAt: { lte: now }, endAt: { gte: now } },
    include: {
      variant: {
        include: { product: { select: { name: true, slug: true, images: true } } },
      },
    },
  })

  return NextResponse.json(sales.map((s) => ({
    id: s.id,
    discount: s.discount,
    stock: s.stock,
    endAt: s.endAt,
    variant: {
      id: s.variant.id,
      storage: s.variant.storage,
      color: s.variant.color,
      originalPrice: Number(s.variant.price),
      salePrice: Math.round(Number(s.variant.price) * (1 - s.discount)),
      product: s.variant.product,
    },
  })))
}

export async function POST(req: NextRequest) {
  const { flashSaleId } = await req.json()

  const sale = await db.flashSale.findUnique({ where: { id: flashSaleId } })
  if (!sale || sale.stock <= 0) {
    return NextResponse.json({ error: 'Flash sale không còn hàng' }, { status: 400 })
  }

  await db.flashSale.update({
    where: { id: flashSaleId },
    data: { stock: { decrement: 1 } },
  })

  return NextResponse.json({ success: true })
}
