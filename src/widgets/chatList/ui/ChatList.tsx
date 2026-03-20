import { RootState } from "@/app/providers/store";
import { chatApi, useFetchChatsQuery } from "@/entities/chat/api/chatApi";
import { setActiveChat } from "@/entities/chat/model/chatSlice";
import { Chat } from "@/entities/chat/model/types"; 
import { Avatar, Box, CircularProgress, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { ChatSearch } from "./ChatSearchComponent";
import { supabase } from "@/shared/lib/server/supabaseClient";


export const ChatList = () => { 
    const dispatch = useDispatch();
    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);
    const activeChatId = useSelector((state: RootState) => state.chat.activeChatId);

    const { data: chats, isLoading } = useFetchChatsQuery();

    useEffect(() => {
        if (!currentUserEmail) return;

        const channel = supabase
            .channel('chats-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chats' },
                (payload) => {
                    const { user1_email, user2_email } = payload.new;
                    // Обновляем только если новый чат касается текущего пользователя
                    if (user1_email === currentUserEmail || user2_email === currentUserEmail) {
                        dispatch(chatApi.util.invalidateTags(['Chat']));
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); }; 
    }, [currentUserEmail, dispatch])

    const getPartnerEmail = (chat: Chat) => 
        chat.user1_email === currentUserEmail ? chat.user2_email : chat.user1_email

    const handleSelectChat = (chat: Chat) => {
        dispatch(setActiveChat({
            chatId: chat.id,
            partnerEmail: getPartnerEmail(chat),
        }));
    };

    return (
        <Box sx={{
            width: 300,
            height: '100vh',
            bgcolor: '#2A2828',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #3a3a3a',
        }}>
            {/* Хедер */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" color="white">Чаты</Typography>
            </Box>

            <ChatSearch onSuccess={() => {}} />

            <Divider sx={{ bgcolor: '#3a3a3a' }} />

            {/* Список чатов */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    </Box>
                )}

                {!isLoading && chats?.length === 0 && (
                    <Typography color="grey.500" variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                        Нет диалогов. Начните первый!
                    </Typography>
                )}

                <List disablePadding>
                    {chats?.map((chat) => {
                    const partnerEmail = getPartnerEmail(chat);
                    const isActive = chat.id === activeChatId;

                    return (
                        <ListItemButton
                            key={chat.id}
                            selected={isActive}
                            onClick={() => handleSelectChat(chat)}
                            sx={{
                                '&.Mui-selected': { bgcolor: '#3a3a3a' },
                                '&:hover': { bgcolor: '#333' },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                    {partnerEmail[0].toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography color="white" noWrap variant="body2">
                                        {partnerEmail}
                                    </Typography>
                                }
                                secondary={
                                    <Typography color="grey.500" noWrap variant="caption">
                                        {chat.lastMessage?.content ?? 'Нет сообщений'}
                                    </Typography>
                                }
                            />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
    
}
