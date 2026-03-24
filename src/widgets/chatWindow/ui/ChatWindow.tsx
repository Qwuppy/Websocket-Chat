"use client";
import { useState, useEffect, useRef } from "react";
import { 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    IconButton, 
    CircularProgress
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRealtimeMessages } from "@/entities/messages/model/hooks/useRealtimeMessages";
import { useSendMessageMutation } from "@/entities/messages/api/messagesApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/providers/store";
import { Message } from "@/entities/messages/model/types";
import { chatApi, useFindOrCreateChatMutation } from "@/entities/chat/api/chatApi";
import { setActiveChat } from "@/entities/chat/model/chatSlice";
import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import { useTranslation } from "react-i18next";
import { useTranslate, TranslateButton } from "@/features/translation";

interface ChatWindowProps {
    targetEmail?: string; // email собеседника (можно заменить на динамический, если нужно)
    chatId: string;
}

export const ChatWindow = ({ targetEmail, chatId }: ChatWindowProps) => {

    const dispatch = useDispatch();

    const [inputText, setInputText] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);
    const pendingPartnerEmail = useSelector((state: RootState) => state.chat.pendingPartnerEmail);
    const [findOrCreateChat] = useFindOrCreateChatMutation();

    const messages = useRealtimeMessages(chatId);

    const [sendMessage, {isLoading: isSending}] = useSendMessageMutation();

    const { t } = useTranslation();

    const { translations, translate, loadingId } = useTranslate();

    const handleSendMessage = async () => {
        const trimmed = inputText.trim();

        console.log("[ChatWindow] handleSendMessage:", { 
            trimmed, 
            currentUserEmail, 
            isSending 
        });

        if (!trimmed || !currentUserEmail || isSending) return; 

        let resolvedChatId = chatId;
        let resolvedPartnerEmail = targetEmail;

          // Если чат ещё не создан — создаём при первой отправке
        if (!resolvedChatId && pendingPartnerEmail) {
            const result = await findOrCreateChat({ partnerEmail: pendingPartnerEmail });
            if ('error' in result) return;

            resolvedChatId = result.data.id;
            resolvedPartnerEmail = pendingPartnerEmail;

            dispatch(setActiveChat({
                chatId: resolvedChatId,
                partnerEmail: resolvedPartnerEmail,
            }));
        }

        if (!resolvedChatId || !resolvedPartnerEmail) return;

        await sendMessage({
            content: trimmed,
            receiverEmail: resolvedPartnerEmail,
            chatId: resolvedChatId,
        });
        
        dispatch(chatApi.util.invalidateTags(['Chat'])); 
        setInputText('');
    }

    // Отправка по Enter (без Shift)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Автопрокрутка при новых сообщениях
    useEffect(() => {
        containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: adp(4),
                backgroundColor: "#262424",
            }}
        >
            {/* Список сообщений */}
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: adp(20),
                    display: "flex",
                    flexDirection: "column",
                    gap: adp(5),
                }}
            >
                {messages.map((msg: Message) => {
                    const isOwnMessage = currentUserEmail === msg.sender_email;

                    return (
                        <Box
                            key={msg.id}
                            sx={{
                                display: "flex",
                                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                            }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    p: adp(10),
                                    maxWidth: "70%",
                                    backgroundColor: isOwnMessage
                                        ? "#1976d2"
                                        : "rgba(48, 182, 206, 1)",
                                    color: isOwnMessage ? "#fff" : "#000",
                                    borderRadius: adp(8),
                                    wordBreak: "break-word",
                                }}
                            >
                                <Typography variant="body1">
                                    {msg.content}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-end",
                                        mt: adp(3),
                                    }}
                                >
                                    <TranslateButton
                                        messageId={msg.id}
                                        content={msg.content}
                                        isOwn={isOwnMessage}
                                        translation={translations[msg.id]}
                                        isLoading={loadingId === msg.id}
                                        onTranslate={translate}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            textAlign: "right",
                                            opacity: 0.75,
                                        }}
                                    >
                                        {new Date(msg.created_at).toLocaleTimeString(
                                            [],
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>

            {/* Поле ввода */}
            <Box
                sx={{
                    display: "flex",
                    p: 1,
                    gap: 1,
                    borderTop: "1px solid rgba(73, 73, 73, 1)",
                    alignItems: "center",
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder={t('chat.typeMessage')}
                    fullWidth
                    size="small"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#d4d4d4ff',
                            '& fieldset': {
                                borderColor: '#414040ff',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(53, 77, 97, 1)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'rgba(32, 88, 145, 1)',
                            },
                            backgroundColor: '#262424',
                            '&.Mui-focused': {
                                backgroundColor: '#262424',
                            },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 100px #262424 inset',
                                WebkitTextFillColor: '#d4d4d4ff',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#bdbdbda9',
                            '&.Mui-focused': {
                                color: '#d4d4d4ff',
                            },
                        },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={isSending || !inputText.trim()}
                >
                    {isSending ? (
                        <CircularProgress size={20} />
                    ) : (
                        <SendIcon sx={{ color: '#d4d4d485' }} />
                    )}
                </IconButton>
            </Box>
        </Box>
    );
};
