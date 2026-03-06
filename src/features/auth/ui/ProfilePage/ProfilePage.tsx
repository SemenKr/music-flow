import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi'
import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList'
import s from './ProfilePage.module.css'

export const ProfilePage = () => {
  const { data: meResponse } = useGetMeQuery()
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
    userId: meResponse?.userId,
  })
  const playlistsCount = playlistsResponse?.meta?.totalCount ?? 0
  const profileTitle = meResponse?.login ?? 'Profile'

  return (
    <section className={s.page}>
      <header className={s.header}>
        <div className={s.headerInfo}>
          <p className={s.kicker}>Profile</p>
          <h1 className={s.title}>{profileTitle}</h1>
          <p className={s.subtitle}>Manage your playlists and create new mixes.</p>
        </div>
        <div className={s.stats}>
          <div className={s.statCard}>
            <span className={s.statValue}>{playlistsCount}</span>
            <span className={s.statLabel}>Playlists</span>
          </div>
        </div>
      </header>
      <div className={s.content}>
        <div className={s.formSection}>
          <CreatePlaylistForm />
        </div>
        <div className={s.listArea}>
          <PlaylistsList
            playlists={playlistsResponse?.data || []}
            isPlaylistsLoading={isLoading}
            currentUserId={meResponse?.userId}
          />
        </div>
      </div>
    </section>
  )
}
