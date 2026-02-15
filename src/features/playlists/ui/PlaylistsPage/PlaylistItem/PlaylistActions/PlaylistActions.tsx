import s from './PlaylistActions.module.css'

type Props = {
    playlistId: string
    onEdit: () => void
    onDelete: (playlistId: string) => void
}

export const PlaylistActions = ({playlistId, onEdit, onDelete}: Props) => (
    <div className={s.actions}>
        <button onClick={onEdit}>Update</button>
        <button onClick={() => onDelete(playlistId)}>Delete</button>
    </div>
)
