'use client'

import { AuthProvider } from "@/app/providers/AuthProvider"
import { ChatList } from "@/widgets/chatList"
import { ChatWindow } from "@/widgets/chatWindow"

export const ChatPage = () => {

  return (
    <AuthProvider>
      <div>
        <ChatList />
        <ChatWindow />
      </div>
    </AuthProvider>
  )
}