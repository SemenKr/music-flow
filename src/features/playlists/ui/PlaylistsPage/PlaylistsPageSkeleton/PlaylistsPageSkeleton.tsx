import s from './PlaylistsPageSkeleton.module.css'

export const PlaylistsPageSkeleton = () => {
    return (
        <section className={s.page}>
            {/* Hero skeleton */}
            <div className={s.hero}>
                <div className={s.heroHeader}>
                    <div className={s.heroEyebrow} />
                    <div className={s.heroTitle} />
                    <div className={s.heroSubtitle} />
                </div>
                <div className={s.searchCard}>
                    <div className={s.searchHeader}>
                        <div className={s.searchLabel} />
                        <div className={s.searchMeta} />
                    </div>
                    <div className={s.searchField} />
                    <div className={s.searchHint} />
                </div>
            </div>

            {/* List skeleton */}
            <div className={s.list}>
                <div className={s.formCard}>
                    <div className={s.formHeader}>
                        <div className={s.formTitle} />
                        <div className={s.formPill} />
                    </div>
                    <div className={s.formHelper} />
                    <div className={s.formField}>
                        <div className={s.formLabel} />
                        <div className={s.formInput} />
                    </div>
                    <div className={s.formField}>
                        <div className={s.formLabel} />
                        <div className={s.formInput} />
                    </div>
                    <div className={s.formSubmit} />
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={s.card}>
                        <div className={s.cardImage} />
                        <div className={s.cardContent}>
                            <div className={s.cardTitle} />
                            <div className={s.cardMeta} />
                            <div className={s.cardDescription} />
                            <div className={s.cardDetails} />
                            <div className={s.cardActions}>
                                <div className={s.cardActionBtn} />
                                <div className={s.cardActionBtn} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className={s.pagination}>
                <div className={s.paginationControls}>
                    <div className={s.pageBtn} />
                    <div className={s.pageBtn} />
                    <div className={s.pageBtn} />
                    <div className={s.pageEllipsis} />
                    <div className={s.pageBtn} />
                </div>
                <div className={s.paginationMeta}>
                    <div className={s.pageSizeLabel} />
                    <div className={s.pageSizeSelect} />
                </div>
            </div>
        </section>
    )
}
