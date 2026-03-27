import { imagesSchema } from '@/common/schemas'
import { playlistDataSchema } from './playlists.schemas'
import z from 'zod'

export const playlistCreatedEventSchema = z.object({
  type: z.literal('tracks.playlist-created'),
  payload: z.object({
    data: playlistDataSchema,
  }),
})

export const playlistUpdatedEventSchema = z.object({
  type: z.literal('tracks.playlist-updated'),
  payload: z.object({
    data: playlistDataSchema,
  }),
})

export const playlistImageProcessedEventSchema = z.object({
  type: z.literal('tracks.playlist-image-processed'),
  payload: z.object({
    itemId: z.string(),
    images: imagesSchema,
  }),
})
