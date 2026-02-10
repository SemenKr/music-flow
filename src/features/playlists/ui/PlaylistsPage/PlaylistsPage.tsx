import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from '@/features/playlists/api/playlistsApi'
import { CreatePlaylistForm } from './CreatePlaylistForm/CreatePlaylistForm'
import { PlaylistItem } from './PlaylistItem/PlaylistItem'
import { useState } from 'react'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
    const { data, error, isLoading } = useFetchPlaylistsQuery({})
    const [deletePlaylist] = useDeletePlaylistMutation()
    const [updatePlaylist] = useUpdatePlaylistMutation()

    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isLoading) return <div className={s.state}>Loading playlists…</div>
    if (error) return <div className={s.stateError}>Could not load playlists.</div>

    return (
        <section className={s.page}>
            <header className={s.hero}>…</header>

            <div className={s.grid}>
                <div className={s.formCard}>
                    <CreatePlaylistForm />
                </div>

                {data?.data.map(playlist => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        isEditing={editingPlaylistId === playlist.id}
                        onEdit={() => setEditingPlaylistId(playlist.id)}
                        onCancelEdit={() => setEditingPlaylistId(null)}
                        onDelete={() => deletePlaylist(playlist.id)}
                        onUpdate={updatePlaylist}
                    />
                ))}
            </div>
        </section>
    )
}
