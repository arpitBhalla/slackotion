import { App, LogLevel } from "@slack/bolt";

const app = new App({
  token: "xoxb-your-token",
  signingSecret: "your-signing-secret",
  logLevel: LogLevel.DEBUG,
});
