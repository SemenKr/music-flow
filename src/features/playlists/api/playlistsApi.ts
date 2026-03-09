import {baseApi} from '@/app/api/baseApi.ts'
import type {Images} from '@/common/types'
import {errorToast} from '@/common/utils';
import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    PlaylistData,
    PlaylistsResponse,
    UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import {playlistsResponseSchema} from '@/features/playlists/model/playlists.schemas';


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
            query: (params) => ({url: 'playlists', params}),
            responseSchema: playlistsResponseSchema,
            catchSchemaFailure: err => {
                errorToast('Zod error. Details in the console', err.issues)
                return {status: 'CUSTOM_ERROR', error: 'Schema validation failed'}
            },
            providesTags: ['Playlist'],
        }),
        createPlaylist: build.mutation<{
            data: PlaylistData
        }, CreatePlaylistArgs>({
            query: (body) => ({method: 'post', url: 'playlists', body}),
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylist: build.mutation<void, string>({
            query: (playlistId) => ({method: 'delete', url: `playlists/${playlistId}`}),
            invalidatesTags: ['Playlist'],
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

                                const {title, description} = body.data.attributes

                                playlist.attributes.title = title
                                playlist.attributes.description = description
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

            invalidatesTags: ['Playlist'],
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
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylistCover: build.mutation<void, {
            playlistId: string
        }>({
            query: ({playlistId}) => ({method: 'delete', url: `playlists/${playlistId}/images/main`}),
            invalidatesTags: ['Playlist'],
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
