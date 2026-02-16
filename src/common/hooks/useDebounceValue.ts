import { useEffect, useState } from 'react'

/**
 * useDebounceValue
 *
 * Хук возвращает "отложенное" значение.
 * Обновление произойдёт только если value
 * не меняется в течение delay миллисекунд.
 *
 * Полезно для:
 * - поиска (debounced search)
 * - фильтрации
 * - предотвращения частых API-запросов
 *
 * @param value — исходное значение
 * @param delay — задержка в мс (по умолчанию 700)
 */
export const useDebounceValue = <T>(
    value: T,
    delay: number = 700
): T => {
    // Состояние для хранения "задебаунсенного" значения
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        // Устанавливаем таймер.
        // Если value не изменится в течение delay,
        // то обновляем debounced.
        const handler = setTimeout(() => {
            setDebounced(value)
        }, delay)

        // Cleanup:
        // Если value или delay изменились —
        // предыдущий таймер очищается,
        // тем самым реализуется debounce-механизм.
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay]) // Эффект перезапускается при изменении value или delay

    return debounced
}
