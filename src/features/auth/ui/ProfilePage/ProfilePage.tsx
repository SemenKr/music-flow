import { Path } from '@/common/routing'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi'
import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList'
import { PlaylistsPageSkeleton } from '@/features/playlists/ui/PlaylistsPage/PlaylistsPageSkeleton/PlaylistsPageSkeleton'
import { Navigate } from 'react-router'
import s from './ProfilePage.module.css'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery(undefined)
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  )
  const playlistsCount = playlistsResponse?.meta?.totalCount ?? 0
  const profileTitle = meResponse?.login ?? 'Profile'

  if (isLoading || isMeLoading) return <PlaylistsPageSkeleton />

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

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
            isPlaylistsLoading={isLoading || isMeLoading}
            currentUserId={meResponse?.userId}
          />
        </div>
      </div>
    </section>
  )
}
