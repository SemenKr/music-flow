import { NavLink } from 'react-router'
import { Path } from '@/common/routing/Routing'
import s from './Header.module.css'

const navItems = [
    { to: Path.Main, label: 'Main' },
    { to: Path.Playlists, label: 'Playlists' },
    { to: Path.Tracks, label: 'Tracks' },
    { to: Path.Profile, label: 'Profile' },
]

export const Header = () => {
    return (
        <header className={s.container}>
            <nav className={s.nav}>
                <ul className={s.list}>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `${s.link} ${isActive ? s.activeLink : ''}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}
