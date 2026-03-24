import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import { GTranslate } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";



const LANGUAGES = [
    { label: 'Руссикй', code: 'ru'},
    { label: 'Английский', code: 'en'},
]

interface TranslateButtonProps {
    messageId: number;
    content: string;
    isOwn: boolean;
    translation: string | undefined;
    isLoading: boolean;
    onTranslate: (id: number, text: string, targetLang: string) => void;
}

export const TranslateButton = ({
    messageId,
    content,
    isOwn,
    translation,
    isLoading,
    onTranslate,
}: TranslateButtonProps ) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        if (translation) {
            onTranslate(messageId, content, '');
            return;
        }
        setAnchorEl(e.currentTarget);
    }

    const handleSelect = (code: string) => {
        setAnchorEl(null);
        onTranslate(messageId, content, code);
    }

    return (
        <Box
            mr={adp(5)}
        >
            {translation && (
                <Typography
                    variant="body2"
                    sx={{
                        mt: adp(5),
                        opacity: 0.85,
                        pt: adp(5),
                    }}
                >
                    {translation}
                </Typography>
            )}
            <IconButton
                onClick={handleOpen}
                disabled={isLoading}
                sx={{ opacity: 0.6, p: 0, mt: adp(3), color: isOwn ? "#fff" : "#000" }}
            >
                {isLoading ? (
                    <CircularProgress size={12} color="inherit" />
                ) : (
                    <GTranslate sx={{ fontSize: adp(14) }} />
                )}
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem disabled sx={{ opacity: 0.5, fontSize: adp(12) }}>
                    Перевести на:
                </MenuItem>
                {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code} onClick={() => handleSelect(lang.code)}>
                        {lang.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}