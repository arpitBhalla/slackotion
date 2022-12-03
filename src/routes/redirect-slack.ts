// import { env } from "../core/env";
// import { CustomRoute } from "@slack/bolt";
// import { dbv2 } from "../utils/db";
// import { app } from "../index";

// export const slackRedirectHandler: CustomRoute["handler"] = async (
//   req,
//   res
// ) => {
//   const params = new URLSearchParams(req.url?.split("?")[1]);
//   console.log("/redirect-slack", params);

//   const code = params.get("code")!;
//   const resp = await app.client.oauth.v2.access({
//     code,
//     client_id: env.slack_client_id!,
//     client_secret: env.slack_client_secret!,
//     redirect_uri: env.base_url + "/redirect-slack",
//   });
//   console.log(resp);

//   if (!resp.ok) {
//     res.statusCode = 400;
//     res.end("Failed to authenticate with Slack. Please try again later.");
//     return;
//   }

//   await dbv2.addTeam({
//     slack_bot_id: resp.access_token!,
//     slack_team_id: resp.team?.id!,
//   });

//   res.end(
//     "<html><head><title>Sync with Slack</title></head><body><center><h1>App added successfully</h1><h3>You can close this tab</h3></center></body></html>"
//   );
// };
