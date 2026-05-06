export type { Product, ProductVariant, Order, OrderItem, Review, FlashSale, Category, OrderStatus } from '@prisma/client'

export interface CartItem {
  variantId: string
  productId: string
  name: string
  slug: string
  image: string
  color: string
  colorHex: string
  storage: string
  price: number
  quantity: number
  stock: number
}

export interface ProductWithVariants {
  id: string
  name: string
  slug: string
  description: string
  category: string
  basePrice: number
  images: string[]
  featured: boolean
  variants: {
    id: string
    storage: string
    color: string
    colorHex: string
    price: number
    stock: number
    sku: string
  }[]
  reviews: {
    id: string
    rating: number
    comment: string
    userName: string
    createdAt: Date
  }[]
}

export interface FilterParams {
  category?: string
  minPrice?: number
  maxPrice?: number
  storage?: string
  color?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
  page?: number
  search?: string
}
