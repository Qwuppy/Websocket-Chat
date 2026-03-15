// src/entities/messages/api/messagesApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/shared/lib/server/supabaseClient';
import { Message } from '../model/types';

const MOCK_TARGET_EMAIL = 'qwupgame1@gmail.com';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fakeBaseQuery(), // не нужно указывать generic
    endpoints: (builder) => ({
        // Загрузка истории конкретного диалога
        fetchChat: builder.query<Message[], { targetEmail?: string }>({
            async queryFn({ targetEmail }) {
                try {
                    const userResponse = await supabase.auth.getUser();
                    const currentUserEmail = userResponse.data?.user?.email;
                    if (!currentUserEmail) throw new Error("User not authenticated");

                    const target = targetEmail ?? MOCK_TARGET_EMAIL;

                    const { data, error } = await supabase
                        .from('messages')
                        .select('*')
                        .or(
                            `and(sender_email.eq.${currentUserEmail},receiver_email.eq.${target}),` +
                            `and(sender_email.eq.${target},receiver_email.eq.${currentUserEmail})`
                        )
                        .order("created_at", { ascending: true });

                    if (error) throw error;
                    return { data: data as Message[] };
                } catch (err: any) {
                    return { error: { status: 'CUSTOM_ERROR', data: err.message } };
                }
            },
        }),
        // Отправка нового сообщения
        sendMessage: builder.mutation<Message, { content: string; receiverEmail?: string }>({
            async queryFn({ content, receiverEmail }) {
                try {
                    const userResponse = await supabase.auth.getUser();
                    const sender_email = userResponse.data?.user?.email;

                    if (!sender_email) throw new Error("User not authenticated");

                    const receiver_email = receiverEmail ?? MOCK_TARGET_EMAIL;

                    const { data, error } = await supabase
                        .from('messages')
                        .insert({ content, sender_email, receiver_email})
                        .select()
                        .single();

                    if (error) throw error;

                    return { data: data as Message };
                } catch (err: any) {
                    return { error: { status: 'CUSTOM_ERROR', data: err.message } };
                }
            },
        }),
    }),
});

// ✅ Ключевой момент: имена хуков точно совпадают с endpoint-ами
export const { useFetchChatQuery, useSendMessageMutation } = messagesApi;
