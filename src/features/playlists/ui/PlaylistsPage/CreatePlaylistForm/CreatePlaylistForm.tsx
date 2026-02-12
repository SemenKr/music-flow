import {useCreatePlaylistMutation} from '@/features/playlists/api/playlistsApi';
import type {CreatePlaylistFormValues} from '@/features/playlists/api/playlistsApi.types';
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from './CreatePlaylistForm.module.css';

export const CreatePlaylistForm = () => {
    const {register, handleSubmit, reset} = useForm<CreatePlaylistFormValues>()
    const [createPlaylist, {isLoading}] = useCreatePlaylistMutation()

    const onSubmit: SubmitHandler<CreatePlaylistFormValues> = data => {
        createPlaylist({
            data: {
                type: 'playlists',
                attributes: data
            }
        })
            .unwrap()
            .then(() => {
                reset()
            })
            .catch((error) => {
                console.error('Failed to create playlist:', error)
                // Можно показать toast с ошибкой
            })
    }

    return (
        <form className={s.formCard} onSubmit={handleSubmit(onSubmit)}>
            <div className={s.header}>
                <h2 className={s.title}>Create playlist</h2>
                <span className={s.pill}>New</span>
            </div>
            <p className={s.helper}>Craft a vibe and share it instantly.</p>
            <div className={s.field}>
                <label className={s.label} htmlFor="playlist-title">Title</label>
                <input
                    id="playlist-title"
                    className={s.input}
                    {...register('title')}
                    placeholder="Midnight focus"
                />
            </div>
            <div className={s.field}>
                <label className={s.label} htmlFor="playlist-description">Description</label>
                <input
                    id="playlist-description"
                    className={s.input}
                    {...register('description')}
                    placeholder="Warm synths and slow beats."
                />
            </div>
            <button disabled={isLoading} className={s.submit} type="submit">Create playlist</button>
        </form>
    )
}
