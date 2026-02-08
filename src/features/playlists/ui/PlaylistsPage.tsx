import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi';

export const PlaylistsPage = () => {
    const res = useFetchPlaylistsQuery({})
    console.log(res)
    return (
        <div>
            <h1>Playlists page</h1>
        </div>
    )
}
