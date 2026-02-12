import type { PlaylistData, UpdatePlaylistMutationArgs } from '@/features/playlists/api/playlistsApi.types'
import { useForm, type SubmitHandler } from 'react-hook-form'
import s from '../../PlaylistsPage.module.css'

type UpdatePlaylistFormValues = {
    title: string
    description: string
}

type Props = {
    playlist: PlaylistData
    onCancel: () => void
    onUpdate: (args: UpdatePlaylistMutationArgs) => Promise<unknown>
}

export const EditPlaylistForm = ({ playlist, onCancel, onUpdate }: Props) => {
    const { register, handleSubmit } = useForm<UpdatePlaylistFormValues>({
        defaultValues: {
            title: playlist.attributes.title,
            description: playlist.attributes.description ?? ''
        }
    })

    const onSubmit: SubmitHandler<UpdatePlaylistFormValues> = data => {
        onUpdate({
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
            <input {...register('title')} placeholder="Playlist title" />
            <input {...register('description')} placeholder="Description" />

            <div className={s.actions}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    )
}
