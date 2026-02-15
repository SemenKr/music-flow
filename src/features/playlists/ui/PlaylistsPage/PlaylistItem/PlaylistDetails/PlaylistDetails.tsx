import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types'
import {useMemo} from 'react'
import s from './PlaylistDetails.module.css'

type Props = {
    playlist: PlaylistData
}

export const PlaylistDetails = ({playlist}: Props) => {
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
        <details className={s.details}>
            <summary className={s.summary}>Details</summary>
            <div className={s.body}>
                <p className={s.meta}>Added: {addedAt}</p>
                <p className={s.meta}>Updated: {updatedAt}</p>
                <p className={s.meta}>Order: {playlist.attributes.order}</p>
                <p className={s.meta}>
                    Reactions: +{playlist.attributes.likesCount} / -{playlist.attributes.dislikesCount}
                </p>
                {tags && <p className={s.meta}>Tags: {tags}</p>}
                <p className={s.meta}>ID: {playlist.id}</p>
            </div>
        </details>
    )
}
