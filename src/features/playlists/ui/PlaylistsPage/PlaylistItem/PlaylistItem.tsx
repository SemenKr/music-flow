import defaultCover from '@/assets/images/default-playlist-cover.png'
import {useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation} from '@/features/playlists/api/playlistsApi';
import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm';
import {type ChangeEvent, useMemo} from 'react';
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
    const mediumCover = playlist.attributes.images.main?.find(img => img.type === 'medium')
    const thumbnailCover = playlist.attributes.images.main?.find(img => img.type === 'thumbnail')
    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')
    const title = playlist.attributes.title
    const src = mediumCover?.url ?? thumbnailCover?.url ?? originalCover?.url ?? defaultCover
    const description = playlist.attributes.description
    const addedAt = useMemo(
        () => new Date(playlist.attributes.addedAt).toLocaleDateString(),
        [playlist.attributes.addedAt]
    )
    const updatedAt = useMemo(
        () => new Date(playlist.attributes.updatedAt).toLocaleDateString(),
        [playlist.attributes.updatedAt]
    )
    const tags = playlist.attributes.tags?.join(', ')

    const [uploadCover] = useUploadPlaylistCoverMutation()
    const [deleteCover] = useDeletePlaylistCoverMutation()

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

        uploadCover({playlistId: playlist.id, file})
    }

    const deleteCoverHandler = () => {
        deleteCover({ playlistId: playlist.id })
    }

    return (
        <article className={s.card}>
            <div className={s.coverWrapper}>
                <img
                    src={src}
                    alt={title}
                    className={s.cover}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className={s.coverControls}>
                <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadCoverHandler}/>
                {originalCover && <button onClick={() => deleteCoverHandler()}>delete cover</button>}
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
                        <h3 className={s.cardTitle}>{title}</h3>
                        {description && <p className={s.cardDesc}>{description}</p>}
                        <p className={s.cardMeta}>
                            by {playlist.attributes.user.name} •{' '}
                            {playlist.attributes.tracksCount} tracks
                        </p>
                        <details className={s.details}>
                            <summary className={s.detailsSummary}>Details</summary>
                            <div className={s.detailsBody}>
                                <p className={s.cardMeta}>Added: {addedAt}</p>
                                <p className={s.cardMeta}>Updated: {updatedAt}</p>
                                <p className={s.cardMeta}>Order: {playlist.attributes.order}</p>
                                <p className={s.cardMeta}>
                                    Reactions: +{playlist.attributes.likesCount} / -{playlist.attributes.dislikesCount}
                                </p>
                                {tags && <p className={s.cardMeta}>Tags: {tags}</p>}
                                <p className={s.cardMeta}>ID: {playlist.id}</p>
                            </div>
                        </details>

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
