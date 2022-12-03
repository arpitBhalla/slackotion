import { Client } from "@notionhq/client";

export class NotionClient extends Client {
  constructor(token: string) {
    super({ auth: token });
    this.search;
  }
  async getUserAllDB() {
    return this.search({
      filter: { property: "object", value: "database" },
    });
  }
  async getUserNotionDB() {
    const res = await this.getUserAllDB();
    return res.results[0].id;
  }
  async createNotionPage(database_id: string, title: string, content: string) {
    const res = await this.pages.create({
      parent: { database_id },
      properties: {
        title: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content,
                },
              },
            ],
          },
        },
      ],
    });
    return res;
  }
}

// notion.users.me({}).then((res) => console.log(res));
// notion.databases.create().then((res) => console.log(res));

// notion.databases
//   .retrieve({
//     // database_id: "da5dcdd7-088e-4d88-ac60-446dbd85a720",
//     database_id: "d1f5b2b0-1b1a-4b1f-8c1f-1b2c2b3d4e5f",
//   })
//   .then(console.log);
// notion.pages.create({
//   parent: { database_id: "f9d859ec323a4e6e996dabfb5619daf8" },
//   properties: {
//     title: {
//       type: "title",
//       title: [
//         {
//           type: "text",
//           text: {
//             content: "username",
//           },
//         },
//       ],
//     },
//   },
//   children: [
//     {
//       paragraph: {
//         rich_text: [
//           {
//             type: "text",
//             text: {
//               content: "Hello World",
//             },
//           },
//         ],
//       },
//     },
//   ],
// });
