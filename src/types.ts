import "@slack/bolt";

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

declare module "@slack/bolt" {
  interface Context {
    notion: NotionResponse;
    isLogin: boolean;
  }
}
