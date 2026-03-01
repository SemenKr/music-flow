import { LinearProgress } from '@/common/components'
import { useTheme } from '@/common/hooks/useTheme'
import { Path } from '@/common/routing'
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

  return (
    <header className={s.header}>
      <div className={s.container}>
        <nav className={s.nav}>
          <ul className={s.list}>
            {navItems.map((item) => (
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
        </nav>
      </div>

      {showProgress && <LinearProgress className={s.progress} />}
    </header>
  )
}
