import { baseApi } from '@/app/api/baseApi'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types'

export const tracksApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchTracks: build.infiniteQuery<
            FetchTracksResponse,      // 📦 Тип ответа от сервера
            void,                     // 📥 Тип аргументов запроса (в данном случае аргументов нет)
            string | undefined        // 🔑 Тип pageParam (курсор для пагинации)
        >({
            infiniteQueryOptions: {
                initialPageParam: undefined, // 🚀 Начинаем без курсора (первая страница)

                getNextPageParam: lastPage => {
                    // ➡️ Берём nextCursor из meta ответа
                    // Если курсора нет — возвращаем undefined (пагинация заканчивается)
                    return lastPage.meta.nextCursor || undefined
                },
            },

            query: ({ pageParam }) => {
                return {
                    url: 'playlists/tracks', // 🌐 Endpoint для получения треков

                    params: {
                        cursor: pageParam,      // 🔁 Курсор текущей страницы
                        pageSize: 5,            // 📄 Количество элементов за запрос
                        paginationType: 'cursor', // 🔄 Тип пагинации — курсорная
                    },
                }
            },
        }),
    }),
})

// 🎣 Хук для использования infinite-запроса в компонентах
export const { useFetchTracksInfiniteQuery } = tracksApi
