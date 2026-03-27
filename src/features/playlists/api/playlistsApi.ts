import { baseApi } from '@/app/api/baseApi'
import { imagesSchema } from '@/common/schemas'
import { withZodCatch } from '@/common/utils'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types'
import { applyPlaylistOptimisticUpdate } from '@/features/playlists/lib/playlistsCache'
import { subscribeToPlaylistUpdates } from '@/features/playlists/lib/subscribeToPlaylistUpdates'
import {
  playlistCreateResponseScheme,
  playlistsResponseSchema,
} from '@/features/playlists/model/playlists.schemas'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Получение списка плейлистов
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),

      // Проверка ответа сервера через Zod
      ...withZodCatch(playlistsResponseSchema),

      // Удаляем кеш сразу после размонтирования последнего подписчика
      keepUnusedDataFor: 0,

      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждём завершения первого HTTP запроса
        await cacheDataLoaded

        const unsubscribe = subscribeToPlaylistUpdates(arg, updateCachedData)

        // Ждём пока query удалится из кеша (нет подписчиков)
        await cacheEntryRemoved

        unsubscribe()
      },

      // Теги RTK Query для кеш-инвалидации
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist', id: 'LIST' },
            ]
          : [{ type: 'Playlist', id: 'LIST' }],
    }),

    // Создание плейлиста
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        method: 'post',
        url: 'playlists',
        body,
      }),

      // Проверка ответа
      ...withZodCatch(playlistCreateResponseScheme),

      // Инвалидируем список плейлистов
      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // Удаление плейлиста
    deletePlaylist: build.mutation<void, string>({
      query: playlistId => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),

      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // Обновление плейлиста
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

      // Optimistic update — обновляем UI до ответа сервера
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        // Получаем аргументы всех кешированных fetchPlaylists
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        // Применяем изменения во всех кешах
        const patches = args.map(arg =>
          dispatch(
            playlistsApi.util.updateQueryData('fetchPlaylists', arg, draft => {
              applyPlaylistOptimisticUpdate(playlistId, body.data.attributes)(draft)
            }),
          ),
        )

        try {
          await queryFulfilled // ждём ответ сервера
        } catch {
          // если запрос упал — откатываем optimistic update
          patches.forEach(patch => patch.undo())
        }
      },

      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // Загрузка обложки плейлиста
    uploadPlaylistCover: build.mutation({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)

        return {
          method: 'post',
          url: `playlists/${playlistId}/images/main`,
          body: formData,
        }
      },

      ...withZodCatch(imagesSchema),

      invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
    }),

    // Удаление обложки
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
