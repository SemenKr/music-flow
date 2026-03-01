import type { RootState } from '@/app/model/store.ts'
import { playlistsApi } from '@/features/playlists/api/playlistsApi'
import { tracksApi } from '@/features/tracks/api/tracksApi'
import { useSelector } from 'react-redux'

/**
 * Эндпоинты, которые НЕ должны запускать глобальный лоадер
 */
const excludedEndpoints = [
  playlistsApi.endpoints.fetchPlaylists.name,
  tracksApi.endpoints.fetchTracks.name,
]

/**
 * Хук возвращает true,
 * если есть активный (pending) запрос,
 * кроме исключённых.
 */
export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    // Все query и mutation из RTK Query
    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})

    /**
     * 🔎 Проверяем queries:
     * 1. Берём только pending
     * 2. Игнорируем исключённые эндпоинты
     */
    const hasActiveQueries = queries.some((query) => {
      if (query?.status !== 'pending') return false

      // Если эндпоинт в исключениях —
      // показываем лоадер только если уже были успешные запросы
      if (excludedEndpoints.includes(query.endpointName)) {
        const completedQueries = queries.filter((q) => q?.status === 'fulfilled')
        return completedQueries.length > 0
      }

      return true
    })

    /**
     * 🔄 Проверяем mutations:
     * Любая pending-мутация включает лоадер
     */
    const hasActiveMutations = mutations.some((mutation) => mutation?.status === 'pending')

    // 🚦 Если есть активные запросы или мутации — включаем глобальный лоадер
    return hasActiveQueries || hasActiveMutations
  })
}
