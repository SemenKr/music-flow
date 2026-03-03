// Во избежание ошибок импорт должен быть из `@reduxjs/toolkit/query/react`
import { baseApi } from '@/app/api/baseApi'
import type { Images } from '@/common/types'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types'
import { toast } from 'react-toastify'

// 🎵 API для работы с плейлистами
// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const playlistsApi = baseApi.injectEndpoints({
  // 🎯 Эндпоинты - описание всех методов работы с API
  endpoints: build => ({
    // 📋 Получение списка всех плейлистов
    // Типизация: <возвращаемый тип, тип аргументов запроса>
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: params => ({
        method: 'get',
        url: `playlists`,
        params,
      }),
      // ✅ Помечаем, что этот запрос предоставляет данные с тегом "Playlists"
      providesTags: ['Playlists'],
    }),

    // ➕ Создание нового плейлиста
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: body => ({
        method: 'post',
        url: `playlists`,
        body,
      }),
      // 🔄 После создания инвалидируем кэш, чтобы обновить список плейлистов
      invalidatesTags: ['Playlists'],
    }),

    // 🗑️ Удаление плейлиста по ID
    deletePlaylist: build.mutation<void, string>({
      query: playlistId => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),
      async onQueryStarted(playlistId, { dispatch, queryFulfilled, getState }) {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults = args.map(arg =>
          dispatch(
            playlistsApi.util.updateQueryData('fetchPlaylists', arg, draft => {
              draft.data = draft.data.filter(p => p.id !== playlistId)
            }),
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(p => p.undo())
        }
      },
      // 🔄 После удаления обновляем список
      invalidatesTags: ['Playlists'],
    }),

    // ✏️ Обновление существующего плейлиста
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      // 📡 Конфигурация запроса: PUT /playlists/:playlistId
      query: ({ playlistId, body }) => ({ url: `playlists/${playlistId}`, method: 'put', body }),

      // ⚡ Запускается СРАЗУ при вызове мутации — до ответа сервера
      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        // 🗂️ Берём все аргументы, с которыми когда-либо вызывался fetchPlaylists
        // Нужно, т.к. один и тот же список мог загружаться с разными параметрами (страница, фильтр)
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        // 🔁 Патчим каждый закешированный вариант
        const patchResults = args.map(arg =>
          dispatch(
            // ✏️ updateQueryData — напрямую изменяет кеш RTK Query (через Immer, мутации разрешены)
            playlistsApi.util.updateQueryData(
              'fetchPlaylists',
              arg, // аргументы конкретного кеша
              state => {
                // 🔍 Ищем нужный плейлист в кеше
                const playlist = state.data.find(p => p.id === playlistId)
                if (playlist) {
                  // 💾 Применяем новые данные — UI обновится мгновенно, не ждём сервер
                  Object.assign(playlist.attributes, body)
                }
              },
            ),
          ),
        )
        try {
          await queryFulfilled // ⏳ Ждём реальный ответ сервера
          // ✅ Успех — оптимистичные изменения остаются
        } catch (error: unknown) {
          // ❌ Ошибка — откатываем все изменения, UI вернётся к исходному состоянию
          patchResults.forEach(patchResult => {
            patchResult.undo() // ↩️ Откат
          })
          const message = (error as { error?: { data?: { message?: string } } })?.error?.data
            ?.message
          toast.error(message ?? 'Не удалось обновить плейлист')
        }
      },
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'post',
          body: formData,
        }
      },
      invalidatesTags: ['Playlists'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `playlists/${playlistId}/images/main`,
        method: 'delete',
      }),
      invalidatesTags: ['Playlists'],
    }),
  }),
})

// 🪝 Экспортируем автоматически созданные хуки для использования в компонентах
// RTK Query автоматически создаёт хуки на основе имён эндпоинтов:
// - fetchPlaylists → useFetchPlaylistsQuery
// - createPlaylist → useCreatePlaylistMutation
// - deletePlaylist → useDeletePlaylistMutation
// - updatePlaylist → useUpdatePlaylistMutation
export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
