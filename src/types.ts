import "@slack/bolt";

declare module "@slack/bolt" {
  interface Context {
    notionToken: string;
    isLogin: boolean;
  }
}
