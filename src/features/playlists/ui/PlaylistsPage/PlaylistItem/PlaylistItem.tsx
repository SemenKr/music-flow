import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm';
import defaultCover from '@/assets/images/default-playlist-cover.png'
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
    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const title = playlist.attributes.title
    const src = originalCover ? originalCover?.url : defaultCover
    const description = playlist.attributes.description

    return (
        <article className={s.card}>
            <img src={src} alt={'cover'} className={s.cover}/>
            <div className={s.cardBody}>
                {isEditing ? (
                    <EditPlaylistForm
                        playlist={playlist}
                        onCancel={onCancelEdit}
                        onUpdate={onUpdate}
                    />
                ) : (
                    <>
                        <h3>{title}</h3>
                        {description && <span>{description}</span>}
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
