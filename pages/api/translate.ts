import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).end();

    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'Missing fields' });

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();
    const translated = data?.[0]?.[0]?.[0];

    if (!translated) return res.status(500).json({ error: 'Translation failed' });
    res.status(200).json({ translatedText: translated });
};

export default handler;