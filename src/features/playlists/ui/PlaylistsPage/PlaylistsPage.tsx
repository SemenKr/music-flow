import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from '@/features/playlists/api/playlistsApi';
import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types';
import {CreatePlaylistForm} from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm';
import {useState} from 'react';
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from './PlaylistsPage.module.css'

type UpdatePlaylistFormValues = {
    title: string
    description: string
}

export const PlaylistsPage = () => {
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [editingTagIds, setEditingTagIds] = useState<string[]>([])
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistFormValues>()

    const {data, error, isLoading} = useFetchPlaylistsQuery({})
    const [deletePlaylist] = useDeletePlaylistMutation()
    const [updatePlaylist] = useUpdatePlaylistMutation()
    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm('Are you sure you want to delete the playlist?')) {
            deletePlaylist(playlistId)
        }
    }
    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setPlaylistId(playlist.id)
            setEditingTagIds(playlist.attributes.tags.map(tag => tag.id))
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
            })
        } else {
            setPlaylistId(null)
            setEditingTagIds([])
            reset({ title: '', description: '' })
        }
    }
    const onSubmit: SubmitHandler<UpdatePlaylistFormValues> = data => {
        if (!playlistId) return
        updatePlaylist({
            playlistId,
            body: {
                data: {
                    type: 'playlists',
                    attributes: {
                        title: data.title,
                        description: data.description,
                        tagIds: editingTagIds,
                    }
                }
            }
        }).then(() => {
            setPlaylistId(null)
            setEditingTagIds([])
        })
    }



    return (
        <section className={s.page}>
            <header className={s.hero}>
                <div>
                    <p className={s.eyebrow}>Discover</p>
                    <h1 className={s.title}>Playlists</h1>
                    <p className={s.subtitle}>
                        Fresh mixes, smart curation, and the perfect soundtrack for any moment.
                    </p>
                </div>
                <div className={s.heroBadge}>
                    <span className={s.badgeLabel}>Weekly picks</span>
                    <span className={s.badgeValue}>12</span>
                </div>
            </header>

            {isLoading && <div className={s.state}>Loading playlists…</div>}
            {error && <div className={s.stateError}>Could not load playlists. Try again.</div>}

            {!isLoading && !error && (
                <div className={s.grid}>
                    <div className={s.formCard}>
                        <CreatePlaylistForm/>
                    </div>
                    {data?.data.map((playlist, index) => {
                        const cover = playlist.attributes.images?.main?.[0]?.url
                        const title = playlist.attributes.title
                        const initial = title?.[0]?.toUpperCase() ?? '?'
                        const isEditing = playlistId === playlist.id
                        return (
                            <article
                                className={s.card}
                                key={playlist.id}
                                style={{animationDelay: `${index * 60}ms`}}
                            >
                                <div
                                    className={s.cover}
                                    style={cover ? {backgroundImage: `url(${cover})`} : undefined}
                                >
                                    {!cover && <span className={s.coverFallback}>{initial}</span>}
                                </div>
                                <div className={s.cardBody}>
                                    {isEditing ? (
                                        <form className={s.editForm} onSubmit={handleSubmit(onSubmit)}>
                                            <h2 className={s.cardTitle}>Edit playlist</h2>
                                            <input
                                                className={s.editInput}
                                                {...register('title')}
                                                placeholder="Title"
                                            />
                                            <input
                                                className={s.editInput}
                                                {...register('description')}
                                                placeholder="Description"
                                            />
                                            <div className={s.cardActions}>
                                                <button className={s.updateButton} type="submit">
                                                    Save
                                                </button>
                                                <button
                                                    className={s.deleteButton}
                                                    type="button"
                                                    onClick={() => editPlaylistHandler(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <h2 className={s.cardTitle}>{title}</h2>
                                            <p className={s.cardMeta}>
                                                by {playlist.attributes.user.name} • {playlist.attributes.tracksCount} tracks
                                            </p>
                                            <div className={s.cardActions}>
                                                <button
                                                    className={s.updateButton}
                                                    type="button"
                                                    onClick={() => editPlaylistHandler(playlist)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className={s.deleteButton}
                                                    type="button"
                                                    onClick={() => deletePlaylistHandler(playlist.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
