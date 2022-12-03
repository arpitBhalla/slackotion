import {
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { prisma } from "../utils/prisma";

export const select: Middleware<
  SlackActionMiddlewareArgs<SlackAction>,
  StringIndexed
> = async ({ ack, body, respond, action }) => {
  await ack();
  console.log(body, action);
  // Update the message to reflect the action

  if (action.type !== "static_select") {
    return;
  }
  const user = await prisma.getUser(body.user.id);
  const newDB = action.selected_option.value;
  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      notion_database_id: newDB,
    },
  });

  await respond("Database updated!");
};
