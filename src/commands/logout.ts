import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { prisma } from "../utils/prisma";

export const logout: Middleware<SlackCommandMiddlewareArgs, StringIndexed> =
  async function ({ body, ack, client }) {
    await ack();

    await prisma.deleteUser(body.user_id);

    await client.chat.postEphemeral({
      channel: body.channel_id || body.user_id,
      user: body.user_id,
      text: "Logout done! All your notion auth data has been removed",
    });
  };
