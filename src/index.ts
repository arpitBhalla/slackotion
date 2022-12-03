import { App, LogLevel } from "@slack/bolt";
import { env } from "./core/env";
import { app_mention } from "./events/app_mention";
import { middleware } from "./middleware";
import { notionRedirectHandler } from "./routes/redirect-notion";

const app = new App({
  token: env.token,
  appToken: env.appToken,
  signingSecret: env.signingSecret,
  logLevel: env.isDebug ? LogLevel.DEBUG : LogLevel.ERROR,
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
      path: "/redirect",
    },
  ],
});

app.event("app_mention", middleware.app_mention, app_mention);

(async () => await app.start(env.port).then(() => console.log("Started")))();
