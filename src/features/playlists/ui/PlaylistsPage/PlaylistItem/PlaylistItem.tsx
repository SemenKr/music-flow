import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm'
import {PlaylistActions} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistActions/PlaylistActions'
import {PlaylistCover} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover'
import {PlaylistDetails} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistDetails/PlaylistDetails'
import {PlaylistSummary} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistSummary/PlaylistSummary'
import s from './PlaylistItem.module.css'

type Props = {
    playlist: PlaylistData
    isEditing: boolean
    onEdit: () => void
    onCancelEdit: () => void
    onDelete: (playlistId: string) => void
    onUpdate: (args: UpdatePlaylistMutationArgs) => Promise<unknown>
}

export const PlaylistItem = ({
                                 playlist,
                                 isEditing,
                                 onEdit,
                                 onCancelEdit,
                                 onDelete,
                                 onUpdate
                             }: Props) => {
    return (
        <article className={s.card}>
            <PlaylistCover
                playlist={playlist}
            />
            <div className={s.cardBody}>
                {isEditing ? (
                    <EditPlaylistForm
                        playlist={playlist}
                        onCancel={onCancelEdit}
                        onUpdate={onUpdate}
                    />
                ) : (
                    <>
                        <PlaylistSummary playlist={playlist} />
                        <PlaylistDetails playlist={playlist} />
                        <PlaylistActions
                            playlistId={playlist.id}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </>
                )}
            </div>
        </article>
    )
}
