import {useDebounceValue} from '@/common/hooks';
import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi'
import {useState} from 'react'
import {CreatePlaylistForm} from './CreatePlaylistForm/CreatePlaylistForm'
import {PlaylistSearch} from './PlaylistSearch/PlaylistSearch'
import {PlaylistItem} from './PlaylistItem/PlaylistItem'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
    const [search, setSearch] = useState('')
    const debounceSearch = useDebounceValue(search)
    const { data, error, isLoading } = useFetchPlaylistsQuery({ search: debounceSearch })

    const totalCount = data?.meta?.totalCount ?? 0
    const shownCount = data?.data.length ?? 0

    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isLoading) return <div className={s.state}>Loading playlists…</div>
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
            <div className={s.grid}>
                <div className={s.formCard}>
                    <CreatePlaylistForm />
                </div>
                {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
                {data?.data.map(playlist => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        isEditing={editingPlaylistId === playlist.id}
                        onEdit={() => setEditingPlaylistId(playlist.id)}
                        onCancelEdit={() => setEditingPlaylistId(null)}
                    />
                ))}
            </div>
        </section>
    )
}
