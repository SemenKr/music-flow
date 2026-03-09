import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi'
import type { CreatePlaylistFormValues } from '@/features/playlists/api/playlistsApi.types'
import { createPlaylistSchema } from '@/features/playlists/model/playlists.schemas'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {toast} from 'react-toastify';
import s from './CreatePlaylistForm.module.css'

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistFormValues>({
    resolver: zodResolver(createPlaylistSchema),
  })
  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistFormValues> = data => {
    createPlaylist({
      data: {
        type: 'playlists',
        attributes: data,
      },
    })
      .unwrap()
      .then(() => {
        reset()
      })
      .catch(error => {
        console.error('Failed to create playlist:', error)
        // Можно показать toast с ошибкой
          toast('Failed to create playlist:', error)
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
        <label className={s.label} htmlFor="playlist-title">
          Title
        </label>
        <input
          id="playlist-title"
          className={`${s.input} ${errors.title ? s.inputError : ''}`}
          {...register('title')}
          placeholder="Midnight focus"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'playlist-title-error' : undefined}
        />
        {errors.title && (
          <span className={s.error} id="playlist-title-error">
            {errors.title.message}
          </span>
        )}
      </div>
      <div className={s.field}>
        <label className={s.label} htmlFor="playlist-description">
          Description
        </label>
        <input
          id="playlist-description"
          className={`${s.input} ${errors.description ? s.inputError : ''}`}
          {...register('description')}
          placeholder="Warm synths and slow beats."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'playlist-description-error' : undefined}
        />
        {errors.description && (
          <span className={s.error} id="playlist-description-error">
            {errors.description.message}
          </span>
        )}
      </div>
      <button disabled={isLoading} className={s.submit} type="submit">
        Create playlist
      </button>
    </form>
  )
}
