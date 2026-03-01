import { handleErrors } from '@/common/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    // 📁 Ключ в store, под которым RTK Query сохранит состояние этого API
    reducerPath: 'baseApi',

    // 🏷️ Список тегов для инвалидации кэша
    // Используются в providesTags / invalidatesTags
    tagTypes: ['Playlists'],

    // ⏳ Время хранения данных в кэше (в секундах)
    // 86400 = 24 часа после того, как подписчиков на запрос больше нет
    keepUnusedDataFor: 86400,

    // 🌐 Базовый обработчик всех HTTP-запросов
    baseQuery: async (args, api, extraOptions) => {
        // 🔧 Конфигурация fetchBaseQuery
        const result = await fetchBaseQuery({
            baseUrl: import.meta.env.VITE_BASE_URL, // 🌍 Базовый URL API

            headers: {
                'API-KEY': import.meta.env.VITE_API_KEY, // 🔑 Статический API-ключ
            },

            // 🔐 Подготовка заголовков перед каждым запросом
            prepareHeaders: headers => {
                // Добавляем Bearer-токен авторизации
                headers.set(
                    'Authorization',
                    `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
                )
                return headers
            },
        })(args, api, extraOptions)

        // ❗ Глобальная обработка ошибок
        if (result.error) {
            handleErrors(result.error)
        }

        return result
    },

    // 🔄 Автоматический рефетч при возврате фокуса на вкладку
    // refetchOnFocus: true,

    // 🌐 Автоматический рефетч при восстановлении соединения
    // refetchOnReconnect: true,

    // 📦 Эндпоинты подключаются через injectEndpoints
    endpoints: () => ({}),
})
