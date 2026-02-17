import {Pagination} from '@/common/components/Pagination/Pagination';
import {useDebounceValue} from '@/common/hooks';
import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi'
import {useState} from 'react'
import {PlaylistsHero} from './PlaylistsHero/PlaylistsHero'
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

    const searchPlayListHandler = (value: string) => {
        setSearch(value)
        setCurrentPage(1)
    }
    if (error) return <div className={s.stateError}>Could not load playlists.</div>

    return (
        <section className={s.page}>
            <PlaylistsHero
                search={search}
                onSearchChange={searchPlayListHandler}
                resultsCount={shownCount}
                totalCount={totalCount}
                isLoading={isLoading}
            />
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
