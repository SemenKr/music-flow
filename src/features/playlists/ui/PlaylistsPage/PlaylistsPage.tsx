import {LinearProgress, Pagination} from '@/common/components';
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

    const { data, error, isLoading, isFetching } = useFetchPlaylistsQuery(
        {
            search: debounceSearch, // 🔎 Строка поиска (debounced, чтобы не отправлять запрос на каждый ввод)
            pageNumber: currentPage, // 📄 Текущая страница пагинации
            pageSize, // 📦 Количество элементов на странице
        },
        {
            refetchOnFocus: true, // 🔄 Автоматически повторять запрос при возврате фокуса на вкладку
            // pollingInterval: 3000, // ⏱ Выполнять автоматический опрос (polling) каждые 3000 мс (3 секунды)
            skipPollingIfUnfocused: true, // 👀 Приостанавливать polling, если вкладка браузера не в фокусе
        }
    )
    const totalCount = data?.meta?.totalCount ?? 0 // 📊 Общее количество плейлистов (из метаданных ответа)
    const shownCount = data?.data.length ?? 0 // 📄 Количество плейлистов, отображаемых на текущей странице

    const changePageSizeHandler = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    const searchPlayListHandler = (value: string) => {
        setSearch(value)
        setCurrentPage(1)
    }
    if (error) return <div className={s.stateError}>Could not load playlists.</div>
    if (isLoading) return <h1>Skeleton loader...</h1>
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
            {isFetching && <LinearProgress />}
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
