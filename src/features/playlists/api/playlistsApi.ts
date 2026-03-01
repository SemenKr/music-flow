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

// 🎵 API для работы с плейлистами
// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const playlistsApi = baseApi.injectEndpoints({
  // 🎯 Эндпоинты - описание всех методов работы с API
  endpoints: (build) => ({
    // 📋 Получение списка всех плейлистов
    // Типизация: <возвращаемый тип, тип аргументов запроса>
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({
        method: 'get',
        url: `playlists`,
        params,
      }),
      // ✅ Помечаем, что этот запрос предоставляет данные с тегом "Playlists"
      providesTags: ['Playlists'],
    }),

    // ➕ Создание нового плейлиста
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: 'post',
        url: `playlists`,
        body,
      }),
      // 🔄 После создания инвалидируем кэш, чтобы обновить список плейлистов
      invalidatesTags: ['Playlists'],
    }),

    // 🗑️ Удаление плейлиста по ID
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),
      // 🔄 После удаления обновляем список
      invalidatesTags: ['Playlists'],
    }),

    // ✏️ Обновление существующего плейлиста
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        method: 'put',
        url: `playlists/${playlistId}`,
        body,
      }),
      // 🔄 После обновления перезагружаем список плейлистов
      invalidatesTags: ['Playlists'],
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
