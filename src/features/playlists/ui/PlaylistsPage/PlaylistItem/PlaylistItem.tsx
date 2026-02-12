import type { PlaylistData, UpdatePlaylistMutationArgs } from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm';
import s from '../PlaylistsPage.module.css'

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
    const cover = playlist.attributes.images?.main?.[0]?.url
    const title = playlist.attributes.title
    const initial = title[0]?.toUpperCase() ?? '?'

    return (
        <article className={s.card}>
            <div
                className={s.cover}
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            >
                {!cover && <span className={s.coverFallback}>{initial}</span>}
            </div>

            <div className={s.cardBody}>
                {isEditing ? (
                    <EditPlaylistForm
                        playlist={playlist}
                        onCancel={onCancelEdit}
                        onUpdate={onUpdate}
                    />
                ) : (
                    <>
                        <h2>{title}</h2>
                        <p>
                            by {playlist.attributes.user.name} •{' '}
                            {playlist.attributes.tracksCount} tracks
                        </p>

                        <div className={s.actions}>
                            <button onClick={onEdit}>Update</button>
                            <button onClick={() => onDelete(playlist.id)}>Delete</button>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
}
