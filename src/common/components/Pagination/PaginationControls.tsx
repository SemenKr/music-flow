import s from './PaginationControls.module.css'

type PageItem = number | '...'

type Props = {
    pages: PageItem[]
    currentPage: number
    onPageChange: (page: number) => void
}

export const PaginationControls = ({
    pages,
    currentPage,
    onPageChange,
}: Props) => {
    return (
        <div className={s.pagination}>
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span className={s.ellipsis} key={`ellipsis-${idx}`}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={
                            page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton
                        }
                        onClick={() => page !== currentPage && onPageChange(page)}
                        disabled={page === currentPage}
                        type="button"
                    >
                        {page}
                    </button>
                )
            )}
        </div>
    )
}
