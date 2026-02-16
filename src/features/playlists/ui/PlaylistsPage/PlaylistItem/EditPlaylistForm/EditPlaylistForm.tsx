import {useUpdatePlaylistMutation} from '@/features/playlists/api/playlistsApi';
import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types'
import {type SubmitHandler, useForm} from 'react-hook-form'
import s from './EditPlaylistForm.module.css'

type UpdatePlaylistFormValues = {
    title: string
    description: string
}

type Props = {
    playlist: PlaylistData
    onCancel: () => void
}

export const EditPlaylistForm = ({ playlist, onCancel }: Props) => {
    const [updatePlaylist] = useUpdatePlaylistMutation()
    const { register, handleSubmit } = useForm<UpdatePlaylistFormValues>({
        defaultValues: {
            title: playlist.attributes.title,
            description: playlist.attributes.description ?? ''
        }
    })

    const onSubmit: SubmitHandler<UpdatePlaylistFormValues> = data => {
        updatePlaylist({
            playlistId: playlist.id,
            body: {
                data: {
                    type: 'playlists',
                    attributes: {
                        title: data.title,
                        description: data.description,
                        tagIds: playlist.attributes.tags.map(t => t.id)
                    }
                }
            }
        }).then(onCancel)
    }

    return (
        <form className={s.editForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={s.inputs}>
                <input {...register('title')} placeholder="Playlist title" />
                <input {...register('description')} placeholder="Description" />
            </div>
            <div className={s.actions}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    )
}
