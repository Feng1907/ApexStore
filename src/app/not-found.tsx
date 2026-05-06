import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-zinc-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">Trang không tồn tại</h1>
      <p className="mt-2 text-zinc-500">Trang bạn tìm kiếm đã bị xoá hoặc chưa được tạo.</p>
      <Button className="mt-6" asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  )
}
