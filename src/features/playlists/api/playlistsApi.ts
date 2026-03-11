import {baseApi} from '@/app/api/baseApi.ts'
import {SOCKET_EVENTS} from '@/common/constants';
import {imagesSchema} from '@/common/schemas';
import {subscribeToEvent} from '@/common/socket/subscribeToEvent';
import {withZodCatch} from '@/common/utils';
import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    PlaylistCreatedEvent, PlaylistUpdatedEvent,
    UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import {playlistCreateResponseScheme, playlistsResponseSchema} from '@/features/playlists/model/playlists.schemas';


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({url: 'playlists', params}),
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                // Ждем разрешения начального запроса перед продолжением
                await cacheDataLoaded

                const unsubscribe = subscribeToEvent<PlaylistCreatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_CREATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            state.data.pop()
                            state.data.unshift(newPlaylist)
                            state.meta.totalCount = state.meta.totalCount + 1
                            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                        })
                    }
                )
                const unsubscribe2 = subscribeToEvent<PlaylistUpdatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_UPDATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)
                            if (index !== -1) {
                                state.data[index] = { ...state.data[index], ...newPlaylist }
                            }
                        })
                    }
                )
                // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
                await cacheEntryRemoved
                unsubscribe()
                unsubscribe2()
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
                        { type: 'Playlist', id: 'LIST' },
                    ]
                    : [{ type: 'Playlist', id: 'LIST' }],
        }),
        createPlaylist: build.mutation({
            query: (body: CreatePlaylistArgs) => ({method: 'post', url: 'playlists', body}),
            ...withZodCatch(playlistCreateResponseScheme),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        deletePlaylist: build.mutation<void, string>({
            query: (playlistId) => ({method: 'delete', url: `playlists/${playlistId}`}),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        updatePlaylist: build.mutation<void, {
            playlistId: string;
            body: UpdatePlaylistArgs
        }>({
            query: ({playlistId, body}) => ({
                url: `playlists/${playlistId}`,
                method: 'put',
                body,
            }),

            onQueryStarted: async (
                {playlistId, body},
                {queryFulfilled, dispatch, getState}
            ) => {
                const args = playlistsApi.util.selectCachedArgsForQuery(
                    getState(),
                    'fetchPlaylists'
                )

                const patches = args.map((arg) =>
                    dispatch(
                        playlistsApi.util.updateQueryData(
                            'fetchPlaylists',
                            arg,
                            (draft) => {
                                const playlist = draft.data.find(
                                    (p) => p.id === playlistId
                                )

                                if (!playlist) return

                                const attrs = body.data.attributes

                                playlist.attributes.title = attrs.title
                                playlist.attributes.description = attrs.description
                            }
                        )
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patches.forEach((patch) => patch.undo())
                }
            },

            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        uploadPlaylistCover: build.mutation({
            query: ({playlistId, file}) => {
                const formData = new FormData()
                formData.append('file', file)
                return {method: 'post', url: `playlists/${playlistId}/images/main`, body: formData}
            },
            ...withZodCatch(imagesSchema),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        deletePlaylistCover: build.mutation<void, {
            playlistId: string
        }>({
            query: ({playlistId}) => ({method: 'delete', url: `playlists/${playlistId}/images/main`}),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
    }),
})

export const {
    useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useUploadPlaylistCoverMutation,
    useDeletePlaylistCoverMutation,
} = playlistsApi
