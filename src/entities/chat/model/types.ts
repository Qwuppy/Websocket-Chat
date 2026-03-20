export interface Chat {
    id: string;
    user1_email: string;
    user2_email: string;
    created_at: string;
    lastMessage?: {
        content: string;
        created_at: string;
    } | null;
}