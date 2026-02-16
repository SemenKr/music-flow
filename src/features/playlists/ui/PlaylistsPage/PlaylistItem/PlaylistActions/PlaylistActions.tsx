import {useDeletePlaylistMutation} from '@/features/playlists/api/playlistsApi';
import s from './PlaylistActions.module.css'

type Props = {
    playlistId: string
    onEdit: () => void
}



export const PlaylistActions = ({playlistId, onEdit}: Props) => {
    const [deletePlaylist] = useDeletePlaylistMutation()
    return (
        <div className={s.actions}>
            <button onClick={onEdit}>Update</button>
            <button onClick={() => deletePlaylist(playlistId)}>Delete</button>
        </div>
    )
}
