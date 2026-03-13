interface Sessions {
    [username: string]: string
}

const SESSIONS_KEY = "auth_sessions"
const ACTIVE_KEY = "active_session"

const isBrowser = () => typeof window !== "undefined"

export const tokenStorage = {

    getSessions(): Sessions {
        if (!isBrowser()) return {}
        const raw = localStorage.getItem(SESSIONS_KEY)
        return raw ? JSON.parse(raw) : {}
    },

    saveSession(username: string, token: string) {
        if (!isBrowser()) return 
        const sessions = this.getSessions()
        sessions[username] = token

        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
        localStorage.setItem(ACTIVE_KEY, username)
    },

    getActiveToken(): string | null {
        if (!isBrowser()) return null
        const sessions = this.getSessions()
        const active = localStorage.getItem(ACTIVE_KEY)

        if (!active) return null
        return sessions[active] || null
    },

    getActiveUsername(): string | null {
        if (!isBrowser()) return null
        return localStorage.getItem(ACTIVE_KEY)
    },

    switchSession(username: string) {
        if (!isBrowser()) return
        localStorage.setItem(ACTIVE_KEY, username)
    },

    logout(username: string) {
        if (!isBrowser()) return
        const sessions = this.getSessions()
        delete sessions[username]
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))

        // если удаляем активную, сбросить active_session
        const active = localStorage.getItem(ACTIVE_KEY)
        if (active === username) {
        localStorage.removeItem(ACTIVE_KEY)
        }
    }

}