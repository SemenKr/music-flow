import type {PlaylistData, UpdatePlaylistMutationArgs} from '@/features/playlists/api/playlistsApi.types'
import {type SubmitHandler, useForm} from 'react-hook-form'
import s from '../PlaylistsPage.module.css'

type UpdatePlaylistFormValues = {
    title: string
    description: string
}

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
    const { register, handleSubmit, reset } =
        useForm<UpdatePlaylistFormValues>({
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
        }).then(onCancelEdit)
    }

    const cover = playlist.attributes.images?.main?.[0]?.url
    const title = playlist.attributes.title
    const initial = title[0]?.toUpperCase() ?? '?'

    return (
        <article className={s.card}>
            <div
                className={s.cover}
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            >
                {!cover && <span className={s.coverFallback}>{initial}</span>}
            </div>

            <div className={s.cardBody}>
                {isEditing ? (
                    <form
                        className={s.editForm}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <input {...register('title')} />
                        <input {...register('description')} />

                        <div className={s.actions}>
                            <button type="submit">Save</button>
                            <button type="button" onClick={onCancelEdit}>
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h2>{title}</h2>
                        <p>
                            by {playlist.attributes.user.name} •{' '}
                            {playlist.attributes.tracksCount} tracks
                        </p>

                        <div className={s.actions}>
                            <button onClick={() => {
                                reset()
                                onEdit()
                            }}>
                                Update
                            </button>
                            <button onClick={() => onDelete(playlist.id)}>Delete</button>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
}
