import type {ChangeEventHandler} from 'react'
import s from './PlaylistCover.module.css'

type Props = {
    src: string
    title: string
    hasOriginalCover: boolean
    onUploadCover: ChangeEventHandler<HTMLInputElement>
    onDeleteCover: () => void
}

export const PlaylistCover = ({
    src,
    title,
    hasOriginalCover,
    onUploadCover,
    onDeleteCover
}: Props) => {
    return (
        <>
            <div className={s.coverWrapper}>
                <img
                    src={src}
                    alt={`${title} playlist cover`}
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
                    onChange={onUploadCover}
                />
                {hasOriginalCover && (
                    <button className={s.coverButton} type="button" onClick={onDeleteCover}>
                        delete cover
                    </button>
                )}
            </div>
        </>
    )
}
