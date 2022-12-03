import { App, LogLevel } from "@slack/bolt";
import { env } from "./core/env";
import Actions, * as actions from "./actions";
import { app_mention } from "./events/app_mention";
import { middleware } from "./middleware";
import { globalMiddleware } from "./middleware/global";
import { notionRedirectHandler } from "./routes/redirect-notion";
import Commands, * as commands from "./commands";

import { SlackInstallationStore } from "./utils/slack-installation";

export const app = new App({
  appToken: env.slack_app_token,
  signingSecret: env.slack_signing_secret,
  clientId: env.slack_client_id,
  clientSecret: env.slack_client_secret,
  scopes: ["app_mentions:read", "channels:history", "chat:write"],
  logLevel: env.isDebug ? LogLevel.DEBUG : LogLevel.ERROR,
  stateSecret: "",
  installationStore: new SlackInstallationStore(),
  installerOptions: { directInstall: true, stateVerification: false },
  customRoutes: [
    {
      handler(req, res) {
        res.end("working");
      },
      method: "GET",
      path: "/",
    },
    {
      handler: notionRedirectHandler,
      method: "GET",
      path: "/redirect-notion",
    },
  ],
});
app.use(globalMiddleware);

app.event("app_mention", middleware.app_mention, app_mention);

app.command(Commands.save, commands.save);
app.command(Commands.select, commands.select);
app.command(Commands.logout, commands.logout);

app.action(Actions.select_db, actions.select);

async function main() {
  await app.start(env.port).then(() => console.log("Started"));
}
main();
