import { baseApi } from '@/app/api/baseApi'
import { withZodCatch } from '@/common/utils'
import type { FetchTracksArgs, FetchTracksResponse } from '@/features/tracks/api/tracksApi.types'
import { fetchTracksResponseSchema } from '@/features/tracks/model/tracks.schemas'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchTracks: build.infiniteQuery<
      FetchTracksResponse, // 📦 Тип ответа от сервера
      FetchTracksArgs, // 📥 Тип аргументов запроса (в данном случае аргументов нет)
      string | undefined // 🔑 Тип pageParam (курсор для пагинации)
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined, // 🚀 Начинаем без курсора (первая страница)

        getNextPageParam: lastPage => {
          // ➡️ Берём nextCursor из meta ответа
          // Если курсора нет — возвращаем undefined (пагинация заканчивается)
          return lastPage.meta.nextCursor || undefined
        },
      },

      query: ({ pageParam, queryArg }) => {
        return {
          url: 'playlists/tracks', // 🌐 Endpoint для получения треков

          params: {
            cursor: pageParam, // 🔁 Курсор текущей страницы
            ...queryArg,
          },
        }
      },
      ...withZodCatch(fetchTracksResponseSchema),
    }),
  }),
})

// 🎣 Хук для использования infinite-запроса в компонентах
export const { useFetchTracksInfiniteQuery } = tracksApi
