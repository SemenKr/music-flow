import {getPaginationPages} from '@/common/utils';
import {PaginationControls} from './PaginationControls'
import {PaginationMeta} from './PaginationMeta'
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
            <PaginationControls
                pages={pages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <PaginationMeta
                pageSize={pageSize}
                onPageSizeChange={changePageSize}
            />
        </div>
    )
}
