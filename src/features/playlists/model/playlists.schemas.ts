import { currentUserReactionSchema, imagesSchema, tagSchema, userSchema } from '@/common/schemas'
import z from 'zod'

export const createPlaylistSchema = z.object({
  title: z
    .string()
    .min(1, 'The title length must be more than 1 character')
    .max(100, 'The title length must be less than 100 characters'),
  description: z.string().max(1000, 'The description length must be less than 1000 characters.'),
})

export const createPlaylistRequestSchema = z.object({
  data: z.object({
    type: z.literal('playlists'),
    attributes: createPlaylistSchema,
  }),
})

export const playlistMetaSchema = z.object({
  page: z.int().nonnegative(),
  pageSize: z.int().positive(),
  totalCount: z.int().nonnegative(),
  pagesCount: z.int().nonnegative(),
})

export const playlistAttributesSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  addedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  order: z.int(),
  dislikesCount: z.int().nonnegative(),
  likesCount: z.int().nonnegative(),
  tracksCount: z.int().nonnegative(),
  tags: z.array(tagSchema),
  images: imagesSchema,
  user: userSchema,
  currentUserReaction: currentUserReactionSchema,
})

export const playlistDataSchema = z.object({
  id: z.string(),
  type: z.literal('playlists'),
  attributes: playlistAttributesSchema,
})

export const playlistsResponseSchema = z.object({
  data: z.array(playlistDataSchema),
  meta: playlistMetaSchema,
})
export const updatePlaylistSchema = z.object({
  data: z.object({
    type: z.literal('playlists'),
    attributes: z.object({
      title: z.string(),
      description: z.string(),
      tagIds: z.array(z.string()),
    }),
  }),
})
export const playlistCreateResponseScheme = z.object({
  data: playlistDataSchema,
})

export const playlistImageProcessedEventSchema = z.object({
  type: z.literal('tracks.playlist-image-processed'),
  payload: z.object({
    itemId: z.string(), // id плейлиста
    images: imagesSchema, // используем общую схему изображений
  }),
})
