import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  isDebug: process.env.DEBUG ?? false,
  port: process.env.PORT ?? "",
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,

  base_url: process.env.DEPLOY_URL,

  auth_base_url: process.env.AUTH_BASE_URL,
  auth_client_id: process.env.AUTH_CLIENT_ID,
  auth_client_secret: process.env.AUTH_CLIENT_SECRET,
};
