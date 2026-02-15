import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {EditPlaylistForm} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/EditPlaylistForm/EditPlaylistForm';
import {PlaylistCover} from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover';
import {useMemo} from 'react';
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


    const title = playlist.attributes.title
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
