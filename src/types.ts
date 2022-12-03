import "@slack/bolt";

declare module "@slack/bolt" {
  interface Context {
    notion_access_token: string;
    notion_database_id: string;
  }
}

export type SlackRedirectResponse = {
  access_token: string;
  scope: string;
  team_name: string;
  team_id: string;
  incoming_webhook: {
    url: string;
    channel: string;
    configuration_url: string;
  };
  bot: {
    bot_user_id: string;
    bot_access_token: string;
  };
};

export type NotionRedirectResponse = {
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

export type NotionLoginStatePayload = { u: string; t: string; c: string };
