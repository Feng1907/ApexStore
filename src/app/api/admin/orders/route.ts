import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? 20)
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, status: true, totalAmount: true, createdAt: true, userId: true },
  })
  return NextResponse.json(
    orders.map((o) => ({ ...o, totalAmount: Number(o.totalAmount) }))
  )
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const order = await db.order.update({ where: { id }, data: { status } })
  return NextResponse.json({ ...order, totalAmount: Number(order.totalAmount) })
}
