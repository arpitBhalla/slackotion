import { AllMiddlewareArgs, AnyMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { env } from "../core/env";
import { MiddlewareBody, StatePayload } from "../types";
import { db } from "../utils/db";

export const auth_middleware = async function ({
  body,
  client,
  context,
  next,
}: AnyMiddlewareArgs & AllMiddlewareArgs<StringIndexed>): Promise<void> {
  const { event } = body as unknown as MiddlewareBody;

  const { user, channel, thread_ts } = event;

  if (!user) return;

  const notionMetadata = db.get(user);

  if (notionMetadata?.access_token) {
    context.notion_access_token = notionMetadata.access_token;
    context.notion_database_id = notionMetadata.database_id;

    return next();
  }
  const payload: StatePayload = { u: user, t: thread_ts, c: channel };
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
