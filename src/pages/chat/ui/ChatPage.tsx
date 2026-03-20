'use client'

import { AuthProvider } from "@/app/providers/AuthProvider"
import { ChatList } from "@/widgets/chatList"
import { ChatWindow } from "@/widgets/chatWindow"
import { Stack, Typography } from "@mui/material"
import { RootState } from '@/app/providers/store'
import { useAppSelector } from "@/shared/lib/hooks/redux"

export const ChatPage = () => {
  const activeChatId = useAppSelector((state: RootState) => state.chat.activeChatId)
  const activePartnerEmail = useAppSelector((state: RootState) => state.chat.activePartnerEmail)
  const pendingPartnerEmail = useAppSelector((state: RootState) => state.chat.pendingPartnerEmail);

  return (
    <AuthProvider>
      <Stack
        direction='row'
        width='100vw'
        height='100vh'
        m='0'
        p='0'
        bgcolor='#1F1D1D'
      >
        <ChatList />
        {(activeChatId && activePartnerEmail) || pendingPartnerEmail ? (
          <ChatWindow
            targetEmail={activePartnerEmail ?? pendingPartnerEmail ?? ''}
            chatId={activeChatId ?? ''}
          />
        ) : (
          <Stack flex={1} alignItems='center' justifyContent='center'>
            <Typography color='grey.600'>Выберите диалог</Typography>
          </Stack>
        )}
      </Stack>
    </AuthProvider>
  )
}