import { baseApi } from '@/app/api/baseApi.ts'
import { SOCKET_EVENTS } from '@/common/constants'
import { imagesSchema } from '@/common/schemas'
import { subscribeToEvent } from '@/common/socket/subscribeToEvent'
import { withZodCatch } from '@/common/utils'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import {
  playlistCreateResponseScheme,
  playlistsResponseSchema,
} from '@/features/playlists/model/playlists.schemas'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Получение списка плейлистов
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),
      ...withZodCatch(playlistsResponseSchema), // валидация ответа через zod
      keepUnusedDataFor: 0, // очищать кеш сразу после размонтирования

      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // ждём завершения первого запроса
        await cacheDataLoaded

        // подписки на websocket события
        const unsubscribes = [
          // новый плейлист
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, msg => {
            const newPlaylist = msg.payload.data

            updateCachedData(state => {
              state.data.pop() // удаляем последний элемент (для пагинации)
              state.data.unshift(newPlaylist) // добавляем новый в начало
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),

          // обновление плейлиста
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, msg => {
            const newPlaylist = msg.payload.data

            updateCachedData(state => {
              const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)

              if (index !== -1) {
                // обновляем данные плейлиста в кеше
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
          }),
        ]

        // ждём пока подписка на кеш исчезнет
        await cacheEntryRemoved

        // отписываемся от websocket
        unsubscribes.forEach(unsubscribe => unsubscribe())
      },

      // теги для кеширования RTK Query
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist', id: 'LIST' },
            ]
          : [{ type: 'Playlist', id: 'LIST' }],
    }),

    // создание плейлиста
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({ method: 'post', url: 'playlists', body }),
      ...withZodCatch(playlistCreateResponseScheme), // валидация ответа
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }], // обновить список
    }),

    // удаление плейлиста
    deletePlaylist: build.mutation<void, string>({
      query: playlistId => ({ method: 'delete', url: `playlists/${playlistId}` }),
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // обновление плейлиста
    updatePlaylist: build.mutation<
      void,
      {
        playlistId: string
        body: UpdatePlaylistArgs
      }
    >({
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: 'put',
        body,
      }),

      // optimistic update
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        // получаем все аргументы кешированных запросов fetchPlaylists
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        // обновляем кеш сразу
        const patches = args.map(arg =>
          dispatch(
            playlistsApi.util.updateQueryData('fetchPlaylists', arg, draft => {
              const playlist = draft.data.find(p => p.id === playlistId)

              if (!playlist) return

              const attrs = body.data.attributes

              playlist.attributes.title = attrs.title
              playlist.attributes.description = attrs.description
            }),
          ),
        )

        try {
          await queryFulfilled // ждём ответ сервера
        } catch {
          // откат если ошибка
          patches.forEach(patch => patch.undo())
        }
      },

      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // загрузка обложки плейлиста
    uploadPlaylistCover: build.mutation({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)

        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },

      ...withZodCatch(imagesSchema),
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // удаление обложки
    deletePlaylistCover: build.mutation<
      void,
      {
        playlistId: string
      }
    >({
      query: ({ playlistId }) => ({
        method: 'delete',
        url: `playlists/${playlistId}/images/main`,
      }),

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
