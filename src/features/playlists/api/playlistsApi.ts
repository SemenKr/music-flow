import {baseApi} from '@/app/api/baseApi.ts'
import type {Images} from '@/common/types'
import {errorToast} from '@/common/utils';
import type {
    FetchPlaylistsArgs,
    PlaylistData,
    UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import {playlistCreateResponceScheme, playlistsResponseSchema} from '@/features/playlists/model/playlists.schemas';


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({url: 'playlists', params}),
            responseSchema: playlistsResponseSchema,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return {status: 'CUSTOM_ERROR', error: 'Schema validation failed'}
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
            query: (body: PlaylistData) => ({method: 'post', url: 'playlists', body}),
            responseSchema: playlistCreateResponceScheme,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return {status: 'CUSTOM_ERROR', error: 'Schema validation failed'}
            },
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
        uploadPlaylistCover: build.mutation<Images, {
            playlistId: string;
            file: File
        }>({
            query: ({playlistId, file}) => {
                const formData = new FormData()
                formData.append('file', file)
                return {method: 'post', url: `playlists/${playlistId}/images/main`, body: formData}
            },
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
