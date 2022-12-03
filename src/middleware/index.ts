import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { env } from "../core/env";
import { NotionLoginStatePayload } from "../types";
import { db, dbv2 } from "../utils/db";

const app_mention: Middleware<
  SlackEventMiddlewareArgs<"app_mention">,
  StringIndexed
> = async ({ event, next, context, client }) => {
  const authRes = await checkAuth(
    { user: event.user, channel: event.channel, thread_ts: event.thread_ts },
    client
  );
  if (authRes?.notion_access_token) {
    context.notion_access_token = authRes.notion_access_token;
    context.notion_database_id = authRes.notion_database_id;
    return next();
  }
  return;
};

export const middleware = {
  app_mention,
};

const checkAuth = async function (
  { user = "", thread_ts = "", channel = "" },
  client: WebClient
) {
  const notionMetadata = await dbv2.getUser(user);

  if (notionMetadata?.notion_access_token) {
    return {
      notion_access_token: notionMetadata.notion_access_token,
      notion_database_id: notionMetadata.notion_database_id,
    };
  }

  const payload: NotionLoginStatePayload = {
    u: user,
    t: thread_ts,
    c: channel,
  };
  const redirectURL = new URL(env.auth_base_url!);
  redirectURL.searchParams.set("client_id", env.auth_client_id!);
  redirectURL.searchParams.set("redirect_uri", env.base_url + "/redirect");
  redirectURL.searchParams.set("response_type", "code");
  redirectURL.searchParams.set(
    "state",
    Buffer.from(JSON.stringify(payload)).toString("base64")
  );

  client.chat.postEphemeral({
    channel: user,
    user,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey <@${user}> :wave:,\nThanks for the using Notion Sync! You need to login with Notion first.`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Login to Notion",
              emoji: true,
            },
            url: redirectURL.toString(),
          },
        ],
      },
    ],
  });
};
