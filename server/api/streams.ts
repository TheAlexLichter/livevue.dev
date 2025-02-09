import { H3Event, EventHandlerRequest } from "h3";
import { literal, object, optional, parse, safeParse, union } from "valibot";

const GAME_IDS = {
  SOFTWARE_AND_GAME_DEVELOPMENT: "1469308723",
};

const TAG_SCHEMA = object({
  tag: optional(union([literal("vue"), literal("nuxt")])),
});
export default defineEventHandler(async (event) => {
  const { tag } = await getValidatedQuery(event, (data) =>
    parse(TAG_SCHEMA, data)
  );

  const ALL_TAGS = [["vue"], ["nuxt"], ["vue.js"], ["nuxt.js"], ["vuejs"], ["nuxtjs"]]

  // TODO: Clean up - too redundant
  const tagsToFilterFor = !tag
    ? ALL_TAGS
    : [[tag], [tag + ".js"], [tag + "js"]];

    const fetchCachedStreams = defineCachedFunction(
    async (_event: H3Event, id?: string) => {
      const streams = await fetchStreams(id)
      return filterStreams(streams, ALL_TAGS);
    }, {
      staleMaxAge: 60 * 30, // After 30 min, ignore the SWR result and fetch again
      maxAge: 10,
      swr: true,
      name: 'twitch-streams',
  })

  const streams = await fetchCachedStreams(event, GAME_IDS.SOFTWARE_AND_GAME_DEVELOPMENT);
  const filteredStreams = filterStreams(streams, tagsToFilterFor);


  return filteredStreams;

  // BONUS:
  // * Filters (e.g. language)
  // * History
  // * Consider pagination
  // * "Ban / Remove list" -> People that just use tags which don't really describe their stream
  // * Voting System / Favorites
  // Later on: "Gamification"/"Streaks"/"Top X %"
  // Later on: "Schedule" - either via Twitch OR via submission
});

/**
 * @param query - Multi-dimensional array of tags to filter for. First level is OR, second level is AND
 */
function filterStreams(streams: Stream[], query: string[][]) {
  return streams.filter((stream) => {
    const streamTags = stream.tags.map((tag) => tag.toLowerCase());
    const streamTitle = stream.title.toLowerCase();
    return query.some((tags) => {
      return tags.every((tag) => streamTitle.includes(tag) || streamTags.includes(tag));
    });
  });
}

async function fetchStreams(id?: string) {
  const { clientId, clientSecret } = useRuntimeConfig().twitch;

  const accessToken = await getAccessToken({ clientId, clientSecret });

  let nextCursor: string | undefined = undefined;
  const streams: Stream[] = [];
  do {
    const result = await fetchStream({
      id: id!,
      clientId,
      accessToken,
      cursor: nextCursor,
    });

    streams.push(...result.data);
    nextCursor = result.pagination.cursor;
  } while (nextCursor);

  return streams;
}

type FetchStreamParams = {
  id: string;
  clientId: string;
  accessToken: string;
  cursor?: string;
};

async function fetchStream({
  id,
  clientId,
  accessToken,
  cursor,
}: FetchStreamParams) {
  const baseURL = "https://api.twitch.tv/helix/streams";
  const rawResult = await $fetch(baseURL, {
    query: {
      game_id: id,
      first: 100,
      after: cursor,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  });

  const parsedResult = safeParse(STREAMS_SCHEMA, rawResult);
  if (!parsedResult.success) {
    console.log(parsedResult.issues);
    throw createError({
      status: 500,
      message: "Error parsing streams",
    });
  }

  return parsedResult.output;
}

type GetAccessTokenParams = {
  clientId: string;
  clientSecret: string;
};

async function getAccessToken({
  clientId,
  clientSecret,
}: GetAccessTokenParams): Promise<string> {
  const body = new FormData();
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);
  body.append("grant_type", "client_credentials");

  try {
    const result = await $fetch<any>("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body,
    });

    // TODO: Parsing
    return result.access_token as string;
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      message: "Error getting access token",
    });
  }
}
