import { env } from "../core/env";
import { CustomRoute } from "@slack/bolt";
import fetch from "node-fetch";
import { db, dbv2 } from "../utils/db";
import { NotionClient } from "../utils/notion";
import { NotionRedirectResponse, NotionLoginStatePayload } from "../types";

export const notionRedirectHandler: CustomRoute["handler"] = async (
  req,
  res
) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  console.log("/redirect", params);

  const stateBuffer = Buffer.from(params.get("state") ?? "", "base64").toString(
    "ascii"
  );

  const state = JSON.parse(stateBuffer) as NotionLoginStatePayload;
  const code = params.get("code")!;

  const notionResponse = (await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.base_url + "/redirect",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${env.auth_client_id}:${env.auth_client_secret}`
      ).toString("base64")}`,
    },
  }).then((res: any) => res.json())) as NotionRedirectResponse;

  if (!notionResponse?.access_token) return res.end("Login Failed");
  //   await app.client.chat.postEphemeral({
  //     text: "Login done, you can use the app now",
  //     thread_ts: state.t,
  //     channel: state.c,
  //     user: state.u,
  //   });

  const notion = new NotionClient(notionResponse.access_token);
  const database_id = await notion.getUserNotionDB();

  await dbv2.addUser({
    notion_access_token: notionResponse.access_token,
    notion_database_id: database_id,
    slack_user_id: state.u,
  });

  res.end(
    "<html><head><title>Sync with Slack</title></head><body><center><h1>App added successfully</h1><h3>You can close this tab</h3></center></body></html>"
  );
};