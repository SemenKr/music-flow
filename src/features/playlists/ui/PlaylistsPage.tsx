import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi';

export const PlaylistsPage = () => {
    const {data} = useFetchPlaylistsQuery({})
    console.log(data)
    return (
        <div>
            <h1>Playlists page</h1>
            <p>
                {data?.data.map((playlist) => {
                    return <div key={playlist.id}>
                        {playlist.attributes.title}
                    </div>
                })}
            </p>
        </div>
    )
}
