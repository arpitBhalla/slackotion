import { PrismaClient, User, Team } from "@prisma/client";

class prismaDb extends PrismaClient {
  constructor() {
    super();
  }
  async addTeam(slack_team_id: string, meta_data = {}) {
    const team = await this.getTeam(slack_team_id);
    if (team) {
      await this.team.update({
        where: { id: team.id },
        data: {
          slack_meta_data: meta_data,
        },
      });
      return;
    }
    await this.team.create({
      data: {
        slack_team_id: slack_team_id,
        slack_meta_data: meta_data,
      },
    });
  }
  getTeam(slack_team_id: string) {
    return this.team.findFirst({
      where: {
        slack_team_id: slack_team_id,
      },
    });
  }
  deleteTeam(slack_team_id: string) {
    return this.team.delete({
      where: {
        slack_team_id: slack_team_id,
      },
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

export const prisma = new prismaDb();
