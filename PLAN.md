# ApexStore — Premium Tech E-Commerce Platform

> **Mục tiêu nghề nghiệp:** Chứng minh năng lực làm chủ hệ sinh thái React/Next.js hiện đại, tư duy thiết kế hệ thống (System Design), tối ưu hóa Performance (Core Web Vitals ≥ 95), và tích hợp các công nghệ xu hướng (AI/RAG, WebSockets, 3D Rendering, Clean Architecture) — đủ sức cạnh tranh cho các vị trí **Frontend (React/Next.js)** và **Fullstack Developer** tại các công ty product-driven hàng đầu.

---

## I. TỔNG QUAN DỰ ÁN

| Hạng mục | Chi tiết |
|---|---|
| **Tên dự án** | **ApexStore** |
| **Lĩnh vực** | Thương mại điện tử thiết bị Apple cao cấp (iPhone, iPad, MacBook) |
| **Mô hình tham khảo** | Minh Tuấn Mobile, Hoàng Hà Mobile, Apple.com |
| **Demo URL** | *(sẽ cập nhật sau khi deploy)* |
| **Repository** | `github.com/DuongAnPhong/ApexStore` |
| **Thời gian dự kiến** | 10 tuần |

### Điểm khác biệt so với các dự án thông thường

- **AI-powered** — Tích hợp Gemini API với RAG thực sự (không phải chatbot fake)
- **Realtime architecture** — Flash Sale, stock count, live notifications với WebSocket
- **3D Interactive** — Xem sản phẩm 360° ngay trên trang chi tiết
- **Production-ready patterns** — Clean Architecture, Optimistic UI, Error Boundaries, Skeleton Loading
- **Performance obsessed** — Lighthouse ≥ 95, ISR, Image Optimization, Code Splitting

---

## II. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Next.js (App Router) | 15.x | SSR / SSG / ISR, SEO, File-based Routing |
| TypeScript | 5.x | Type safety, enterprise-grade codebase |
| Tailwind CSS | 3.x | Utility-first styling, responsive design |
| Shadcn/ui | latest | Accessible component primitives |
| Framer Motion | 11.x | Micro-interactions, page transitions |
| Zustand | 5.x | Lightweight global state (cart, auth, UI) |
| TanStack Query | 5.x | Server state, caching, optimistic updates |
| React Hook Form + Zod | latest | Form validation với type-safe schema |
| React Three Fiber + Drei | latest | 3D product viewer |
| Socket.io Client | latest | Realtime flash sale & notifications |

### Backend & Infrastructure
| Công nghệ | Mục đích |
|---|---|
| Next.js API Routes | BFF (Backend For Frontend), edge functions |
| PostgreSQL (Supabase) | Relational database, Auth |
| Prisma ORM | Type-safe DB access, migrations |
| Redis (Upstash) | Caching, session, pub/sub cho Flash Sale |
| Google Gemini API | AI chatbot core |
| LangChain.js | RAG pipeline, vector search |
| Cloudinary | Image optimization & delivery |
| Stripe / VNPAY Sandbox | Cổng thanh toán |

### DevOps & Tooling
| Công nghệ | Mục đích |
|---|---|
| Vercel | Deployment, Edge Network, Analytics |
| GitHub Actions | CI/CD pipeline, auto-deploy |
| Vitest + React Testing Library | Unit & Integration tests |
| Storybook | Component documentation |
| ESLint + Prettier + Husky | Code quality gates |

---

## III. TÍNH NĂNG CHI TIẾT

### 🤖 1. AI Shopping Assistant (RAG-powered) — FEATURE CHỦ CHỐT
**Tại sao ấn tượng:** Đây không phải chatbot template — đây là hệ thống RAG (Retrieval-Augmented Generation) thực sự, tích hợp trực tiếp với database sản phẩm.

- Người dùng chat tự nhiên: *"Tôi có 30 triệu, cần iPhone quay phim tốt nhất, pin trâu"*
- AI truy vấn vector store để tìm sản phẩm phù hợp từ DB thực tế
- Trả về danh sách sản phẩm kèm giá, tồn kho, link mua ngay
- **Phân tích cảm xúc (Sentiment Analysis):** Nhận diện khách hàng không hài lòng → tự động offer voucher
- **Streaming response** (Server-Sent Events) để trả lời từng chữ như ChatGPT

**Tech flow:** User Message → Gemini Embedding → Pinecone/pgvector similarity search → Context injection → Gemini response stream

### 🎮 2. 3D Interactive Product Viewer
- Xoay 360° model iPhone/MacBook bằng React Three Fiber
- Click vào **hotspot** (điểm nổi bật) để xem giải thích tính năng: Camera hệ thống, Dynamic Island, Action Button
- Chuyển màu sắc máy realtime trên model 3D
- Fallback graceful về carousel ảnh thông thường nếu thiết bị không đủ GPU

### ⚡ 3. Realtime Flash Sale Engine
- Đồng hồ đếm ngược đến giờ Flash Sale (countdown timer với animations)
- Thanh tiến trình **số lượng hàng còn lại** giảm realtime qua WebSocket khi có người mua
- Hiệu ứng FOMO: *"17 người đang xem sản phẩm này"*, *"Chỉ còn 3 chiếc"*
- Redis pub/sub làm event bus giữa các instance server

### 🔄 4. Smart Trade-in Calculator
- Multi-step form với progress indicator đẹp mắt
- Bước 1: Chọn dòng máy hiện có → Bước 2: Tình trạng máy → Bước 3: Xem giá thu → Bước 4: Chọn máy mới & tính chênh lệch
- Lưu kết quả, có thể share link để tham khảo sau

### 🔍 5. Advanced Product Search & Filter
- **Instant Search** với debounce, highlight kết quả khớp
- Filter đa chiều: Giá, màu sắc, dung lượng, series — URL-synced (shareable filters)
- **Comparison Tool:** Chọn 2-3 sản phẩm, xem bảng so sánh thông số cạnh nhau
- Sort: Giá tăng/giảm, Mới nhất, Đánh giá cao nhất, Bán chạy nhất

### 🛒 6. Shopping Cart & Checkout Flow
- Giỏ hàng persist với Zustand + localStorage sync
- **Optimistic UI:** Thêm vào giỏ → UI cập nhật ngay, không đợi API
- Checkout multi-step: Thông tin → Giao hàng → Thanh toán → Xác nhận
- Tích hợp Stripe (international) + VNPAY Sandbox (Vietnam)
- Email xác nhận đơn hàng tự động (Resend)

### 🔐 7. Authentication & User Dashboard
- Auth với Supabase (Email/Password + Google OAuth)
- Dashboard: Lịch sử đơn hàng, trạng thái giao hàng, wishlist
- **Địa chỉ giao hàng** lưu nhiều địa chỉ, chọn nhanh khi checkout

### 📊 8. Admin Dashboard (Bonus — nâng điểm mạnh)
- CRUD sản phẩm với drag-and-drop sắp xếp ảnh
- Quản lý đơn hàng với cập nhật trạng thái realtime
- **Analytics chart** (Recharts): Doanh thu theo ngày, top sản phẩm, tỉ lệ chuyển đổi
- Quản lý Flash Sale: Tạo/xoá/lên lịch

---

## IV. DATABASE SCHEMA

```prisma
model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String
  brand       String    // "Apple"
  category    String    // "iPhone", "iPad", "MacBook"
  basePrice   Decimal
  images      String[]
  variants    ProductVariant[]
  reviews     Review[]
  createdAt   DateTime  @default(now())
}

model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  storage   String   // "128GB", "256GB", "512GB", "1TB"
  color     String   // "Titanium Black", "Desert Titanium"
  price     Decimal
  stock     Int
  sku       String   @unique
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  items       OrderItem[]
  status      OrderStatus @default(PENDING)
  totalAmount Decimal
  shippingAddr Json
  paymentMethod String
  createdAt   DateTime    @default(now())
}

model OrderItem {
  id        String         @id @default(cuid())
  orderId   String
  order     Order          @relation(fields: [orderId], references: [id])
  variantId String
  quantity  Int
  unitPrice Decimal
}

model FlashSale {
  id        String   @id @default(cuid())
  variantId String
  discount  Float    // 0.15 = 15%
  stock     Int      // giới hạn số lượng flash sale
  startAt   DateTime
  endAt     DateTime
}

model AIKnowledge {
  id        String  @id @default(cuid())
  productId String
  content   String  // text chunk để embedding
  embedding Float[] // pgvector
}
```

---

## V. CẤU TRÚC DỰ ÁN (PROJECT STRUCTURE)

```
apexstore/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Route group: public pages
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product listing
│   │   │   │   └── [slug]/page.tsx   # Product detail
│   │   │   ├── cart/page.tsx
│   │   │   └── checkout/page.tsx
│   │   ├── (auth)/                   # Route group: auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/               # User dashboard
│   │   ├── admin/                   # Admin panel
│   │   └── api/                     # API Routes
│   │       ├── products/
│   │       ├── orders/
│   │       ├── ai/chat/             # AI streaming endpoint
│   │       └── flash-sale/
│   ├── components/
│   │   ├── ui/                      # Shadcn primitives
│   │   ├── product/                 # ProductCard, ProductGallery, ProductVariantSelector
│   │   ├── cart/                    # CartDrawer, CartItem
│   │   ├── checkout/                # CheckoutStepper, PaymentForm
│   │   ├── ai/                      # AIChatWidget, MessageBubble
│   │   ├── three/                   # ProductViewer3D, Hotspot
│   │   ├── flash-sale/              # FlashSaleTimer, StockBar
│   │   └── layout/                  # Header, Footer, MobileNav
│   ├── lib/
│   │   ├── db.ts                    # Prisma client
│   │   ├── redis.ts                 # Upstash Redis client
│   │   ├── ai/                      # RAG pipeline, embeddings
│   │   └── socket.ts                # Socket.io server setup
│   ├── hooks/                       # Custom React hooks
│   ├── stores/                      # Zustand stores (cart, ui, auth)
│   ├── types/                       # TypeScript types
│   └── utils/                       # Helpers, formatters
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                      # Seed data thực tế
├── public/
│   └── models/                      # 3D model files (.glb)
├── tests/                           # Vitest test files
└── .storybook/                      # Storybook config
```

---

## VI. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

### Phase 1 — Foundation & UI Core (Tuần 1-2)
- [ ] Khởi tạo Next.js 15, TypeScript, Tailwind, Shadcn/ui
- [ ] Setup Prisma + PostgreSQL (Supabase), seed data
- [ ] ESLint, Prettier, Husky, GitHub Actions CI
- [ ] Layout: Header (search, cart, auth), Footer, Mobile Navigation
- [ ] Trang chủ: Hero section, featured products, banner Flash Sale
- [ ] Trang danh sách sản phẩm: Grid/List view, bộ lọc URL-synced
- [ ] Trang chi tiết sản phẩm: Gallery, variant selector, thêm vào giỏ

### Phase 2 — Cart, Auth & Checkout (Tuần 3-4)
- [ ] Zustand cart store + localStorage persistence
- [ ] CartDrawer (slide-in sidebar)
- [ ] Authentication: Supabase email/password + Google OAuth
- [ ] Checkout flow: 3 bước (Info → Shipping → Payment)
- [ ] Tích hợp Stripe + VNPAY Sandbox
- [ ] Email xác nhận đơn hàng (Resend)
- [ ] User Dashboard: lịch sử đơn hàng, wishlist

### Phase 3 — AI & Realtime (Tuần 5-7) — **GIAI ĐOẠN TRỌNG TÂM**
- [ ] AI Chat Widget UI (floating button, slide-up panel)
- [ ] Gemini API integration với streaming SSE
- [ ] RAG pipeline: Embed product data → pgvector → similarity search → context injection
- [ ] Sentiment analysis + auto-voucher feature
- [ ] WebSocket server (Socket.io) cho Flash Sale
- [ ] Flash Sale UI: Countdown timer, stock progress bar, FOMO badges
- [ ] Redis pub/sub cho real-time stock sync

### Phase 4 — 3D, Trade-in & Advanced Features (Tuần 8-9)
- [ ] React Three Fiber setup + load .glb model
- [ ] ProductViewer3D: xoay 360°, hotspots, color switching
- [ ] Smart Trade-in multi-step form
- [ ] Comparison tool (so sánh 2-3 sản phẩm)
- [ ] Advanced search với Fuse.js hoặc Algolia

### Phase 5 — Admin, Polish & Deploy (Tuần 10)
- [ ] Admin Dashboard: product CRUD, order management, analytics charts
- [ ] Performance audit: Lighthouse ≥ 95, bundle analysis
- [ ] Vitest unit tests cho utils, hooks, stores
- [ ] Storybook documentation cho core components
- [ ] Deploy Vercel + thiết lập custom domain

---

## VII. THEO DÕI TIẾN ĐỘ

> Cập nhật lần cuối: **2026-05-06**

### Tổng quan
```
Phase 1 — Foundation & UI Core    ██████████  100% ✅ Hoàn thành  (merged → develop | commit 060a7a4)
Phase 2 — Cart, Auth & Checkout   ████████░░   80% ✅ Core done   (merged → develop | commit d9e5145)
Phase 3 — AI & Realtime           █████████░   90% ✅ Core done   (feature/phase-3-ai-realtime)
Phase 4 — 3D & Advanced Features  ██████████  100% ✅ Hoàn thành   (feature/phase-4-3d-advanced)
Phase 5 — Admin, Polish & Deploy  ░░░░░░░░░░    0% ⬜ Chưa bắt đầu

Tổng tiến độ dự án:  ████████░░  ~80%
```

### Nhánh Git hiện tại
| Nhánh | Trạng thái | Ghi chú |
|---|---|---|
| `main` | ⬜ Chưa tạo | Chờ release cuối |
| `develop` | 🔄 Active | Nhánh tích hợp chính |
| `feature/phase-1-foundation` | ✅ Merged | → develop |
| `feature/phase-2-cart-auth-checkout` | ✅ Merged | → develop |
| `feature/phase-3-ai-realtime` | 🔄 Đang làm | Gemini AI + Flash Sale |
| `feature/phase-4-3d-advanced` | ✅ Merged | 3D viewer + Trade-in + Compare |
| `feature/phase-5-admin-deploy` | ⬜ Chưa bắt đầu | |

### Chi tiết theo Phase

#### Phase 1 — Foundation & UI Core
| Task | Trạng thái | Ghi chú |
|---|---|---|
| Khởi tạo Next.js 16 + TypeScript + Tailwind v4 | ✅ Hoàn thành | Next.js 16.2.4, TS 5, Tailwind 4 |
| Setup Prisma v7 + pg adapter | ✅ Hoàn thành | Schema đầy đủ 7 models |
| ESLint / Prettier | ✅ Hoàn thành | Prettier + tailwindcss plugin |
| Header (sticky, mobile nav, cart badge) | ✅ Hoàn thành | Framer Motion mobile menu |
| Footer với link groups | ✅ Hoàn thành | |
| UI primitives: Button, Badge, Skeleton | ✅ Hoàn thành | CVA variants |
| Trang chủ: Hero, Perks, Categories, Featured | ✅ Hoàn thành | SSR + Suspense skeleton |
| Trang danh sách: Grid + URL-synced filters | ✅ Hoàn thành | category, sort, storage filter |
| Trang chi tiết: Gallery, variant, color swatch | ✅ Hoàn thành | Add to cart với animation |
| Zustand cart store + localStorage | ✅ Hoàn thành | persist middleware |
| TanStack Query provider | ✅ Hoàn thành | |
| Seed data 7 sản phẩm Apple thực tế | ✅ Hoàn thành | |
| 404 page | ✅ Hoàn thành | |
| **Branch:** `feature/phase-1-foundation` → `develop` | ✅ Merged | commit `060a7a4` |

#### Phase 2 — Cart, Auth & Checkout
| Task | Trạng thái | Ghi chú |
|---|---|---|
| CartDrawer slide-in (Framer Motion) | ✅ Hoàn thành | Quantity controls, empty state |
| Cart page đầy đủ | ✅ Hoàn thành | Order summary, clear all |
| Checkout 3-step (Info → Shipping → Payment) | ✅ Hoàn thành | Zod validation, animated transitions |
| Login page (Email + Google OAuth) | ✅ Hoàn thành | Supabase SSR |
| Register page (Email + confirmation) | ✅ Hoàn thành | |
| Auth store (Zustand) | ✅ Hoàn thành | |
| Stripe + VNPAY Sandbox | ⬜ Chưa làm | Cần API keys thực |
| Email xác nhận (Resend) | ⬜ Chưa làm | Cần setup Resend |
| User Dashboard | ⬜ Chưa làm | Phase 5 |
| **Branch:** `feature/phase-2-cart-auth-checkout` → `develop` | ✅ Merged | commit `d9e5145` |

#### Phase 3 — AI & Realtime
| Task | Trạng thái | Ghi chú |
|---|---|---|
| AI Chat Widget UI (floating button, panel) | ✅ Hoàn thành | Framer Motion, suggestions, clear chat |
| Gemini API + Streaming SSE | ✅ Hoàn thành | `gemini-2.0-flash`, stream từng token |
| RAG pipeline (query DB → inject context) | ✅ Hoàn thành | Lấy toàn bộ products làm context |
| Sentiment analysis + auto-voucher | ✅ Hoàn thành | Detect từ khoá tiêu cực → offer voucher |
| Flash Sale API + countdown timer | ✅ Hoàn thành | Hook `useCountdown` realtime |
| Flash Sale UI: progress bar, FOMO badges | ✅ Hoàn thành | Stock bar, -X% badge |
| Flash Sale page riêng `/flash-sale` | ✅ Hoàn thành | |
| WebSocket Socket.io | ⬜ Chưa làm | Cần server riêng (Phase 5) |
| Redis pub/sub stock sync | ⬜ Chưa làm | Cần Upstash (Phase 5) |
| **Branch:** `feature/phase-3-ai-realtime` → `develop` | 🔄 Đang merge | |

#### Phase 4 — 3D & Advanced Features
| Task | Trạng thái | Ghi chú |
|---|---|---|
| React Three Fiber + Drei + Three.js setup | ✅ Hoàn thành | |
| ProductViewer3D: xoay 360°, auto-rotate | ✅ Hoàn thành | Model geometry iPhone built-in |
| Hotspots tương tác (camera, Dynamic Island, USB-C) | ✅ Hoàn thành | hover tooltip |
| Color switcher realtime trên model 3D | ✅ Hoàn thành | 4 màu Titanium |
| Smart Trade-in 4-step form | ✅ Hoàn thành | 9 thiết bị, 4 tình trạng, tính chênh lệch |
| Comparison tool `/compare` | ✅ Hoàn thành | So sánh 2-3 sản phẩm, bảng thông số |
| CompareBar sticky bottom | ✅ Hoàn thành | Framer Motion, tối đa 3 sản phẩm |
| Nút so sánh trên ProductCard | ✅ Hoàn thành | Toggle add/remove |
| 3D Viewer tích hợp vào product detail | ✅ Hoàn thành | Chỉ hiện cho iPhone |
| **Branch:** `feature/phase-4-3d-advanced` → `develop` | ✅ Merged | |

#### Phase 5 — Admin, Polish & Deploy
| Task | Trạng thái | Ghi chú |
|---|---|---|
| Admin Dashboard | ⬜ Chưa làm | |
| Lighthouse audit ≥ 95 | ⬜ Chưa làm | |
| Vitest unit tests | ⬜ Chưa làm | |
| Storybook documentation | ⬜ Chưa làm | |
| Deploy Vercel | ⬜ Chưa làm | |

### Ký hiệu trạng thái
| Ký hiệu | Ý nghĩa |
|---|---|
| ⬜ | Chưa bắt đầu |
| 🔄 | Đang làm |
| ✅ | Hoàn thành |
| ⏸️ | Tạm dừng |
| ❌ | Hủy / Thay đổi hướng |

---

## VIII. ĐIỂM NỔI BẬT KHI TRÌNH BÀY VỚI NHÀ TUYỂN DỤNG

> Đây là những điểm bạn cần **chủ động nhấn mạnh** khi giới thiệu dự án:

1. **"Tôi implement RAG thực sự"** — Không phải chatbot fake, mà là pipeline embedding → vector search → context injection → Gemini response. Giải thích được từng bước.

2. **"Tôi hiểu tradeoff giữa SSR, SSG và ISR"** — Trang sản phẩm dùng ISR (revalidate 60s) để cân bằng giữa SEO và performance. Trang flash sale dùng streaming SSR vì dữ liệu thay đổi liên tục.

3. **"Tôi xử lý Optimistic UI"** — Thêm vào giỏ → UI cập nhật ngay lập tức, rollback nếu API lỗi. Giải thích được cơ chế của TanStack Query.

4. **"Tôi quan tâm đến Accessibility"** — Shadcn/ui đảm bảo ARIA labels, keyboard navigation cho toàn bộ UI.

5. **"Tôi có Production mindset"** — GitHub Actions CI, Error Boundaries, Skeleton Loading, Rate limiting cho AI API.

---

## IX. TÍNH NĂNG BỔ SUNG (NICE-TO-HAVE)

Nếu còn thời gian, các tính năng này sẽ nâng dự án lên một tầm cao hơn:

- **PWA (Progressive Web App):** Cài được lên homescreen, hoạt động offline với cached products
- **Dark Mode:** Tự động theo system preference, toggle manual
- **i18n (Đa ngôn ngữ):** Tiếng Việt / Tiếng Anh với next-intl
- **Product Review System:** Rating 1-5 sao, kèm text review, upvote helpful
- **Loyalty Points System:** Tích điểm mỗi đơn hàng, đổi điểm lấy voucher
- **AR Try-on (Advanced):** Thử đặt MacBook lên bàn bằng camera (WebXR API)
