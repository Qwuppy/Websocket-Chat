import { RootState } from "@/app/providers/store";
import { chatApi, useFetchChatsQuery } from "@/entities/chat/api/chatApi";
import { setActiveChat } from "@/entities/chat/model/chatSlice";
import { Chat } from "@/entities/chat/model/types"; 
import { Avatar, Box, CircularProgress, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { ChatSearch } from "./ChatSearchComponent";
import { supabase } from "@/shared/lib/server/supabaseClient";
import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";


export const ChatList = () => { 
    const dispatch = useDispatch();
    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);
    const activeChatId = useSelector((state: RootState) => state.chat.activeChatId);

    const { data: chats, isLoading } = useFetchChatsQuery();

    const { t } = useTranslation();

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
            width: adp(400),
            height: '100vh',
            bgcolor: '#262424',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(73, 73, 73, 1)',
        }}>
            {/* Хедер */}
            <Box
                sx={{
                    py: adp(10),
                    px: adp(20),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ color: '#d4d4d4ff' }}
                >
                    {t('chat.title')}
                </Typography>

                <LanguageSwitcher />
            </Box>
            <ChatSearch onSuccess={() => {}} />

            <Divider sx={{ bgcolor: 'rgba(73, 73, 73, 1)' }} />

            {/* Список чатов */}
            <Box 
            sx={{ 
                flex: 1, 
                overflowY: 'auto',
            }}
            >
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: adp(4) }}>
                        <CircularProgress />
                    </Box>
                )}

                {!isLoading && chats?.length === 0 && (
                    <Typography color="grey.500" variant="body2" sx={{ textAlign: 'center', mt: adp(4) }}>
                        {t('chat.noChats')}
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
                                '&.Mui-selected': { bgcolor: '#2e2b2bff' },
                                '&:hover': { bgcolor: '#352f2fff' },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                    {partnerEmail[0].toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography color="#d4d4d4ff" noWrap variant="body2">
                                        {partnerEmail}
                                    </Typography>
                                }
                                secondary={
                                    <Typography color="#a8a8a8bd" noWrap variant="caption">
                                        {chat.lastMessage?.content ?? t('chat.noMessages')}
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
