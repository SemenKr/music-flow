import { MainPage } from '@/app/ui/MainPage'
import { PageNotFound } from '@/common/components'
import { OAuthCallback, ProfilePage } from '@/features/auth'
import { PlaylistsPage } from '@/features/playlists'
import { TracksPage } from '@/features/tracks'
import { Route, Routes } from 'react-router'
import { Path } from './path'

export const AppRouter = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
