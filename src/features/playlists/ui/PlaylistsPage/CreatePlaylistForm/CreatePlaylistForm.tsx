import type {CreatePlaylistArgs} from '@/features/playlists/api/playlistsApi.types';
import {type SubmitHandler, useForm} from 'react-hook-form';
import s from './CreatePlaylistForm.module.css';

export const CreatePlaylistForm = () => {
    const { register, handleSubmit } = useForm<CreatePlaylistArgs>()

    const onSubmit: SubmitHandler<CreatePlaylistArgs> = data => {
        console.log(data)
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
            <button className={s.submit} type="submit">Create playlist</button>
        </form>
    )
}
