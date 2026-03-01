import {handleErrors} from '@/common/utils';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    // 📁 Имя редьюсера - куда будут сохранены состояние и экшены для этого API
    reducerPath: 'baseApi',

    // 🏷️ Теги для автоматической инвалидации кэша
    // Когда данные изменяются (создание/обновление/удаление),
    // RTK Query автоматически обновит список плейлистов
    tagTypes: ['Playlists'],
    // ⏳ Хранить данные в кэше 86400 секунд (24 часа) после того, как они перестали использоваться
    keepUnusedDataFor: 86400,
    // 🌐 Базовая конфигурация для всех запросов
    baseQuery: async (args, api, extraOptions) => {
        const result = await fetchBaseQuery({
            baseUrl: import.meta.env.VITE_BASE_URL,
            headers: {
                'API-KEY': import.meta.env.VITE_API_KEY,
            },
            // 🔐 Добавляем токен авторизации к каждому запросу
            prepareHeaders: headers => {
                headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
                return headers
            },
        })(args, api, extraOptions)

        if (result.error) {
            handleErrors(result.error)
        }

        return result
    },
    // 🔄 Повторно запрашивать данные при возврате фокуса на вкладку браузера
    // refetchOnFocus: true,
    // 🌐 Повторно запрашивать данные при восстановлении интернет-соединения
    // refetchOnReconnect: true,
    endpoints: () => ({}),
})
