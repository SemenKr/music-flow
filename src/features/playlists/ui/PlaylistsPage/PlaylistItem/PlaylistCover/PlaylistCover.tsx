import {useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation} from '@/features/playlists/api/playlistsApi';
import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types';
import {type ChangeEvent} from 'react'
import {toast} from 'react-toastify';
import s from './PlaylistCover.module.css'
import defaultCover from '@/assets/images/default-playlist-cover.png'


type Props = {
    playlist: PlaylistData
}

export const PlaylistCover = ({playlist}: Props) => {

    const [uploadCover] = useUploadPlaylistCoverMutation()
    const [deleteCover] = useDeletePlaylistCoverMutation()

    const deleteCoverHandler = () => {
        deleteCover({playlistId: playlist.id})
    }

    const originalCover = playlist.attributes.images.main?.find(img => img.type === 'original')

    const mediumCover = playlist.attributes.images.main?.find(img => img.type === 'medium')
    const thumbnailCover = playlist.attributes.images.main?.find(img => img.type === 'thumbnail')
    const src = mediumCover?.url ?? thumbnailCover?.url ?? originalCover?.url ?? defaultCover
    const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 1024 * 1024 // 1 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = event.target.files?.length && event.target.files[0]
        if (!file) return

        if (!allowedTypes.includes(file.type)) {
            toast('Only JPEG, PNG or GIF images are allowed', { type: 'error', theme: 'colored' })
        }

        if (file.size > maxSize) {

            toast(`The file is too large (max. ${Math.round(maxSize / 1024)} KB)`, {
                type: 'error',
                theme: 'colored',
            })
        }

        uploadCover({playlistId: playlist.id, file})
        event.target.value = ''
    }

    return (
        <>
            <div className={s.coverWrapper}>
                <img
                    src={src}
                    alt={`${playlist.attributes.title} playlist cover`}
                    className={s.cover}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className={s.coverControls}>
                <input
                    className={s.fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={uploadCoverHandler}
                />
                {originalCover && (
                    <button className={s.coverButton} type="button" onClick={deleteCoverHandler}>
                        delete cover
                    </button>
                )}
            </div>
        </>
    )
}
