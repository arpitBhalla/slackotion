import { App, LogLevel } from "@slack/bolt";
import axios from "axios";
import { env } from "./core";
// import https from 'https'

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
    // {
    //   path: "/login",
    //   method: ["GET"],
    //   handler(req, res) {
    //     console.log(req.url);
    //     const user = new URLSearchParams(req.url?.split("?")[1]).get("user");
    //     if (!user) return res.end("Invalid User");
    //     const redirectURL = new URL(env.auth_base_url!);
    //     redirectURL.searchParams.set("client_id", env.auth_client_id!);
    //     redirectURL.searchParams.set(
    //       "redirect_uri",
    //       env.base_url + "/redirect"
    //     );
    //     redirectURL.searchParams.set("response_type", "code");
    //     redirectURL.searchParams.set("state", user);

    //     res.statusCode = 302;
    //     res.setHeader("location", redirectURL.href);
    //     res.end();
    //   },
    // },
    {
      path: "/redirect",
      method: ["GET"],
      async handler(req, res) {
        const params = new URLSearchParams(req.url?.split("?")[1]);
        console.log("/redirect", params);

        const state = JSON.parse(params.get("state") ?? "");
        const code = params.get("code")!;

        const notionTokenResponse = await axios
          .post(
            "https://api.notion.com/v1/oauth/token",
            {
              code,
              redirect_uri: env.base_url + "/redirect",
              grant_type: "authorization_code",
            },
            {
              // responseType: "arraybuffer",
              responseEncoding: "utf8",
              responseType: "json",
              // responseEncoding: "binary",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  "Basic " +
                  Buffer.from(
                    `${env.auth_client_id}:${env.auth_client_secret}`
                  ).toString("base64"),
              },
            }
          )
          .catch((e) => e);

        if (notionTokenResponse.data)
          await app.client.chat.postEphemeral({
            text: "Login done, you can use the app now",
            thread_ts: state.t,
            channel: state.c,
            user: state.u,
          });

        // const decoder = new TextDecoder("ISO-8859-1");
        // let html = decoder.decode(notionTokenResponse.data);

        console.log(notionTokenResponse);

        // db.set(state.u, notionTokenResponse as string);
        console.log(dbData);

        res.end("done");
      },
    },
  ],
});

(async () => await app.start(env.port).then(() => console.log("Started")))();

app.event("app_mention", async ({ event, context, client, say }) => {
  const { user, channel, thread_ts } = event;
  console.log("Mentioned by", user);

  if (!user) return;
  if (!thread_ts) {
    client.chat.postEphemeral({
      text: "Hey, I work only for threads",
      channel,
      user,
    });
    return;
  }

  if (!context.isLogin) {
    const redirectURL = new URL(env.auth_base_url!);
    redirectURL.searchParams.set("client_id", env.auth_client_id!);
    redirectURL.searchParams.set("redirect_uri", env.base_url + "/redirect");
    redirectURL.searchParams.set("response_type", "code");
    redirectURL.searchParams.set(
      "state",
      JSON.stringify({ u: user, t: thread_ts, c: channel })
    );
    client.chat.postEphemeral({
      channel,
      thread_ts,
      user,
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
              url: redirectURL.toString(),
            },
          ],
        },
      ],
    });
    return;
  }

  const threadChat = await client.conversations.replies({
    ts: thread_ts,
    channel,
  });
  client.chat.postEphemeral({
    channel,
    thread_ts,
    user,
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
