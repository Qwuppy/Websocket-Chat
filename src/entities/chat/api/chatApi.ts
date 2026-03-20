import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/shared/lib/server/supabaseClient';
import { Chat } from '../model/types';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({

        // Загрузить все диалоги текущего пользователя
        fetchChats: builder.query<Chat[], void>({
            providesTags: ['Chat'],
            async queryFn() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user?.email) throw new Error('Not authenticated');

                    const email = user.email;

                    // Берём все чаты где участвует текущий пользователь
                    const { data: chats, error } = await supabase
                        .from('chats')
                        .select('*')
                        .or(`user1_email.eq.${email},user2_email.eq.${email}`)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    // Для каждого чата достаём последнее сообщение
                    const chatsWithLastMessage = await Promise.all(
                        chats.map(async (chat) => {
                            const { data: messages } = await supabase
                                .from('messages')
                                .select('content, created_at')
                                .eq('chat_id', chat.id)
                                .order('created_at', { ascending: false })
                                .limit(1);

                            return {
                                ...chat,
                                lastMessage: messages?.[0] ?? null,
                            };
                        })
                    );

                    return { data: chatsWithLastMessage as Chat[] };
                } catch (err: any) {
                    return { error: { status: 'CUSTOM_ERROR', data: err.message } };
                }
            },
        }),

        // Найти существующий чат или создать новый по email
        findOrCreateChat: builder.mutation<Chat, { partnerEmail: string }>({
            invalidatesTags: ['Chat'],
            async queryFn({ partnerEmail }) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user?.email) throw new Error('Not authenticated');

                    const myEmail = user.email;

                    // Ищем существующий чат (порядок emails может быть любым)
                    const { data: existing } = await supabase
                        .from('chats')
                        .select('*')
                        .or(
                        `and(user1_email.eq.${myEmail},user2_email.eq.${partnerEmail}),` +
                        `and(user1_email.eq.${partnerEmail},user2_email.eq.${myEmail})`
                        )
                        .limit(1)
                        .maybeSingle();

                    if (existing) return { data: existing as Chat };

                    // Создаём новый чат
                    const { data: created, error } = await supabase
                        .from('chats')
                        .insert({ user1_email: myEmail, user2_email: partnerEmail })
                        .select()
                        .single();

                    if (error) throw error;

                    return { data: { ...created, lastMessage: null } as Chat };
                } catch (err: any) {
                    return { error: { status: 'CUSTOM_ERROR', data: err.message } };
                }
            },
        }),

    }),
});

export const { useFetchChatsQuery, useFindOrCreateChatMutation } = chatApi;