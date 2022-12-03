import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { NotionClient } from "../utils/notion";

export const app_mention: Middleware<
  SlackEventMiddlewareArgs<"app_mention">,
  StringIndexed
> = async ({ event, context, client, say }) => {
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

  const threadChat = await client.conversations.replies({
    ts: thread_ts,
    channel,
  });
  const notion = new NotionClient(context.notion.access_token);

  notion.pages.create({
    parent: { database_id: context.notion.workspace_id },
    properties: {
      ID: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: "username",
            },
          },
        ],
      },
    },
  });

  client.chat.postEphemeral({
    channel,
    thread_ts,
    user,
    text: `Saved ${
      threadChat.messages!.length
    } messages to Notion. here is the link https://notion.so/arpit`,
  });

  // await say({
  //   thread_ts,
  //   text:
  //     "Here is summary of chat\n ```" +
  //     threadChat.messages?.map((e) => e.text).join("\n") +
  //     "```",
  // });
};
