import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/shared/lib/server/supabaseClient';
import { Message } from '../model/types';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        // Больше не используется — загрузка идёт через useRealtimeMessages
        // Оставляем на случай если понадобится загрузить историю без подписки
        // fetchChat: builder.query<Message[], { chatId: string }>({
        //     async queryFn({ chatId }) {
        //         try {
        //             const { data, error } = await supabase
        //                 .from('messages')
        //                 .select('*')
        //                 .eq('chat_id', chatId)
        //                 .order('created_at', { ascending: true });

        //             if (error) throw error;
        //             return { data: data as Message[] };
        //         } catch (err: any) {
        //             return { error: { status: 'CUSTOM_ERROR', data: err.message } };
        //         }
        //     },
        // }),
        sendMessage: builder.mutation<Message, { content: string; receiverEmail: string; chatId: string }>({
            async queryFn({ content, receiverEmail, chatId }, { dispatch }) {
                try {
                    const userResponse = await supabase.auth.getUser();
                    const sender_email = userResponse.data?.user?.email;

                    if (!sender_email) throw new Error('User not authenticated');

                    const { data, error } = await supabase
                        .from('messages')
                        .insert({ content, sender_email, receiver_email: receiverEmail, chat_id: chatId })
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

export const { useSendMessageMutation } = messagesApi;