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

interface ChatWindowProps {
    targetEmail?: string; // email собеседника (можно заменить на динамический, если нужно)
    chatId: string;
}

export const ChatWindow = ({ targetEmail, chatId }: ChatWindowProps) => {

    const dispatch = useDispatch();

    const [inputText, setInputText] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    const resolvedTargetEmail = targetEmail ?? '';

    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);
    const pendingPartnerEmail = useSelector((state: RootState) => state.chat.pendingPartnerEmail);
    const [findOrCreateChat] = useFindOrCreateChatMutation();

    const messages = useRealtimeMessages(chatId);

    const [sendMessage, {isLoading: isSending}] = useSendMessageMutation();

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
                maxWidth: 600,
                margin: "0 auto",
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
            }}
        >
            {/* Список сообщений  */}
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {messages.map((msg: Message) => {
                    // Определяем позицию пузыря: своё — справа, чужое — слева
                    const isOwnMessage = currentUserEmail === msg.sender_email;

                    return (
                        <Box
                            key={msg.id}
                            sx={{
                                display: "flex",
                                justifyContent: isOwnMessage
                                    ? "flex-end"
                                    : "flex-start",
                            }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 1.5,
                                    maxWidth: "70%",
                                    backgroundColor: isOwnMessage
                                        ? "#1976d2"
                                        : "#fff",
                                    color: isOwnMessage ? "#fff" : "#000",
                                    borderRadius: 2,
                                    wordBreak: "break-word",
                                }}
                            >
                                <Typography variant="body1">
                                    {msg.content}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        textAlign: "right",
                                        mt: 0.5,
                                        opacity: 0.75,
                                    }}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" }
                                    )}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>

            {/* Поле ввода  */}
            <Box
                sx={{
                    display: "flex",
                    p: 1,
                    gap: 1,
                    borderTop: "1px solid #ccc",
                    alignItems: "center",
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Введите сообщение..."
                    fullWidth
                    size="small"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={isSending || !inputText.trim()}
                >
                    {isSending ? (
                        <CircularProgress size={20} />
                    ) : (
                        <SendIcon />
                    )}
                </IconButton>
            </Box>
        </Box>
    );
};
