import type { RootState } from '@/app/model/store.ts'
import { useSelector } from 'react-redux'

/**
 * Глобальный хук для отслеживания загрузки во всём приложении.
 *
 * Идея:
 * RTK Query хранит состояние всех запросов и мутаций
 * внутри slice (baseApi). Мы проверяем их статусы
 * и определяем, есть ли хотя бы один активный запрос.
 */
export const useGlobalLoading = () => {
    return useSelector((state: RootState) => {
        /**
         * state.baseApi.queries — объект со всеми query-запросами
         * state.baseApi.mutations — объект со всеми mutation-запросами
         *
         * Object.values превращает объект в массив,
         * чтобы можно было удобно проверить статусы.
         */
        const queries = Object.values(state.baseApi.queries || {})
        const mutations = Object.values(state.baseApi.mutations || {})

        /**
         * Проверяем, есть ли хотя бы один запрос со статусом 'pending'.
         *
         * pending означает:
         * - запрос отправлен
         * - ответ ещё не получен
         */
        const hasActiveQueries = queries.some(
            query => query?.status === 'pending'
        )

        const hasActiveMutations = mutations.some(
            mutation => mutation?.status === 'pending'
        )

        /**
         * Если хотя бы один query или mutation выполняется —
         * возвращаем true.
         *
         * Это значение можно использовать для:
         * - глобального LinearProgress
         * - блокировки UI
         * - отображения лоадера
         */
        return hasActiveQueries || hasActiveMutations
    })
}
