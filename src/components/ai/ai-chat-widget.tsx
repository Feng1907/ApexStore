'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react'
import { useAiChat } from '@/hooks/use-ai-chat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'iPhone nào pin trâu nhất?',
  'Tôi có 30 triệu, nên mua gì?',
  'So sánh MacBook Air và MacBook Pro',
  'AirPods Pro 2 có tốt không?',
]

export function AiChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, streaming, sendMessage, clearMessages } = useAiChat()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  function handleSend() {
    if (!input.trim() || streaming) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform hover:scale-110',
          open && 'hidden'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Mở AI trợ lý"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold">AI</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-6 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-2xl"
              style={{ height: '520px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-semibold">ApexStore AI</p>
                    <p className="text-[10px] text-blue-100">Tư vấn mua sắm thông minh</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {messages.length > 0 && (
                    <button onClick={clearMessages} className="rounded-lg p-1.5 hover:bg-white/20" title="Xóa chat">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/20">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-700">Xin chào! Tôi có thể giúp gì?</p>
                      <p className="mt-1 text-xs text-zinc-400">Hỏi tôi về sản phẩm, giá cả hoặc tư vấn mua hàng</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => { sendMessage(s) }}
                          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-zinc-100 text-zinc-800 rounded-bl-sm'
                          )}
                        >
                          {msg.content || (
                            <span className="flex gap-1">
                              <span className="animate-bounce">●</span>
                              <span className="animate-bounce [animation-delay:0.1s]">●</span>
                              <span className="animate-bounce [animation-delay:0.2s]">●</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-zinc-100 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập câu hỏi..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                    disabled={streaming}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || streaming}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition-opacity disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-zinc-400">Powered by Google Gemini</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
