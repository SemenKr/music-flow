import type { RefObject } from 'react'
import s from './LoadingTrigger.module.css'

type LoadingTriggerProps = {
    observerRef: RefObject<HTMLDivElement | null>
    isFetchingNextPage: boolean
}

export const LoadingTrigger = ({ isFetchingNextPage, observerRef }: LoadingTriggerProps) => {
    return (
        <div ref={observerRef} className={s.sentinel}>
            {/*`<div style={{ height: '20px' }} />` создает "невидимую зону" в 20px в конце списка,*/}
            {/*при достижении которой автоматически загружаются новые треки. Без размеров*/}
            {/*IntersectionObserver не будет работать корректно.*/}
            {isFetchingNextPage ? (
                // ⏳ Индикатор загрузки следующей страницы
                <div className={s.loading}>Loading more tracks...</div>
            ) : (
                // 📦 Невидимая зона, при попадании в viewport вызывается подгрузка
                <div className={s.sentinelSpacer} />
            )}
        </div>
    )
}
