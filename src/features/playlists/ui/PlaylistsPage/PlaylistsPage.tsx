import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi';
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
    const {data, error, isLoading} = useFetchPlaylistsQuery({})
    return (
        <section className={s.page}>
            <header className={s.hero}>
                <div>
                    <p className={s.eyebrow}>Discover</p>
                    <h1 className={s.title}>Playlists</h1>
                    <p className={s.subtitle}>
                        Fresh mixes, smart curation, and the perfect soundtrack for any moment.
                    </p>
                </div>
                <div className={s.heroBadge}>
                    <span className={s.badgeLabel}>Weekly picks</span>
                    <span className={s.badgeValue}>12</span>
                </div>
            </header>

            {isLoading && <div className={s.state}>Loading playlists…</div>}
            {error && <div className={s.stateError}>Could not load playlists. Try again.</div>}

            {!isLoading && !error && (
                <div className={s.grid}>
                    {data?.data.map((playlist, index) => {
                        const cover = playlist.attributes.images?.main?.[0]?.url
                        const title = playlist.attributes.title
                        const initial = title?.[0]?.toUpperCase() ?? '?'
                        return (
                            <article
                                className={s.card}
                                key={playlist.id}
                                style={{animationDelay: `${index * 60}ms`}}
                            >
                                <div
                                    className={s.cover}
                                    style={cover ? {backgroundImage: `url(${cover})`} : undefined}
                                >
                                    {!cover && <span className={s.coverFallback}>{initial}</span>}
                                </div>
                                <div className={s.cardBody}>
                                    <h2 className={s.cardTitle}>{title}</h2>
                                    <p className={s.cardMeta}>by {playlist.attributes.user.name}</p>
                                    <p className={s.cardDesc}>
                                        {playlist.attributes.description || 'No description yet.'}
                                    </p>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
