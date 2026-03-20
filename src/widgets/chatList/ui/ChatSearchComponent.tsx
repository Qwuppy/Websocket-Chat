'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';import { setPendingChat } from '@/entities/chat/model/chatSlice';
import { useAppDispatch } from '@/shared/lib/hooks/redux';


interface ChatSearchProps {
    onSuccess: () => void;
}

export const ChatSearch = ({ onSuccess }: ChatSearchProps) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const dispatch = useAppDispatch();

    const [isActive, setIsActive] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
                placeholder={isActive ? 'Email собеседника...' : 'Новый диалог...'}
                value={email}
                onClick={() => setIsActive(true)}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                error={!!error}
                helperText={isActive ? (error || 'Enter — найти, Esc — отмена') : undefined}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        color: 'white',
                        cursor: isActive ? 'text' : 'pointer',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isActive ? '#1976d2' : '#3a3a3a',
                        transition: 'border-color 0.2s',
                    },
                    '& .MuiFormHelperText-root': {
                        color: error ? 'error.main' : 'grey.500',
                    },
                }}
                InputProps={{ readOnly: !isActive }}
            />
        </Box>
    );
};