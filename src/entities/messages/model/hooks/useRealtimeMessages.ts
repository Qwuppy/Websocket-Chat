import { useEffect, useState } from "react";
import { Message } from "../types";
import { supabase } from "@/shared/lib/server/supabaseClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/providers/store";

// Моковый email собеседника (если targetEmail не передан)
const MOCK_TARGET_EMAIL = 'qwupgame1@gmail.com';


export const useRealtimeMessages = (targetEmail?: string) => {
    const [messages, setMessages] = useState<Message[]>([]);

    // Берём текущего пользователя из Redux (AuthProvider уже гарантирует его наличие)
    const currentUserEmail = useSelector((state: RootState) => state.auth.userName);

    useEffect(() => {

        if (!currentUserEmail) return 

        let isMounted = true; // флаг для предотвращения обновления состояния после размонтирования

        const target = targetEmail ?? MOCK_TARGET_EMAIL;

        // 1. Первичная загрузка истории диалога
        const fetchInitialMessages = async () => {

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                // Выбираем сообщения в обоих направлениях между двумя участниками
                .or(
                    `and(sender_email.eq.${currentUserEmail},receiver_email.eq.${target}),` +
                    `and(sender_email.eq.${target},receiver_email.eq.${currentUserEmail})`
                )
                .order('created_at', { ascending: true });
        
            if (!isMounted) return; // проверяем флаг перед обновлением состояния

            if (error) {
                console.error("Error fetching messages:", error);
                return;
            }

            setMessages(data as Message[]);
        }
        fetchInitialMessages();

        // 2. Realtime WebSocket подписка
        // Имя канала формируем из отсортированных email — так оба участника
        // попадают в один и тот же канал независимо от того, кто инициировал чат
        const channelName = `chat:${[currentUserEmail, target].sort().join(":")}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', table: 
                    'messages' 
                    // RLS гарантирует, что сервер отдаст только разрешённые строки.
                    // Клиентский фильтр — дополнительная защита: показываем только
                    // сообщения именно этого диалога (на случай нескольких открытых чатов)
                }, 
                (payload) => {
                    if (!isMounted) return; // проверяем флаг перед обновлением состояния

                    const newMessage = payload.new as Message;
                    // Проверяем, что новое сообщение относится к текущему диалогу

                    const ifPartOfThisChat =
                        (
                            newMessage.sender_email === currentUserEmail 
                            && newMessage.receiver_email === target
                        ) 
                        ||
                        (
                            newMessage.sender_email === target 
                            && newMessage.receiver_email === currentUserEmail
                        );

                    if (!ifPartOfThisChat) return;

                    setMessages((prev) => {
                        const alreayyExists = prev.some(msg => msg.id === newMessage.id);
                        return alreayyExists ? prev : [...prev, newMessage];
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Subscribed to channel: ${channelName}`);
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error(`Error subscribing to channel: ${channelName}`);
                }
            });

            return () => {
                isMounted = false; // устанавливаем флаг при размонтировании
                supabase.removeChannel(channel);
                console.log(`Unsubscribed from channel: ${channelName}`);
            }

    }, [currentUserEmail, targetEmail]);

    return messages;
};
