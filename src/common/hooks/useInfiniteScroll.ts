import { useCallback, useEffect, useRef } from 'react'

type Props = {
    hasNextPage: boolean          // 📌 Есть ли следующая страница для загрузки
    isFetching: boolean           // 🔄 Выполняется ли сейчас запрос
    fetchNextPage: () => void     // ➕ Функция загрузки следующей страницы
    rootMargin?: string           // 📏 Отступ до появления элемента (по умолчанию 100px)
    threshold?: number            // 👀 Процент видимости элемента для срабатывания
}

export const useInfiniteScroll = ({
                                      hasNextPage,
                                      isFetching,
                                      fetchNextPage,
                                      rootMargin = '100px',
                                      threshold = 0.1,
                                  }: Props) => {
    // 🔗 Ref на DOM-элемент, который будет триггером подгрузки
    const observerRef = useRef<HTMLDivElement>(null)

    // 🚀 Проверяет, можно ли загрузить следующую страницу
    const loadMoreHandler = useCallback(() => {
        if (hasNextPage && !isFetching) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetching, fetchNextPage])

    useEffect(() => {
        // 👁 IntersectionObserver отслеживает появление элемента во viewport
        const observer = new IntersectionObserver(
            entries => {
                // entries — массив отслеживаемых элементов (обычно один)
                if (entries.length > 0 && entries[0].isIntersecting) {
                    loadMoreHandler()
                }
            },
            {
                root: null,      // 📺 Отслеживание относительно окна браузера
                rootMargin,      // 📐 Начинать загрузку до появления элемента
                threshold,       // ⚡ Срабатывание при указанной доле видимости
            }
        )

        const currentObserverRef = observerRef.current

        if (currentObserverRef) {
            // ▶️ Начать наблюдение за элементом
            observer.observe(currentObserverRef)
        }

        // 🧹 Очистка при размонтировании или изменении зависимостей
        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef)
            }
        }
    }, [loadMoreHandler, rootMargin, threshold])

    // 📤 Возвращаем ref, который нужно повесить на "sentinel"-элемент
    return { observerRef }
}
