import {getPaginationPages} from '@/common/utils';
import s from './Pagination.module.css'

type Props = {
    currentPage: number
    setCurrentPage: (page: number) => void
    pagesCount: number
    pageSize: number
    changePageSize: (size: number) => void
}

export const Pagination = (
    {
        currentPage,
        setCurrentPage,
        pagesCount,
        pageSize,
        changePageSize,
    }: Props) => {
    if (pagesCount <= 1) return null

    const pages = getPaginationPages(currentPage, pagesCount)

    return (
        <div className={s.paginationBar}>
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
                                onClick={() => page !== currentPage && setCurrentPage(Number(page))}
                                disabled={page === currentPage}
                                type="button"
                            >
                                {page}
                            </button>
                        )
                )}
            </div>
            <div className={s.paginationMeta}>
                <label className={s.pageSizeLabel}>
                    Show
                    <select
                        className={s.pageSizeSelect}
                        value={pageSize}
                        onChange={e => changePageSize(Number(e.target.value))}
                    >
                        {[3, 5, 7, 15, 33].map(size => (
                            <option value={size} key={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    per page
                </label>
            </div>
        </div>
    )
}
