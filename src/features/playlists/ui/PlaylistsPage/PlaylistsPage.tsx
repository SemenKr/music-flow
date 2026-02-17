import {Pagination} from '@/common/components/Pagination/Pagination';
import {useDebounceValue} from '@/common/hooks';
import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi'
import {useState} from 'react'
import {PlaylistSearch} from './PlaylistSearch/PlaylistSearch'
import {PlaylistsList} from './PlaylistsList/PlaylistsList'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const debounceSearch = useDebounceValue(search)
    const { data, error, isLoading } = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize,
    })

    const totalCount = data?.meta?.totalCount ?? 0
    const shownCount = data?.data.length ?? 0

    const changePageSizeHandler = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }
    if (error) return <div className={s.stateError}>Could not load playlists.</div>

    return (
        <section className={s.page}>
            <div className={s.hero}>
                <div className={s.heroHeader}>
                    <p className={s.eyebrow}>Library</p>
                    <h1 className={s.title}>Playlists</h1>
                    <p className={s.subtitle}>Search by title and keep your mixes organized.</p>
                </div>
                <div className={s.searchSlot}>
                    <PlaylistSearch
                        value={search}
                        onChange={setSearch}
                        resultsCount={shownCount}
                        totalCount={totalCount}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading} />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={data?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={changePageSizeHandler}
            />
        </section>
    )
}
