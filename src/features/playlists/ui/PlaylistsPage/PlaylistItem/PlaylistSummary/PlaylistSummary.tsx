import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types'
import s from './PlaylistSummary.module.css'

type Props = {
  playlist: PlaylistData
}

export const PlaylistSummary = ({ playlist }: Props) => {
  const title = playlist.attributes.title
  const description = playlist.attributes.description

  return (
    <>
      <h3 className={s.title}>{title}</h3>
      <p className={s.desc}>description: {description}</p>
      {description && <p className={s.desc}>description: {description}</p>}
      <p className={s.meta}>
        by {playlist.attributes.user.name} • {playlist.attributes.tracksCount} tracks
      </p>
    </>
  )
}
