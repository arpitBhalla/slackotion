import { App, LogLevel } from "@slack/bolt";
import { env } from "./core";

const dbData: Record<string, string> = {};
const db = {
  set(key = "", value = "") {
    dbData[key] = value;
  },
  get(key = "") {
    return dbData[key];
  },
};

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
  customRoutes: [
    {
      path: "/login",
      method: ["GET"],
      handler(req, res) {
        console.log("/login");
        res.statusCode = 302;
        const url = new URL(env.base_url + req.url!);
        const user = url.searchParams.get("user")!;
        res.setHeader(
          "location",
          `${env.base_url}/redirect?user=${user}&notionToken=myFakeToken`
        );
        res.end();
      },
    },
    {
      path: "/redirect",
      method: ["GET"],
      handler(req, res) {
        console.log("/redirect");

        const url = new URL(env.base_url + req.url!);
        const user = url.searchParams.get("user")!;
        console.log("user", user);
        const notionToken = url.searchParams.get("notionToken")!;
        db.set(user, notionToken);

        res.end("done");
      },
    },
  ],
});

(async () => await app.start(env.port).then(() => console.log("Started")))();

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

  if (!context.isLogin) {
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
              url: `${env.base_url}/login?user=${user}`,
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

app.use(async function ({ context, next, body, client }) {
  // @ts-ignore
  const userId = body.event.user;

  console.log(dbData);

  const notionToken = db.get(userId);

  context.notionToken = notionToken;
  context.isLogin = !!notionToken;

  next();
});
