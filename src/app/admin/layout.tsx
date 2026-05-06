import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Zap, BarChart2, ChevronRight } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { href: '/admin/flash-sales', label: 'Flash Sale', icon: Zap },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-zinc-100 bg-zinc-50 lg:block">
        <div className="sticky top-16 p-4">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-900"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-zinc-200 pt-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Về trang chủ
            </Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
