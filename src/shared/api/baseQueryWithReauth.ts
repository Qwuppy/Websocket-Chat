import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseQuery } from "./baseApi";
import { logout, setAuth } from "@/features/auth/model/authSlice";
import { tokenStorage } from "../lib/auth/tokenStorage";


export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {

    const finalArgs: FetchArgs =
        typeof args === 'string'
            ? { url: args, credentials: 'include' }
            : { ...args, credentials: 'include' }

    let result = await baseQuery(finalArgs, api, extraOptions)

    if (result.error && Number(result.error.status) === 401) {
        // Попытка обновить токен
        const refreshResult = await baseQuery(
            {
                url: '/refresh',
                method: 'GET',
                credentials: 'include',
            },
            api,
            extraOptions
        )

        if (!refreshResult.error && refreshResult.data) {

            const data = refreshResult.data as { access_token: string }

            const userName = tokenStorage.getActiveUsername()

            if (!userName) {
                api.dispatch(logout())
                return result
            }

            api.dispatch(setAuth({ token: data.access_token, userName: userName}));
            tokenStorage.saveSession(userName, data.access_token);

            const retryArgs: FetchArgs =
                typeof args === 'string'
                    ? { url: args, credentials: 'include' }
                    : { ...args, credentials: 'include' }


            result = await baseQuery(retryArgs, api, extraOptions)

        } else {

            api.dispatch(logout())

        }
    }

    return result
}