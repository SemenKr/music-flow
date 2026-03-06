import { baseApi } from '@/app/api/baseApi'
import { AUTH_KEYS } from '@/common/constants'
import type { LoginArgs, LoginResponse, MeResponse } from '@/features/auth/api/authApi.types'

// Расширяем базовый API (baseApi) новыми эндпоинтами для аутентификации.
// Это позволяет разбивать логику API на несколько файлов (Code Splitting),
// сохраняя при этом единый store и кэш RTK Query.
export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // Эндпоинт для получения данных текущего пользователя (GET /auth/me)
    getMe: build.query<MeResponse, void>({
      // query: определяет URL и параметры запроса
      query: () => `auth/me`,
      // providesTags: сообщает кэшу, что этот запрос предоставляет данные типа 'Auth'.
      // Если где-то будет вызван invalidateTags(['Auth']), данные этого запроса обновятся.
      providesTags: ['Auth'],
    }),

    // Эндпоинт для входа в систему (POST /auth/login)
    login: build.mutation<LoginResponse, LoginArgs>({
      query: payload => {
        return {
          method: 'post',
          url: 'auth/login',
          // Добавляем accessTokenTTL к телу запроса (время жизни токена - 20 минуты)
          body: { ...payload, accessTokenTTL: '20m' },
        }
      },
      // onQueryStarted: жизненный цикл запроса. Позволяет выполнить код в момент начала
      // или завершения (успешного/неуспешного) запроса.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        // Ждем успешного выполнения запроса
        const { data } = await queryFulfilled
        console.log('login: ', data)
        // Сохраняем токены в localStorage для использования в будущих запросах
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)

        // Инвалидируем тег 'Auth', чтобы заставить RTK Query автоматически
        // перезапросить данные пользователя (endpoint getMe), так как мы только что вошли.
        dispatch(authApi.util.invalidateTags(['Auth']))
      },
    }),

    // Эндпоинт для выхода из системы (POST /auth/logout)
    logout: build.mutation<void, void>({
      query: () => {
        // Получаем refresh token из localStorage, чтобы отправить его на сервер для отзыва
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return {
          url: 'auth/logout',
          method: 'post',
          body: { refreshToken },
        }
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        // Ждем ответа от сервера (что токен успешно отозван)
        await queryFulfilled

        // Удаляем токены из локального хранилища
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)

        // Сбрасываем все состояние API (очищаем кэш).
        // Это важно, чтобы данные предыдущего пользователя не остались в памяти.
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

// Экспортируем автоматически сгенерированные хуки для использования в компонентах
export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi
