import { errorToast } from '@/common/utils/errorToast'
import { isErrorWithDetailArray } from '@/common/utils/isErrorWithDetailArray'
import { isErrorWithProperty } from '@/common/utils/isErrorWithProperty'
import { trimToMaxLength } from '@/common/utils/trimToMaxLength'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const handleErrors = (error: FetchBaseQueryError) => {
  // 🔎 Проверяем, что ошибка существует (дополнительная защита)
  if (error) {
    // 🧭 Обрабатываем ошибку в зависимости от её статуса
    switch (error.status) {
      // 🌐 Ошибки сети, тайм-аута или парсинга ответа
      case 'FETCH_ERROR':
      case 'PARSING_ERROR':
      case 'CUSTOM_ERROR':
      case 'TIMEOUT_ERROR':
        // Показываем текст ошибки напрямую
        errorToast(error.error)
        break

      // ❌ Ошибки запроса (например, валидация или запрет доступа)
      case 400:
      case 403:
        // Если сервер вернул массив ошибок с полем detail
        if (isErrorWithDetailArray(error.data)) {
          // Обрезаем слишком длинное сообщение перед выводом
          errorToast(trimToMaxLength(error.data.errors[0].detail))
        } else {
          // Иначе выводим сырой ответ сервера
          errorToast(JSON.stringify(error.data))
        }
        break

      // 🔍 Ресурс не найден
      case 404:
        // Проверяем наличие свойства "error" в ответе
        if (isErrorWithProperty(error.data, 'error')) {
          errorToast(error.data.error)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      // 🔐 Не авторизован или превышен лимит запросов
      case 401:
      case 429:
        // Проверяем наличие свойства "message"
        if (isErrorWithProperty(error.data, 'message')) {
          errorToast(error.data.message)
        } else {
          errorToast(JSON.stringify(error.data))
        }
        break

      default:
        // 🛑 Серверные ошибки (5xx)
        if (error.status >= 500 && error.status < 600) {
          errorToast('Server error occurred. Please try again later.', error)
        } else {
          // ❓ Любая другая неизвестная ошибка
          errorToast('Some error occurred')
        }
    }
  }
}
