'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ChatPage = dynamic(
  () => import('@/pages/chat/ui/ChatPage').then(m => ({ default: m.ChatPage })),
  { ssr: false, loading: () => null }
)

export default function ChatPageClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ChatPage />
}