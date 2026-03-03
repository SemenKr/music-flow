import { LinearProgress } from '@/common/components'
import { useTheme } from '@/common/hooks/useTheme'
import { Path } from '@/common/routing'
import { useGetMeQuery, useLogoutMutation } from '@/features/auth/api/authApi'
import { AuthActionButton } from '@/features/auth/ui/AuthActionButton/AuthActionButton'
import { Login } from '@/features/auth/ui/Login/Login'
import { NavLink } from 'react-router'
import s from './Header.module.css'

type Props = {
  showProgress?: boolean
}

const navItems = [
  { to: Path.Main, label: 'Main' },
  { to: Path.Playlists, label: 'Playlists' },
  { to: Path.Tracks, label: 'Tracks' },
  { to: Path.Profile, label: 'Profile' },
]

export const Header = ({ showProgress }: Props) => {
  const { preference, resolvedTheme, toggleTheme } = useTheme()
  const { data } = useGetMeQuery()
  const [logout] = useLogoutMutation()

  const logoutHandler = () => logout()

  return (
    <header className={s.header}>
      <div className={s.container}>
        <nav className={s.nav}>
          <ul className={s.list}>
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `${s.link} ${isActive ? s.activeLink : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={s.actions}>
            {data && data.login && <span className={s.userName}>{data.login}</span>}
            {data && (
              <AuthActionButton
                label="logout"
                ariaLabel="Log out"
                variant="logout"
                onClick={logoutHandler}
              />
            )}
            {!data && <Login />}
            <button
              type="button"
              className={s.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              aria-pressed={resolvedTheme === 'dark'}
              data-theme={resolvedTheme}
              title={
                preference === 'system'
                  ? `Theme: ${resolvedTheme} (system)`
                  : `Theme: ${resolvedTheme}`
              }
            >
              <span className={s.toggleTrack} aria-hidden="true">
                <span className={s.toggleThumb} />
                <span className={s.toggleIcon} data-icon="sun" />
                <span className={s.toggleIcon} data-icon="moon" />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {showProgress && <LinearProgress className={s.progress} />}
    </header>
  )
}
