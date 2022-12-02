import { App, LogLevel, AppMentionEvent } from "@slack/bolt";
import { env } from "./core";
import fs from "fs";

declare module "@slack/bolt" {
  interface Context {
    notionToken: string;
    isLogin: boolean;
  }
}

const app = new App({
  token: env.token,
  appToken: env.appToken,
  signingSecret: env.signingSecret,
  logLevel: env.isDebug ? LogLevel.DEBUG : LogLevel.ERROR,
});

(async () => await app.start(env.port).then(() => console.log("Started")))();

let isLoggedIn = false;

const isLogin = (user: AppMentionEvent["user"]) => isLoggedIn;

app.event("app_mention", async ({ event, context, client, say }) => {
  const { user, channel, thread_ts } = event;
  console.log("Mentioned");

  if (!thread_ts) {
    client.chat.postEphemeral({
      text: "Hey, I work only for threads",
      channel,
      user: user!,
    });
    return;
  }
  if (context.isLogin) {
    client.chat.postEphemeral({
      channel,
      thread_ts,
      user: event.user!,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Thanks for the using Notion Sync <@${user}>! You need to login with Notion first.`,
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
              url: "https://www.notion.so/login",
              //   action_id: "login_with_notion",
              //   value: "done",
            },
          ],
        },
      ],
    });
    return;
  }

  const threadChat = await client.conversations.replies({
    ts: thread_ts!,
    channel,
  });
  client.chat.postEphemeral({
    channel,
    thread_ts,
    user: user!,
    text: `Saved ${
      threadChat.messages!.length
    } messages to Notion. here is the link https://notion.so/arpit`,
  });

  await say({
    thread_ts,
    text:
      "Here is summary of chat\n ```" +
      threadChat.messages?.map((e) => e.text).join("\n") +
      "```",
  });
});

app.use(async function ({ context, next, body }) {
  const userId = body.user;

  console.log(userId);
  context.notionToken = "demo_token";
  context.isLogin = true;

  next();
});
