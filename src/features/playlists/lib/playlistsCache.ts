import type {
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistData,
  PlaylistImageProcessedEvent,
  PlaylistsResponse,
  PlaylistUpdatedEvent,
} from '@/features/playlists/api/playlistsApi.types'

type PlaylistDraft = PlaylistsResponse
type PlaylistUpdateAttributes = {
  title: string
  description: string
}

export type PlaylistsCacheRecipe = (state: PlaylistDraft) => void

const matchesQueryUser = (queryArgs: FetchPlaylistsArgs, playlist: PlaylistData) => {
  return !queryArgs.userId || playlist.attributes.user.id === queryArgs.userId
}

export const applyPlaylistCreated =
  (queryArgs: FetchPlaylistsArgs, event: PlaylistCreatedEvent): PlaylistsCacheRecipe =>
  (state: PlaylistDraft) => {
    const newPlaylist = event.payload.data

    if (!matchesQueryUser(queryArgs, newPlaylist)) {
      return
    }

    state.data.pop()
    state.data.unshift(newPlaylist)
    state.meta.totalCount += 1
    state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
  }

export const applyPlaylistImageProcessed =
  (event: PlaylistImageProcessedEvent): PlaylistsCacheRecipe =>
  (state: PlaylistDraft) => {
    const { itemId, images } = event.payload
    const playlist = state.data.find(item => item.id === itemId)

    if (!playlist) {
      return
    }

    playlist.attributes.images = images
  }

export const applyPlaylistUpdated =
  (event: PlaylistUpdatedEvent): PlaylistsCacheRecipe =>
  (state: PlaylistDraft) => {
    const updatedPlaylist = event.payload.data
    const index = state.data.findIndex(item => item.id === updatedPlaylist.id)

    if (index === -1) {
      return
    }

    state.data[index] = { ...state.data[index], ...updatedPlaylist }
  }

export const applyPlaylistOptimisticUpdate =
  (playlistId: string, attributes: PlaylistUpdateAttributes): PlaylistsCacheRecipe =>
  (state: PlaylistDraft) => {
    const currentPlaylist = state.data.find(item => item.id === playlistId)

    if (!currentPlaylist) {
      return
    }

    currentPlaylist.attributes.title = attributes.title
    currentPlaylist.attributes.description = attributes.description
  }
