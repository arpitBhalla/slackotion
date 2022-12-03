import { Middleware, AnyMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { env } from "../core/env";
import { prisma } from "../utils/prisma";
import { app } from "../index";
import { WebClient } from "@slack/web-api";

export const globalMiddleware: Middleware<
  AnyMiddlewareArgs,
  StringIndexed
> = async ({ next, body, context, client, payload, ack }) => {
  // @ts-ignore
  const user_id =
    body.user?.id ||
    // @ts-ignore
    body.user_id ||
    body.user ||
    // @ts-ignore
    payload.user_id ||
    // @ts-ignore
    payload.user;

  const user = await prisma.getUser(user_id);

  if (!user) {
    await ack?.();
    await sendLoginLink(user_id, client);
    return;
  }
  context.notion_access_token = user?.notion_access_token!;
  context.notion_database_id = user?.notion_database_id!;
  next();
};

const sendLoginLink = async function (user_id: string, client: WebClient) {
  const payload = { u: user_id };
  const redirectURL = new URL(env.notion_auth_base_url!);
  redirectURL.searchParams.set("client_id", env.notion_client_id!);
  redirectURL.searchParams.set(
    "redirect_uri",
    env.base_url + "/redirect-notion"
  );
  redirectURL.searchParams.set("response_type", "code");
  redirectURL.searchParams.set(
    "state",
    Buffer.from(JSON.stringify(payload)).toString("base64")
  );

  await client.chat.postEphemeral({
    channel: user_id,
    user: user_id,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey <@${user_id}> :wave:,\nThanks for the using Notion Sync! You need to login with Notion first.`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "approve_button",
            value: "demo",
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
