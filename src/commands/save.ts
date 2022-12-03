import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { prisma } from "../utils/prisma";

export const save: Middleware<SlackCommandMiddlewareArgs, StringIndexed> =
  async function ({ body, ack, client, command, respond }) {
    await ack();

    await prisma.deleteUser(body.user_id);

    client.chat.postEphemeral({
      channel: body.user_id,
      user: body.user_id,
      text: "All your notion data has been removed",
    });
  };
