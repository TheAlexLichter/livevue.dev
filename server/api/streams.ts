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

  // TODO: Clean up - too redundant
  const tagsToFilterFor = !tag
    ? [["vue"], ["nuxt"], ["vue.js"], ["nuxt.js"], ["vuejs"], ["nuxtjs"]]
    : [[tag], [tag + ".js"], [tag + "js"]];

  const streams = await fetchStreams(GAME_IDS.SOFTWARE_AND_GAME_DEVELOPMENT);
  const filteredStreams = filterStreams(streams, tagsToFilterFor);
  return filteredStreams;

  // BONUS:
  // * Filters (e.g. language)
  // * History
  // * Caching / SWR
  // * Consider pagination
  // * "Ban / Remove list" -> People that just use tags which don't really describe their stream
  // * Voting System / Favorites
  // Later on: "Gamification"/"Streaks"/"Top X %"
  // Later on: "Schedule" - either via Twitch OR via submission
});

function filterStreams(streams: Stream[], query: string[][]) {
  return streams.filter((stream) => {
    let streamTags = stream.tags.map((tag) => tag.toLowerCase());
    return query.some((tags) => {
      return tags.every((tag) => streamTags.includes(tag));
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
