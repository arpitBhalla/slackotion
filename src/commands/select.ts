import {
  Middleware,
  PlainTextOption,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import Actions from "../actions";
import { NotionClient } from "../utils/notion";
import { prisma } from "../utils/prisma";

/**
 * Command for selecting notion database
 */
export const select: Middleware<SlackCommandMiddlewareArgs, StringIndexed> =
  async function ({ body, ack, client, command, respond, context }) {
    await ack();

    const user = await prisma.getUser(body.user_id);

    const notion = new NotionClient(user?.notion_access_token!);
    const { results } = await notion.getUserAllDB();

    const options = results
      .map((result) => {
        if (result.object === "database")
          return {
            text: {
              type: "plain_text",
              //@ts-ignore
              text: result.title?.[0]?.plain_text ?? "demo",
              emoji: true,
            },
            value: result.id,
          };
      })
      .filter(Boolean) as PlainTextOption[];
    await client.chat.postEphemeral({
      channel: body.channel_id || body.user_id,
      user: body.user_id,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Pick a Notion database from the dropdown list",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true,
              },
              options,
              action_id: Actions.select_db,
            },
          ],
        },
      ],
      type: "home",
    });
  };
