import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const products = [
  {
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    description:
      'iPhone 16 Pro Max — đỉnh cao của công nghệ smartphone. Chip A18 Pro mạnh mẽ, hệ thống camera Pro 48MP với tính năng Camera Control, màn hình Super Retina XDR 6.9 inch Always-On, pin siêu trâu 33 giờ phát video.',
    category: 'IPHONE' as const,
    basePrice: 34990000,
    featured: true,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg',
    ],
    variants: [
      { storage: '256GB', color: 'Desert Titanium', colorHex: '#C4A882', price: 34990000, stock: 15, sku: 'IP16PM-256-DT' },
      { storage: '256GB', color: 'Black Titanium', colorHex: '#3D3731', price: 34990000, stock: 12, sku: 'IP16PM-256-BT' },
      { storage: '256GB', color: 'White Titanium', colorHex: '#F1EEE9', price: 34990000, stock: 8, sku: 'IP16PM-256-WT' },
      { storage: '512GB', color: 'Desert Titanium', colorHex: '#C4A882', price: 39990000, stock: 10, sku: 'IP16PM-512-DT' },
      { storage: '512GB', color: 'Black Titanium', colorHex: '#3D3731', price: 39990000, stock: 7, sku: 'IP16PM-512-BT' },
      { storage: '1TB', color: 'Desert Titanium', colorHex: '#C4A882', price: 44990000, stock: 5, sku: 'IP16PM-1TB-DT' },
    ],
    reviews: [
      { userId: 'user1', userName: 'Minh Tú', rating: 5, comment: 'Máy cực đẹp, camera chụp ảnh rất nét. Màn hình to dùng rất sướng!' },
      { userId: 'user2', userName: 'Hoàng Nam', rating: 5, comment: 'Pin dùng được 2 ngày không cần sạc. Đáng tiền!' },
    ],
  },
  {
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    description:
      'iPhone 16 Pro — sức mạnh chuyên nghiệp trong thiết kế nhỏ gọn. Chip A18 Pro, màn hình 6.3 inch, hệ thống camera Pro với Camera Control, Dynamic Island thế hệ mới.',
    category: 'IPHONE' as const,
    basePrice: 29990000,
    featured: true,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg',
    ],
    variants: [
      { storage: '128GB', color: 'Desert Titanium', colorHex: '#C4A882', price: 29990000, stock: 20, sku: 'IP16P-128-DT' },
      { storage: '128GB', color: 'Black Titanium', colorHex: '#3D3731', price: 29990000, stock: 18, sku: 'IP16P-128-BT' },
      { storage: '256GB', color: 'Desert Titanium', colorHex: '#C4A882', price: 32990000, stock: 14, sku: 'IP16P-256-DT' },
      { storage: '256GB', color: 'Natural Titanium', colorHex: '#E3D5C3', price: 32990000, stock: 11, sku: 'IP16P-256-NT' },
      { storage: '512GB', color: 'Black Titanium', colorHex: '#3D3731', price: 37990000, stock: 6, sku: 'IP16P-512-BT' },
    ],
    reviews: [
      { userId: 'user3', userName: 'Lan Anh', rating: 5, comment: 'Nhỏ gọn mà vẫn Pro, phù hợp con gái dùng.' },
    ],
  },
  {
    name: 'iPhone 15',
    slug: 'iphone-15',
    description:
      'iPhone 15 — nâng cấp đáng kể với màn hình Dynamic Island, chip A16 Bionic, camera chính 48MP và cổng USB-C tiện lợi. Lựa chọn xuất sắc trong tầm giá.',
    category: 'IPHONE' as const,
    basePrice: 22990000,
    featured: false,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg',
    ],
    variants: [
      { storage: '128GB', color: 'Pink', colorHex: '#F2A7B0', price: 22990000, stock: 25, sku: 'IP15-128-PK' },
      { storage: '128GB', color: 'Black', colorHex: '#2C2C2C', price: 22990000, stock: 22, sku: 'IP15-128-BK' },
      { storage: '128GB', color: 'Blue', colorHex: '#A8C5DA', price: 22990000, stock: 20, sku: 'IP15-128-BL' },
      { storage: '256GB', color: 'Pink', colorHex: '#F2A7B0', price: 25990000, stock: 18, sku: 'IP15-256-PK' },
      { storage: '256GB', color: 'Black', colorHex: '#2C2C2C', price: 25990000, stock: 15, sku: 'IP15-256-BK' },
    ],
    reviews: [],
  },
  {
    name: 'MacBook Air M3 13"',
    slug: 'macbook-air-m3-13',
    description:
      'MacBook Air M3 13 inch — mỏng nhẹ kỷ lục, chip M3 bùng nổ hiệu suất, màn hình Liquid Retina 13.6 inch, pin 18 giờ. Máy tính xách tay hoàn hảo cho sinh viên và người đi làm.',
    category: 'MACBOOK' as const,
    basePrice: 28990000,
    featured: true,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg',
    ],
    variants: [
      { storage: '256GB', color: 'Midnight', colorHex: '#1C2B41', price: 28990000, stock: 10, sku: 'MBA-M3-256-MN' },
      { storage: '256GB', color: 'Starlight', colorHex: '#E8E0D5', price: 28990000, stock: 9, sku: 'MBA-M3-256-SL' },
      { storage: '512GB', color: 'Midnight', colorHex: '#1C2B41', price: 34990000, stock: 7, sku: 'MBA-M3-512-MN' },
      { storage: '512GB', color: 'Space Gray', colorHex: '#6B6B6B', price: 34990000, stock: 6, sku: 'MBA-M3-512-SG' },
    ],
    reviews: [
      { userId: 'user4', userName: 'Phúc Nguyên', rating: 5, comment: 'Mỏng nhẹ, pin trâu, chạy mượt. Xứng danh MacBook Air!' },
    ],
  },
  {
    name: 'MacBook Pro M4 14"',
    slug: 'macbook-pro-m4-14',
    description:
      'MacBook Pro M4 14 inch — sức mạnh chuyên nghiệp với chip M4, màn hình Liquid Retina XDR, cổng kết nối đầy đủ HDMI/SD Card/Thunderbolt. Lý tưởng cho dev, designer và content creator.',
    category: 'MACBOOK' as const,
    basePrice: 42990000,
    featured: true,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg',
    ],
    variants: [
      { storage: '512GB', color: 'Space Black', colorHex: '#3A3A3C', price: 42990000, stock: 8, sku: 'MBP-M4-512-SB' },
      { storage: '512GB', color: 'Silver', colorHex: '#E0E0E0', price: 42990000, stock: 7, sku: 'MBP-M4-512-SV' },
      { storage: '1TB', color: 'Space Black', colorHex: '#3A3A3C', price: 49990000, stock: 5, sku: 'MBP-M4-1TB-SB' },
    ],
    reviews: [
      { userId: 'user5', userName: 'Việt Anh', rating: 5, comment: 'Dùng code và dựng video cùng lúc không thấy nóng máy. Quá đỉnh!' },
    ],
  },
  {
    name: 'iPad Air M2 11"',
    slug: 'ipad-air-m2-11',
    description:
      'iPad Air M2 11 inch — chip M2 mạnh mẽ, màn hình Liquid Retina 11 inch, hỗ trợ Apple Pencil Pro và Magic Keyboard. Siêu phẩm cho học tập và sáng tạo nội dung.',
    category: 'IPAD' as const,
    basePrice: 18990000,
    featured: true,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202405?wid=940&hei=1112&fmt=p-jpg',
    ],
    variants: [
      { storage: '128GB', color: 'Blue', colorHex: '#A8C5DA', price: 18990000, stock: 15, sku: 'IPAD-AIR-128-BL' },
      { storage: '128GB', color: 'Starlight', colorHex: '#E8E0D5', price: 18990000, stock: 12, sku: 'IPAD-AIR-128-SL' },
      { storage: '256GB', color: 'Blue', colorHex: '#A8C5DA', price: 22990000, stock: 9, sku: 'IPAD-AIR-256-BL' },
      { storage: '256GB', color: 'Purple', colorHex: '#B59DC5', price: 22990000, stock: 8, sku: 'IPAD-AIR-256-PL' },
    ],
    reviews: [],
  },
  {
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    description:
      'AirPods Pro thế hệ 2 — chống ồn ANC đẳng cấp mới, âm thanh Spatial Audio, chip H2, vỏ sạc MagSafe với loa và dây đeo. Tự động cân chỉnh âm lượng theo môi trường.',
    category: 'AIRPODS' as const,
    basePrice: 6990000,
    featured: false,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg',
    ],
    variants: [
      { storage: 'N/A', color: 'White', colorHex: '#FFFFFF', price: 6990000, stock: 30, sku: 'APP2-WHT' },
    ],
    reviews: [
      { userId: 'user6', userName: 'Thu Hà', rating: 5, comment: 'Chống ồn cực tốt, dùng khi đi tàu điện không nghe tiếng gì hết!' },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  await db.review.deleteMany()
  await db.orderItem.deleteMany()
  await db.productVariant.deleteMany()
  await db.product.deleteMany()

  for (const p of products) {
    const { variants, reviews, ...productData } = p
    const product = await db.product.create({
      data: { ...productData, basePrice: productData.basePrice },
    })

    for (const v of variants) {
      await db.productVariant.create({ data: { ...v, productId: product.id } })
    }

    for (const r of reviews) {
      await db.review.create({ data: { ...r, productId: product.id } })
    }

    console.log(`  ✓ ${product.name}`)
  }

  console.log('✅ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
