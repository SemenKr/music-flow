import {baseApi} from '@/app/api/baseApi.ts'
import {withZodCatch} from '@/common/utils';
import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import {playlistsResponseSchema} from '@/features/playlists/model/playlists.schemas';


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({url: 'playlists', params}),
            ...withZodCatch(playlistsResponseSchema),
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
            ...withZodCatch(playlistsResponseSchema),
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
            ...withZodCatch(playlistsResponseSchema),
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
