import {useUploadPlaylistCoverMutation} from '@/features/playlists/api/playlistsApi';
import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm';
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type {ChangeEvent} from 'react';
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

    const [uploadCover] = useUploadPlaylistCoverMutation()

    const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 1024 * 1024 // 1 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = event.target.files?.length && event.target.files[0]
        if (!file) return

        if (!allowedTypes.includes(file.type)) {
            alert('Only JPEG, PNG or GIF images are allowed')
            return
        }

        if (file.size > maxSize) {
            alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
            return
        }

        uploadCover({ playlistId: playlist.id, file })
    }

    return (
        <article className={s.card}>
            <img src={src} alt={'cover'} className={s.cover}/>
            <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler} />
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
