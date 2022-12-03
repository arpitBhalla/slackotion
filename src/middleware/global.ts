import { Middleware, AnyMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { prisma } from "../utils/prisma";

export const globalMiddleware: Middleware<
  AnyMiddlewareArgs,
  StringIndexed
> = async ({ next, body, context }) => {
  const user = await prisma.getUser(body.user);

  context.notion_access_token = user?.notion_access_token!;
  context.notion_database_id = user?.notion_database_id!;
  next();
};
