import { baseApi } from '@/app/api/baseApi.ts'
import { baseQuery } from '@/app/api/baseQuery'
import { AUTH_KEYS } from '@/common/constants'
import { handleErrors, isTokens } from '@/common/utils'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

// 🔐 Мьютекс — чтобы только один запрос обновлял токен одновременно
const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // ⏳ Ждём, если уже идёт обновление токена
  await mutex.waitForUnlock()

  // 🚀 Выполняем основной API-запрос
  let result = await baseQuery(args, api, extraOptions)
  // ❗ Если получили 401 (токен истёк или невалидный)
  if (result.error && result.error.status === 401) {
    // 🧠 Если никто ещё не обновляет токен — берём управление
    if (!mutex.isLocked()) {
      const release = await mutex.acquire() // 🔒 Блокируем мьютекс

      try {
        // 📦 Берём refreshToken из localStorage
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

        // 🔄 Отправляем запрос на обновление токена
        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'post', body: { refreshToken } },
          api,
          extraOptions,
        )

        // ✅ Если сервер вернул новые токены
        if (refreshResult.data && isTokens(refreshResult.data)) {
          // 💾 Сохраняем новые токены
          localStorage.setItem(AUTH_KEYS.accessToken, refreshResult.data.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, refreshResult.data.refreshToken)

          // 🔁 Повторяем исходный запрос уже с новым accessToken
          result = await baseQuery(args, api, extraOptions)
        } else {
          // 🚪 Если refresh не сработал — разлогиниваем пользователя
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          api.dispatch(baseApi.endpoints.logout.initiate())
        }
      } finally {
        // 🔓 Обязательно освобождаем мьютекс
        release()
      }
    } else {
      // ⏳ Если другой запрос уже обновляет токен — просто ждём
      await mutex.waitForUnlock()

      // 🔁 После обновления повторяем исходный запрос
      result = await baseQuery(args, api, extraOptions)
    }
  }

  // ⚠️ Обрабатываем остальные ошибки (кроме 401)
  if (result.error && result.error.status !== 401) {
    handleErrors(result.error)
  }

  return result
}
