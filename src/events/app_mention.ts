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
  const notion = new NotionClient(context.notion_access_token);

  await notion.createNotionPage(
    context.notion_database_id,
    threadChat.messages![0].text!,
    threadChat.messages
      ?.map((m) => `[${m.ts}] ${m.user} : ${m.text}`)
      .join("\n")!
  );

  client.chat.postEphemeral({
    channel,
    thread_ts,
    user,
    text: `Saved ${threadChat.messages!.length} messages to Notion`,
  });
};
