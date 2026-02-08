import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'

export const store = configureStore({
    reducer: {
        // Register RTK Query cache/reducer under its generated slice name.
        [playlistsApi.reducerPath]: playlistsApi.reducer,
    },
    // Add RTK Query middleware for caching, polling, and request lifecycle.
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(playlistsApi.middleware),
})

// Enable refetch on focus/reconnect behaviors for RTK Query.
setupListeners(store.dispatch)
