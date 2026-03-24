import { useState } from "react"
import { useTranslateMessageMutation } from "../api/translationApi";


export const useTranslate = () => {

    const [translations, setTranslations] = useState<Record<number, string>>({});
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [translateMessage] = useTranslateMessageMutation();

    const translate = async (id: number, text: string, targetLang: string) => {
        if (translations[id]) {
            setTranslations((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            })
            return;
        }

        setLoadingId(id);
        try {
            const result = await translateMessage({ text, targetLang }).unwrap();
            setTranslations((prev) => ({ ...prev, [id]: result.translatedText }));
        } catch (e) {
            console.error('[useTranslate]', e);
        } finally {
            setLoadingId(null);
        }
    }

    return { translations, translate, loadingId};
}