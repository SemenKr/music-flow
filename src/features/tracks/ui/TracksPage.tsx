import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll'
import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi'
import { LoadingTrigger } from './LoadingTrigger/LoadingTrigger'
import { TracksList } from './TracksList/TracksList'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFetchTracksInfiniteQuery({})

  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })

  const pages = data?.pages.flatMap(page => page.data) || []

  return (
    <section className={s.page}>
      <header className={s.header}>
        <p className={s.eyebrow}>Audio library</p>
        <h1 className={s.title}>Tracks page</h1>
        <p className={s.subtitle}>Infinite scroll with the newest uploads.</p>
      </header>

      <TracksList tracks={pages} />

      {hasNextPage && (
        // 👇 Этот элемент отслеживается IntersectionObserver
        <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />
      )}

      {/* 🏁 Если страниц больше нет */}
      {!hasNextPage && pages.length > 0 && <p className={s.end}>Nothing more to load</p>}
    </section>
  )
}
