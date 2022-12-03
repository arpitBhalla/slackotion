import "@slack/bolt";

declare module "@slack/bolt" {
  interface Context {
    notion_access_token: string;
    notion_database_id: string;
  }
}

export type NotionResponse = {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_name: string;
  workspace_icon: string;
  workspace_id: string;
  owner: {
    type: string;
    user: {
      object: string;
      id: string;
    };
  };
  duplicated_template_id: any;
};

export type MiddlewareBody = {
  token: string;
  team_id: string;
  api_app_id: string;
  event: {
    client_msg_id: string;
    type: string;
    text: string;
    user: string;
    ts: string;
    blocks: ArrayConstructor[];
    team: string;
    thread_ts: string;
    parent_user_id: string;
    channel: string;
    event_ts: string;
  };
  event_context: string;
};

export type StatePayload = { u: string; t: string; c: string };
