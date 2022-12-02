export const env = {
  isDebug: process.env.DEBUG ?? false,
  signingSecret: process.env.SIGNING_SECRET ?? "",
  token: process.env.TOKEN ?? "",
};
