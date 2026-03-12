import { baseApi } from '@/app/api/baseApi.ts'
import { SOCKET_EVENTS } from '@/common/constants'
import { imagesSchema } from '@/common/schemas'
import { subscribeToEvent } from '@/common/socket/subscribeToEvent'
import { withZodCatch } from '@/common/utils'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistImageProcessedEvent,
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

      // Проверка ответа сервера через Zod
      ...withZodCatch(playlistsResponseSchema),

      // Удаляем кеш сразу после размонтирования последнего подписчика
      keepUnusedDataFor: 0,

      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // Ждём завершения первого HTTP запроса
        await cacheDataLoaded

        // Подписываемся на websocket события
        const unsubscribes = [
          // Событие: создан новый плейлист
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, msg => {
            const newPlaylist = msg.payload.data

            // Если есть фильтр userId (например страница профиля),
            // добавляем только плейлисты этого пользователя
            if (arg.userId && newPlaylist.attributes.user.id !== arg.userId) {
              return
            }

            updateCachedData(state => {
              state.data.pop() // удаляем последний элемент (ограничение пагинации)
              state.data.unshift(newPlaylist) // добавляем новый плейлист в начало

              // обновляем метаданные
              state.meta.totalCount += 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),

          // Событие: обработка изображения плейлиста завершена
          subscribeToEvent<PlaylistImageProcessedEvent>(
            SOCKET_EVENTS.PLAYLIST_IMAGE_PROCESSED,
            msg => {
              const { itemId, images } = msg.payload

              updateCachedData(state => {
                // ищем плейлист в текущем кеше
                const playlist = state.data.find(p => p.id === itemId)
                if (!playlist) return

                // обновляем изображения
                playlist.attributes.images = images
              })
            },
          ),

          // Событие: плейлист обновлён
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, msg => {
            const newPlaylist = msg.payload.data

            updateCachedData(state => {
              const index = state.data.findIndex(p => p.id === newPlaylist.id)

              if (index !== -1) {
                // обновляем существующий плейлист
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
          }),
        ]

        // Ждём пока query удалится из кеша (нет подписчиков)
        await cacheEntryRemoved

        // Отписываемся от всех websocket событий
        unsubscribes.forEach(unsubscribe => unsubscribe())
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
