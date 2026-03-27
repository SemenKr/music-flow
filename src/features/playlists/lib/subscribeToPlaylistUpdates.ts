import { SOCKET_EVENTS } from '@/common/constants'
import { subscribeToEvent } from '@/common/socket/subscribeToEvent'
import type {
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistImageProcessedEvent,
  PlaylistUpdatedEvent,
  PlaylistsResponse,
} from '@/features/playlists/api/playlistsApi.types'
import {
  applyPlaylistCreated,
  applyPlaylistImageProcessed,
  applyPlaylistUpdated,
} from './playlistsCache'

type UpdateCachedData = (recipe: (state: PlaylistsResponse) => void) => void

export const subscribeToPlaylistUpdates = (
  queryArgs: FetchPlaylistsArgs,
  updateCachedData: UpdateCachedData,
) => {
  const unsubscribes = [
    subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, message => {
      updateCachedData(applyPlaylistCreated(queryArgs, message))
    }),
    subscribeToEvent<PlaylistImageProcessedEvent>(SOCKET_EVENTS.PLAYLIST_IMAGE_PROCESSED, message => {
      updateCachedData(applyPlaylistImageProcessed(message))
    }),
    subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, message => {
      updateCachedData(applyPlaylistUpdated(message))
    }),
  ]

  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe())
  }
}
