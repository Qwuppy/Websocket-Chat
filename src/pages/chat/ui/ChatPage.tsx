'use client'

import { ChatList } from "@/widgets/chatList"
import { ChatWindow } from "@/widgets/chatWindow"

export const ChatPage = () => {
  return (
    <div>
      <ChatList />
      <ChatWindow />
    </div>
  )
}