import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import Actions from "../actions";
import { prisma } from "../utils/prisma";

/**
 * Command for selecting notion database
 */
export const select: Middleware<SlackCommandMiddlewareArgs, StringIndexed> =
  async function ({ body, ack, client, command, respond, context }) {
    await ack();

    client.chat.postEphemeral({
      channel: body.user_id,
      user: body.user_id,
      text: "All your notion data has been removed",

      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Pick an item from the dropdown list",
          },
          accessory: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an item",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-1",
              },
              {
                text: {
                  type: "plain_text",
                  text: "*this is plain_text text*",
                  emoji: true,
                },
                value: "value-2",
              },
            ],
            action_id: Actions.select_db,
          },
        },
      ],
      type: "home",
    });
  };
