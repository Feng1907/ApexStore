# ApexStore — Premium Tech E-Commerce Platform

> Nền tảng thương mại điện tử thiết bị Apple cao cấp, xây dựng với Next.js 16, TypeScript, AI (Gemini RAG), Realtime Flash Sale và 3D Interactive Product Viewer.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma)](https://prisma.io)

---

## 📸 Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🤖 **AI Shopping Assistant** | Chatbot tư vấn mua sắm với Gemini 2.0 Flash, streaming SSE, RAG từ DB thực tế |
| ⚡ **Flash Sale Realtime** | Countdown timer, stock progress bar, FOMO badges cập nhật realtime |
| 🎮 **3D Product Viewer** | Xoay 360°, hotspots tương tác, đổi màu realtime bằng React Three Fiber |
| ♻️ **Smart Trade-in** | Multi-step form định giá máy cũ, tính chênh lệch lên đời mới |
| ⚖️ **Comparison Tool** | So sánh 2–3 sản phẩm side-by-side với bảng thông số đầy đủ |
| 🛒 **Cart & Checkout** | Optimistic UI, CartDrawer, checkout 3 bước với Zod validation |
| 🔐 **Authentication** | Supabase Email/Password + Google OAuth |
| 🛠️ **Admin Dashboard** | Quản lý sản phẩm, đơn hàng, flash sale + Recharts analytics |

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** (App Router, SSR/SSG/ISR)
- **TypeScript 5** — type-safe toàn codebase
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — micro-interactions, page transitions
- **Zustand 5** — global state (cart, auth, compare)
- **TanStack Query 5** — server state, caching
- **React Hook Form + Zod** — form validation
- **React Three Fiber + Drei** — 3D rendering
- **Recharts** — admin analytics charts

### Backend & Database
- **Next.js API Routes** — BFF pattern
- **Prisma v7 + PostgreSQL** — type-safe ORM
- **Supabase** — Auth + Database hosting
- **Google Gemini API** — AI chatbot core
- **RAG Pattern** — product context injection

### DevOps
- **Vercel** — deployment, Edge Network
- **Git Flow** — `main` → `develop` → `feature/*`

---

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── (auth)/login & register     # Auth pages
│   ├── admin/                      # Admin dashboard
│   ├── api/ai/chat                 # Gemini streaming endpoint
│   ├── api/flash-sale              # Flash sale API
│   ├── api/admin/orders            # Admin orders API
│   ├── cart/                       # Cart page
│   ├── checkout/                   # 3-step checkout
│   ├── compare/                    # Product comparison
│   ├── dashboard/                  # User dashboard
│   ├── flash-sale/                 # Flash sale page
│   ├── products/[slug]/            # Product detail + 3D
│   ├── trade-in/                   # Trade-in calculator
│   └── page.tsx                    # Homepage
├── components/
│   ├── admin/                      # RevenueChart, OrderStatusSelect
│   ├── ai/                         # AiChatWidget
│   ├── cart/                       # CartDrawer
│   ├── flash-sale/                 # FlashSaleBanner
│   ├── layout/                     # Header, Footer
│   ├── product/                    # ProductCard, ProductDetail, Filters, CompareBar
│   ├── three/                      # ProductViewer3D
│   └── ui/                         # Button, Badge, Skeleton
├── hooks/                          # useAiChat, useFlashSale, useCountdown
├── lib/
│   ├── db.ts                       # Prisma client (pg adapter)
│   ├── supabase/                   # client.ts, server.ts
│   └── utils.ts                    # cn, formatPrice, slugify
├── providers/                      # QueryProvider
├── stores/                         # cart, auth, compare (Zustand)
└── types/                          # CartItem, ProductWithVariants, FilterParams
```

---

## ⚙️ Cài đặt & Chạy local

### 1. Clone & cài dependencies

```bash
git clone https://github.com/DuongAnPhong/ApexStore.git
cd ApexStore
npm install
```

### 2. Tạo file `.env`

```bash
cp .env.example .env
```

Điền các giá trị vào `.env`:

```env
# PostgreSQL (Supabase)
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Google Gemini AI
GEMINI_API_KEY=AIza...
```

### 3. Setup Database

```bash
# Tạo bảng
npm run db:push

# Seed dữ liệu mẫu (7 sản phẩm Apple)
npm run db:seed
```

### 4. Chạy dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Database Schema

```
Product          → ProductVariant (1-n)
Product          → Review (1-n)
Product          → AIKnowledge (1-n)
ProductVariant   → OrderItem (1-n)
ProductVariant   → FlashSale (1-n)
Order            → OrderItem (1-n)
```

7 models: `Product`, `ProductVariant`, `Order`, `OrderItem`, `Review`, `FlashSale`, `AIKnowledge`

---

## 🤖 AI Chat — Cách hoạt động (RAG Pattern)

```
User message
    │
    ▼
Query toàn bộ products từ DB (tên, giá, stock, màu, storage)
    │
    ▼
Inject vào system prompt làm context
    │
    ▼
Gemini 2.0 Flash xử lý + streaming response (SSE)
    │
    ▼
UI render từng token realtime (như ChatGPT)
```

**Sentiment Analysis**: Phát hiện từ khoá tiêu cực → tự động offer voucher 500k.

---

## 🌐 Deploy lên Vercel

```bash
# 1. Push lên GitHub (đã có)
# 2. Tạo project trên vercel.com → Import repo
# 3. Điền Environment Variables (theo .env.example)
# 4. Deploy → Done!
```

Xem `vercel.json` để biết cấu hình region và env vars mapping.

---

## 📊 Routes

| Route | Loại | Mô tả |
|---|---|---|
| `/` | Dynamic | Homepage (SSR) |
| `/products` | Dynamic | Listing + URL-synced filters |
| `/products/[slug]` | Dynamic | Detail + 3D Viewer |
| `/cart` | Static | Cart management |
| `/checkout` | Static | 3-step checkout |
| `/login` `/register` | Static | Auth pages |
| `/dashboard` | Static | User dashboard |
| `/flash-sale` | Static | Flash sale page |
| `/trade-in` | Static | Trade-in calculator |
| `/compare` | Dynamic | Product comparison |
| `/admin` | Dynamic | Admin overview |
| `/admin/products` | Dynamic | Product management |
| `/admin/orders` | Dynamic | Order management |
| `/admin/flash-sales` | Dynamic | Flash sale management |
| `/api/ai/chat` | Dynamic | Gemini streaming API |
| `/api/flash-sale` | Dynamic | Flash sale API |
| `/api/admin/orders` | Dynamic | Admin orders API |

---

## 🌿 Git Flow

```
main          ← Production (v1.0.0)
└── develop   ← Integration
    ├── feature/phase-1-foundation       ✅
    ├── feature/phase-2-cart-auth-checkout  ✅
    ├── feature/phase-3-ai-realtime      ✅
    ├── feature/phase-4-3d-advanced      ✅
    └── feature/phase-5-admin-deploy     ✅
```

---

## 📄 License

MIT © [DuongAnPhong](https://github.com/DuongAnPhong)
