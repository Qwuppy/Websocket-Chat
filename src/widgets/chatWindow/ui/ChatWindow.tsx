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
import { useSelector } from "react-redux";
import { RootState } from "@/app/providers/store";
import { Message } from "@/entities/messages/model/types";

const MOCK_TARGET_EMAIL = 'qwupgame1@gmail.com'; // email собеседника (можно заменить на динамический, если нужно)

interface ChatWindowProps {
    targetEmail?: string; // email собеседника (можно заменить на динамический, если нужно)
}

export const ChatWindow = ({ targetEmail }: ChatWindowProps) => {
    const [inputText, setInputText] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    const resolvedTargetEmail = targetEmail ?? MOCK_TARGET_EMAIL;

    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);

    const messages = useRealtimeMessages(resolvedTargetEmail);

    const [sendMessage, {isLoading: isSending}] = useSendMessageMutation();


    const handleSendMessage = async () => {
        const trimmed = inputText.trim();

        console.log("[ChatWindow] handleSendMessage:", { 
            trimmed, 
            currentUserEmail, 
            isSending 
        });

        if (!trimmed || !currentUserEmail || isSending) return; 

        await sendMessage({ 
            content: trimmed, 
            receiverEmail: resolvedTargetEmail 
        });

        setInputText("");
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
