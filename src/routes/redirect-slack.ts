import { env } from "../core/env";
import { CustomRoute } from "@slack/bolt";
import fetch from "node-fetch";
import { NotionClient } from "../utils/notion";
import { SlackRedirectResponse } from "../types";

export const notionRedirectHandler: CustomRoute["handler"] = async (
  req,
  res
) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  console.log("/redirect-slack", params);

  const code = params.get("code")!;

  const response = (await fetch("https://slack.com/api/oauth.access", {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id: env.notion_client_id,
      client_secret: env.notion_client_secret,
      redirect_uri: env.base_url + "/redirect-slack",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${env.notion_client_id}:${env.notion_client_secret}`
      ).toString("base64")}`,
    },
  }).then((res: any) => res.json())) as SlackRedirectResponse;

  if (!response?.access_token) return res.end("Login Failed");
  //   await app.client.chat.postEphemeral({
  //     text: "Login done, you can use the app now",
  //     thread_ts: state.t,
  //     channel: state.c,
  //     user: state.u,
  //   });

  const notion = new NotionClient(response.access_token);
  const database_id = await notion.getUserNotionDB();

  res.end(
    "<html><head><title>Sync with Slack</title></head><body><center><h1>App added successfully</h1><h3>You can close this tab</h3></center></body></html>"
  );
};
