'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';import { setPendingChat } from '@/entities/chat/model/chatSlice';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { useTranslation } from 'react-i18next';


interface ChatSearchProps {
    onSuccess: () => void;
}

export const ChatSearch = ({ onSuccess }: ChatSearchProps) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch = useAppDispatch();

    const [isActive, setIsActive] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };

        if (isActive) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isActive])

    const handleClose = () => {
        setIsActive(false);
        setEmail('');
        setError('');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { handleClose(); return; }
        if (e.key === 'Enter') { handleSearch() }
    }

    const handleSearch = async () => {
        const trimmed = email.trim();
        if (!trimmed) return;

        dispatch(setPendingChat(trimmed));
        handleClose();
        onSuccess();
    };

    return (
        <Box ref={containerRef} sx={{ px: 2, pb: 2 }}>
            <TextField
                fullWidth
                size="small"
                placeholder={isActive ? t('chat.searchEmail') : t('chat.search')}
                value={email}
                onClick={() => setIsActive(true)}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                error={!!error}
                helperText={isActive ? (error || t('chat.searchHelper')) : undefined}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        cursor: isActive ? 'text' : 'pointer',
                        color: '#d4d4d4ff',
                        '& fieldset': {
                            borderColor: '#414040ff',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(53, 77, 97, 1)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgba(32, 88, 145, 1)',
                        },
                        backgroundColor: '#262424',         // фон всегда
                        '&.Mui-focused': {
                            backgroundColor: '#262424',       // фон при фокусе (когда пишешь)
                        },
                        '& input:-webkit-autofill': {           //автозаполнение
                            WebkitBoxShadow: '0 0 0 100px #262424 inset',  
                            WebkitTextFillColor: '#d4d4d4ff',                  
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isActive ? '#1976d2' : '#3a3a3a',
                        transition: 'border-color 0.2s',
                    },
                    '& .MuiFormHelperText-root': {
                        color: error ? 'error.main' : 'grey.500',
                    },
                    '& .MuiInputLabel-root': {
                            color: '#bdbdbda9',
                        '&.Mui-focused': {
                            color: '#d4d4d4ff',
                        },
                    },
                }}
                InputProps={{ readOnly: !isActive }}
            />
        </Box>
    );
};