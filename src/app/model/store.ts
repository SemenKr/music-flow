import {baseApi} from '@/app/api/baseApi';
import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        // Register RTK Query cache/reducer under its generated slice name.
        [baseApi.reducerPath]: baseApi.reducer,
    },
    // Add RTK Query middleware for caching, polling, and request lifecycle.
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

// Enable refetch on focus/reconnect behaviors for RTK Query.
setupListeners(store.dispatch)
