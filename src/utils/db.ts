import { PrismaClient, User, Team } from "@prisma/client";

type DB = {
  access_token: string;
  database_id: string;
};

class prismaDb extends PrismaClient {
  constructor() {
    super();
  }
  addTeam(team: Omit<Team, "id">) {
    return this.team.create({
      data: team,
    });
  }
  addUser(user: Omit<User, "id">) {
    return this.user.create({
      data: user,
    });
  }
  getUser(user_id: string) {
    return this.user.findFirst({
      where: {
        slack_user_id: user_id,
      },
    });
  }
}

export const dbv2 = new prismaDb();
