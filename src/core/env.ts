import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  isDebug: process.env.DEBUG ?? false,

  base_url: process.env.DEPLOY_URL,
  port: process.env.PORT ?? "8080",

  slack_bot_token: process.env.SLACK_BOT_TOKEN,

  slack_signing_secret: process.env.SLACK_SIGNING_SECRET,
  slack_app_token: process.env.SLACK_APP_TOKEN,

  slack_client_id: process.env.SLACK_CLIENT_ID,
  slack_client_secret: process.env.SLACK_CLIENT_SECRET,

  notion_auth_base_url: process.env.NOTION_AUTH_BASE_URL,
  notion_client_id: process.env.NOTION_CLIENT_ID,
  notion_client_secret: process.env.NOTION_CLIENT_SECRET,
};
