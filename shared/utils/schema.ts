import { array, boolean, literal, number, object, type InferOutput, string, optional } from "valibot"

export const STREAM_SCHEMA = object({
  /** @description An ID that identifies the stream. You can use this ID later to look up the video on demand (VOD). */
  id: string(),
  /** @description The ID of the user that’s broadcasting the stream. */
  user_id: string(),
  /** @description The user’s login name. */
  user_login: string(),
  /** @description The user’s display name. */
  user_name: string(),
  /** @description The ID of the category or game being played. */
  game_id: string(),
  /** @description The ID of the category or game being played. */
  game_name: string(),
  /**
   * @description The type of stream. Possible values are:
   *
   * * live
   *
   * If an error occurs, this field is set to an empty string.
   * @enum {string}
   */
  type: literal('live'),
  /** @description The stream’s title. Is an empty string if not set. */
  title: string(),
  /**
   * Format: int32
   * @description The number of users watching the stream.
   */
  viewer_count: number(),
  /**
   * Format: date-time
   * @description The UTC date and time (in RFC3339 format) of when the broadcast began.
   */
  started_at: string(),
  /** @description The language that the stream uses. This is an ISO 639-1 two-letter language code or _other_ if the stream uses a language not in the list of [supported stream languages](https://help.twitch.tv/s/article/languages-on-twitch#streamlang). */
  language: string(),
  /** @description A URL to an image of a frame from the last 5 minutes of the stream. Replace the width and height placeholders in the URL (`{width}x{height}`) with the size of the image you want, in pixels. */
  thumbnail_url: string(),
  /**
   * @deprecated
   * @description **IMPORTANT** As of February 28, 2023, this field is deprecated and returns only an empty array. If you use this field, please update your code to use the `tags` field.
   *
   * The list of tags that apply to the stream. The list contains IDs only when the channel is steaming live. For a list of possible tags, see [List of All Tags](https://www.twitch.tv/directory/all/tags). The list doesn’t include Category Tags.
   */
  tag_ids: array(string()),
  /** @description The tags applied to the stream. */
  tags: array(string()),
  /** @description A Boolean value that indicates whether the stream is meant for mature audiences. */
  is_mature: boolean()
})

export const STREAMS_SCHEMA = object({
  data: array(STREAM_SCHEMA),
  pagination: object({
    cursor: optional(string())
  })
})

export type Stream = InferOutput<typeof STREAM_SCHEMA>