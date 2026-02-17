import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types'
import {useState} from 'react'
import {CreatePlaylistForm} from '../CreatePlaylistForm/CreatePlaylistForm'
import {PlaylistItem} from '../PlaylistItem/PlaylistItem'
import s from './PlaylistsList.module.css'

type Props = {
    playlists: PlaylistData[]
    isPlaylistsLoading: boolean
}

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isPlaylistsLoading) {
        return <div className={s.state}>Loading playlists…</div>
    }

    return (
        <div className={s.grid}>
            <div className={s.formCard}>
                <CreatePlaylistForm />
            </div>
            {!playlists.length && <h2 className={s.empty}>Playlists not found</h2>}
            {playlists.map(playlist => (
                <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    isEditing={editingPlaylistId === playlist.id}
                    onEdit={() => setEditingPlaylistId(playlist.id)}
                    onCancelEdit={() => setEditingPlaylistId(null)}
                />
            ))}
        </div>
    )
}
