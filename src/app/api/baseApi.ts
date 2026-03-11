import { baseQueryWithReauth } from '@/app/api/baseQueryWithReauth.ts'
import { createApi } from '@reduxjs/toolkit/query/react'

// 🌐 Базовый API-инстанс RTK Query
// Используется как основа для всех feature-эндпоинтов
export const baseApi = createApi({
  // 🏷 Уникальный ключ в Redux store
  reducerPath: 'baseApi',

  // 🏷 Типы тегов для автоматической инвалидации кэша
  tagTypes: ['Playlist', 'Auth'],

  // 📦 Здесь будут подключаться конкретные endpoints через injectEndpoints
  endpoints: () => ({}),

  // 🔐 Кастомный baseQuery с авто-обновлением accessToken
  baseQuery: baseQueryWithReauth,
  // skipSchemaValidation: import.meta.env.PROD,
})
