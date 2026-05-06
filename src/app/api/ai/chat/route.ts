import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function POST(req: NextRequest) {
  const { messages, userMessage } = await req.json()

  if (!userMessage?.trim()) {
    return new Response('Missing message', { status: 400 })
  }

  // RAG: tìm sản phẩm liên quan từ DB
  const products = await db.product.findMany({
    include: { variants: true },
    take: 20,
  })

  const productContext = products
    .map((p) => {
      const prices = p.variants.map((v) => Number(v.price))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const storages = [...new Set(p.variants.map((v) => v.storage))].join(', ')
      const colors = [...new Set(p.variants.map((v) => v.color))].join(', ')
      const totalStock = p.variants.reduce((s, v) => s + v.stock, 0)
      return `- ${p.name} (${p.category}): giá ${minPrice.toLocaleString('vi-VN')}đ${minPrice !== maxPrice ? ` – ${maxPrice.toLocaleString('vi-VN')}đ` : ''}, bộ nhớ: ${storages}, màu: ${colors}, tồn kho: ${totalStock > 0 ? `còn ${totalStock} sản phẩm` : 'hết hàng'}, slug: ${p.slug}`
    })
    .join('\n')

  // Sentiment analysis đơn giản
  const negativeKeywords = ['tệ', 'tồi', 'chán', 'thất vọng', 'không hài lòng', 'đắt quá', 'kém']
  const isNegative = negativeKeywords.some((k) => userMessage.toLowerCase().includes(k))

  const systemPrompt = `Bạn là trợ lý mua sắm thông minh của ApexStore — cửa hàng bán thiết bị Apple chính hãng tại Việt Nam.

DANH SÁCH SẢN PHẨM HIỆN CÓ (dữ liệu thực tế):
${productContext}

QUY TẮC TRẢ LỜI:
- Luôn trả lời bằng tiếng Việt, thân thiện và ngắn gọn
- Khi gợi ý sản phẩm, LUÔN kèm giá và tình trạng tồn kho
- Nếu hỏi so sánh, liệt kê điểm khác biệt rõ ràng
- Khi đề cập sản phẩm, format: **Tên sản phẩm** (giá) — mô tả ngắn
- Chỉ tư vấn sản phẩm có trong danh sách trên
${isNegative ? '- Khách hàng có vẻ không hài lòng. Hãy xin lỗi và đề xuất: "Chúng tôi có thể tặng bạn voucher giảm 500.000đ cho đơn hàng tiếp theo!"' : ''}`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const chat = model.startChat({
    systemInstruction: systemPrompt,
    history: (messages ?? []).slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  })

  const result = await chat.sendMessageStream(userMessage)

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
