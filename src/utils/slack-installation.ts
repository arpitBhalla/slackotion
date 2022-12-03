import { InstallationStore } from "@slack/bolt";
import { prisma } from "./prisma";

import fs from "fs";

export const databaseData: Record<any, any> = {};

export const database = {
  read() {
    return JSON.parse(fs.readFileSync("db.json", "utf8"));
  },
  write(data: any) {
    fs.writeFileSync("db.json", JSON.stringify(data));
  },
  set(key: string, value: any) {
    const dbData = this.read();
    dbData[key] = value;
    this.write(dbData);
  },
  get(key: string) {
    return this.read()[key] || {};
  },
  delete(key: string) {
    const dbData = this.read();
    delete dbData[key];
    this.write(dbData);
  },
};

export class SlackInstallationStore implements InstallationStore {
  storeInstallation: InstallationStore["storeInstallation"] = async (
    installation
  ) => {
    // change the line below so it saves to your database
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      // support for org wide app installation
      return prisma.addTeam(installation.enterprise.id, installation);
    }
    if (installation.team !== undefined) {
      // single team app installation

      return prisma.addTeam(installation.team.id, installation);
    }
    throw new Error("Failed saving installation data to installationStore");
  };
  fetchInstallation: InstallationStore["fetchInstallation"] = async (
    installQuery
  ) => {
    // change the line below so it fetches from your database
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation lookup
      const team = await prisma.getTeam(installQuery.enterpriseId);
      return team?.slack_meta_data as unknown as ReturnType<
        InstallationStore["fetchInstallation"]
      >;
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup

      const team = await prisma.getTeam(installQuery.teamId);
      return team?.slack_meta_data as unknown as ReturnType<
        InstallationStore["fetchInstallation"]
      >;
    }
    throw new Error("Failed fetching installation");
  };
  deleteInstallation: InstallationStore["deleteInstallation"] = async (
    installQuery
  ) => {
    // change the line below so it deletes from your database
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation deletion
      await prisma.deleteTeam(installQuery.enterpriseId);
      return;
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation deletion
      await prisma.deleteTeam(installQuery.teamId);
      return;
    }
    throw new Error("Failed to delete installation");
  };
}
