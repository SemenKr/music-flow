import { imagesSchema } from '@/common/schemas'
import {
  createPlaylistSchema,
  createPlaylistRequestSchema,
  playlistAttributesSchema,
  playlistDataSchema,
  type playlistMetaSchema,
  playlistsResponseSchema,
  updatePlaylistSchema,
} from '@/features/playlists/model/playlists.schemas'
import z from 'zod'

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>
export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>
export type PlaylistData = z.infer<typeof playlistDataSchema>
export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>
export type UpdatePlaylistArgs = z.infer<typeof updatePlaylistSchema>
export type CreatePlaylistFormValues = z.infer<typeof createPlaylistSchema>
export type PlaylistImageProcessedEvent = z.infer<typeof playlistImageProcessedEventSchema>

// Arguments
export type FetchPlaylistsArgs = {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: 'addedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[]
  userId?: string
  trackId?: string
}

export type CreatePlaylistArgs = z.infer<typeof createPlaylistRequestSchema>
// WebSocket Events
export type PlaylistCreatedEvent = {
  type: 'tracks.playlist-created'
  payload: {
    data: PlaylistData
  }
}
export type PlaylistUpdatedEvent = {
  type: 'tracks.playlist-updated'
  payload: {
    data: PlaylistData
  }
}
export const playlistImageProcessedEventSchema = z.object({
  type: z.literal('tracks.playlist-image-processed'),
  payload: z.object({
    itemId: z.string(), // id плейлиста
    images: imagesSchema, // используем общую схему изображений
  }),
})
