import {Header} from '@/common/components';
import {Routing} from '@/common/routing';
import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi';
import s from './App.module.css'

function App() {
    const { data, error, isLoading } = useFetchPlaylistsQuery({})
    console.log({ data, error, isLoading })
    return (
        <>
            <Header/>
            <main className={s.layout}>
                <Routing />

            </main>
        </>
    )
}

export default App
