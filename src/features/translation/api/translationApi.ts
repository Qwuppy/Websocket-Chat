import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


interface TranslateRequest {
    text: string;
    targetLang: string;
}

interface TranslateResponse {
    translatedText: string;
}

export const translationApi = createApi({
    reducerPath: 'translationApi',
    tagTypes: [],
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        translateMessage: builder.mutation<TranslateResponse, TranslateRequest>({
            query: (body) => ({
                url: '/translate',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useTranslateMessageMutation } = translationApi;
