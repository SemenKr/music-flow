import type { TrackData } from '@/features/tracks/api/tracksApi.types'
import s from './TracksList.module.css'

type TracksListProps = {
    tracks: TrackData[]
}

export const TracksList = ({ tracks }: TracksListProps) => {
    return (
        <div className={s.list}>
            {tracks.map(track => {
                const { title, user, attachments } = track.attributes

                return (
                    <article key={track.id} className={s.item}>
                        <div className={s.itemInfo}>
                            <p className={s.itemTitle}>Title: {title}</p>
                            <p className={s.itemArtist}>Name: {user.name}</p>
                        </div>

                        {/* 🎵 Если есть аудио-файл — показываем плеер */}
                        {attachments.length
                            ? <audio className={s.audio} controls src={attachments[0].url} />
                            : <span className={s.noFile}>No file</span>}
                    </article>
                )
            })}
        </div>
    )
}
