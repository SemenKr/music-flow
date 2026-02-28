import { baseApi } from '@/app/api/baseApi'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        /**
         * Регистрируем reducer RTK Query.
         * baseApi.reducerPath — это автоматически сгенерированное имя slice
         * (например "baseApi"), под которым будет храниться кеш запросов.
         */
        [baseApi.reducerPath]: baseApi.reducer,
    },

    /**
     * Подключаем middleware RTK Query.
     *
     * Он отвечает за:
     * - выполнение HTTP-запросов
     * - кеширование данных
     * - управление статусами (pending / fulfilled / rejected)
     * - polling и другие lifecycle-события
     */
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

/**
 * RootState — тип всего Redux-состояния приложения.
 * Автоматически выводится из store.
 *
 * Используется в:
 * - useSelector
 * - typed hooks
 * - селекторах
 */
export type RootState = ReturnType<typeof store.getState>

/**
 * setupListeners включает дополнительные возможности RTK Query:
 * - refetch при возврате вкладки в фокус
 * - refetch при восстановлении интернет-соединения
 *
 * Работает через подписку на события браузера.
 */
setupListeners(store.dispatch)
