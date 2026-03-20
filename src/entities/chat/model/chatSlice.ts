import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ChatState {
    activeChatId: string | null;
    activePartnerEmail: string | null;
    pendingPartnerEmail: string | null;
}

const initialState: ChatState = {
    activeChatId: null,
    activePartnerEmail: null,
    pendingPartnerEmail: null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat(state, action: PayloadAction<{ chatId: string, partnerEmail: string}>) {
            state.activeChatId = action.payload.chatId;
            state.activePartnerEmail = action.payload.partnerEmail;
            state.pendingPartnerEmail = null; 
        },
        // clearActiveChat(state) {
        //     state.activeChatId = null;
        //     state.activePartnerEmail = null;
        // },
        setPendingChat(state, action: PayloadAction<string>) {
            state.pendingPartnerEmail = action.payload;
            state.activeChatId = null;
            state.activePartnerEmail = null;
        }
    }
})

export const { setActiveChat, setPendingChat } = chatSlice.actions;
export default chatSlice.reducer;