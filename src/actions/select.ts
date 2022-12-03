import {
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";

export const select: Middleware<
  SlackActionMiddlewareArgs<SlackAction>,
  StringIndexed
> = async ({ ack }) => {
  await ack();
  // Update the message to reflect the action
};
