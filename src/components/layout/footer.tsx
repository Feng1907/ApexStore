import Link from 'next/link'

const footerLinks = {
  'Sản phẩm': [
    { label: 'iPhone', href: '/products?category=IPHONE' },
    { label: 'iPad', href: '/products?category=IPAD' },
    { label: 'MacBook', href: '/products?category=MACBOOK' },
    { label: 'AirPods', href: '/products?category=AIRPODS' },
  ],
  'Dịch vụ': [
    { label: 'Thu cũ đổi mới', href: '/trade-in' },
    { label: 'Bảo hành', href: '/warranty' },
    { label: 'Flash Sale', href: '/flash-sale' },
  ],
  'Hỗ trợ': [
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Chính sách đổi trả', href: '/return-policy' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              Apex<span className="text-blue-600">Store</span>
            </span>
            <p className="mt-2 text-sm text-zinc-500">
              Thiết bị Apple chính hãng. Trải nghiệm đỉnh cao.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} ApexStore. Dự án portfolio by DuongAnPhong.
        </div>
      </div>
    </footer>
  )
}
