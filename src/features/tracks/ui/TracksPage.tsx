import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi'
import { useCallback, useEffect, useRef } from 'react'
import s from './TracksPage.module.css'

export const TracksPage = () => {
    // 🎣 Infinite-хук для загрузки треков с курсорной пагинацией
    const {
        data,
        isFetching,           // 🔄 Идёт любой запрос
        isFetchingNextPage,   // ⏭ Идёт загрузка следующей страницы
        fetchNextPage,        // ➕ Функция загрузки следующей страницы
        hasNextPage,          // 📌 Есть ли ещё страницы
    } = useFetchTracksInfiniteQuery()

    // 🔗 Ссылка на DOM-элемент, который будет триггером автоподгрузки
    const observerRef = useRef<HTMLDivElement>(null)

    // 📄 Объединяем все страницы в один массив треков
    const pages = data?.pages.flatMap(page => page.data) || []

    // 🚀 Загружает следующую страницу, если она есть и сейчас не идёт загрузка
    const loadMoreHandler = useCallback(() => {
        if (hasNextPage && !isFetching) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetching, fetchNextPage])

    useEffect(() => {
        // 👀 IntersectionObserver отслеживает появление элемента во viewport
        const observer = new IntersectionObserver(
            entries => {
                // entries — массив отслеживаемых элементов (в нашем случае один)
                if (entries.length > 0 && entries[0].isIntersecting) {
                    loadMoreHandler()
                }
            },
            {
                root: null,          // 📺 Отслеживание относительно окна браузера
                rootMargin: '100px', // 📏 Начинать загрузку за 100px до появления элемента
                threshold: 0.1,      // ⚡ Срабатывает при видимости 10% элемента
            }
        )

        const currentObserverRef = observerRef.current

        if (currentObserverRef) {
            // ▶️ Начать наблюдение за элементом
            observer.observe(currentObserverRef)
        }

        // 🧹 Очистка при размонтировании компонента
        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef)
            }
        }
    }, [loadMoreHandler])

    return (
        <section className={s.page}>
            <header className={s.header}>
                <p className={s.eyebrow}>Audio library</p>
                <h1 className={s.title}>Tracks page</h1>
                <p className={s.subtitle}>Infinite scroll with the newest uploads.</p>
            </header>

            <div className={s.list}>
                {pages.map(track => {
                    const { title, user, attachments } = track.attributes

                    return (
                        <article key={track.id} className={s.item}>
                            <div className={s.itemInfo}>
                                <p className={s.itemTitle}>Title: {title}</p>
                                <p className={s.itemArtist}>Name: {user.name}</p>
                            </div>

                            {/* 🎵 Если есть аудио-файл — показываем плеер */}
                            {attachments.length
                                ? <audio className={s.audio} controls src={attachments[0].url} />
                                : <span className={s.noFile}>No file</span>}
                        </article>
                    )
                })}
            </div>

            {hasNextPage && (
                // 👇 Этот элемент отслеживается IntersectionObserver
                <div ref={observerRef} className={s.sentinel}>
                    {isFetchingNextPage ? (
                        // ⏳ Индикатор загрузки следующей страницы
                        <div className={s.loading}>Loading more tracks...</div>
                    ) : (
                        // 📦 Невидимая зона, при попадании в viewport вызывается подгрузка
                        <div className={s.sentinelSpacer} />
                    )}
                </div>
            )}

            {/* 🏁 Если страниц больше нет */}
            {!hasNextPage && pages.length > 0 && (
                <p className={s.end}>Nothing more to load</p>
            )}
        </section>
    )
}
