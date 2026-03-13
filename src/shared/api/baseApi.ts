import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { tokenStorage } from "../lib/auth/tokenStorage"

export const baseQuery = fetchBaseQuery({
    baseUrl: "https://cafe-admin-api-production.up.railway.app/auth",

    prepareHeaders: (headers) => {
        const token = tokenStorage.getActiveToken()

        if (token) {
        headers.set("Authorization", `Bearer ${token}`)
        }

        return headers
    }
})