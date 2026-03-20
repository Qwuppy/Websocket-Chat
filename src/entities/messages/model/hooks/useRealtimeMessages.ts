import { useEffect, useState } from "react";
import { Message } from "../types";
import { supabase } from "@/shared/lib/server/supabaseClient";

export const useRealtimeMessages = (chatId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!chatId) return;

        let isMounted = true;

        // 1. Первичная загрузка истории — фильтруем по chat_id
        const fetchInitialMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });

            if (!isMounted) return;
            if (error) { console.error("Error fetching messages:", error); return; }

            setMessages(data as Message[]);
        };
        fetchInitialMessages();

        // 2. Realtime подписка — фильтруем по chat_id прямо на уровне Supabase
        const channel = supabase
            .channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`, // фильтр на сервере — не нужно проверять вручную
                },
                (payload) => {
                    if (!isMounted) return;

                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        const alreadyExists = prev.some(msg => msg.id === newMessage.id);
                        return alreadyExists ? prev : [...prev, newMessage];
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') console.log(`Subscribed to chat: ${chatId}`);
                if (status === 'CHANNEL_ERROR') console.error(`Channel error: ${chatId}`);
            });

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };

    }, [chatId]);

    return messages;
};