import {PlaylistSearch} from '../PlaylistSearch/PlaylistSearch'
import s from './PlaylistsHero.module.css'

type Props = {
    search: string
    onSearchChange: (value: string) => void
    resultsCount: number
    totalCount: number
    isLoading: boolean
}

export const PlaylistsHero = ({
    search,
    onSearchChange,
    resultsCount,
    totalCount,
    isLoading,
}: Props) => {
    return (
        <div className={s.hero}>
            <div className={s.heroHeader}>
                <p className={s.eyebrow}>Library</p>
                <h1 className={s.title}>Playlists</h1>
                <p className={s.subtitle}>Search by title and keep your mixes organized.</p>
            </div>
            <div className={s.searchSlot}>
                <PlaylistSearch
                    value={search}
                    onChange={onSearchChange}
                    resultsCount={resultsCount}
                    totalCount={totalCount}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
