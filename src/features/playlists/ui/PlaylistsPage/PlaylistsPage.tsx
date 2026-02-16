import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi'
import {useState} from 'react'
import {CreatePlaylistForm} from './CreatePlaylistForm/CreatePlaylistForm'
import {PlaylistItem} from './PlaylistItem/PlaylistItem'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
    const [search, setSearch] = useState('')
    const { data, error, isLoading } = useFetchPlaylistsQuery({ search })


    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isLoading) return <div className={s.state}>Loading playlists…</div>
    if (error) return <div className={s.stateError}>Could not load playlists.</div>

    return (
        <section className={s.page}>
            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={e => setSearch(e.currentTarget.value)}
            />
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
