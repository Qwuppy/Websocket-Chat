import { LANGUAGES } from "@/shared/i18n";
import { Language, useLanguage } from "@/shared/lib/hooks/useLanguage"
import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    const handleChange = (_: React.MouseEvent, newLang: Language | null) => {
        if (newLang) changeLanguage(newLang);
    }

    return (
        <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleChange}
            aria-label="language switcher"
            sx={{
                bgcolor: '#262424',
                border: '1px solid rgba(73, 73, 73, 1)',
                '& .MuiToggleButton-root': {
                    px: adp(10),
                    py: adp(4),
                    fontSize: adp(10),
                    lineHeight: `${adp(20)}px`,
                    color: '#bdbdbda9',
                    border: 'none',
                    borderRight: '1px solid rgba(73, 73, 73, 1)',
                    '&:last-child': {
                        borderRight: 'none',
                    },
                    '&.Mui-selected': {
                        bgcolor: '#2e2b2b',   // чуть светлее #262424
                        color: '#d4d4d4ff',
                        '&:hover': {
                            bgcolor: '#332f2f',
                        },
                    },
                    '&:hover': {
                        bgcolor: '#2a2828',
                    },
                },
            }}
        >
            <ToggleButton value={LANGUAGES.RU}>RU</ToggleButton>
            <ToggleButton value={LANGUAGES.EN}>EN</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default LanguageSwitcher;