import { InstallationStore } from "@slack/bolt";
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
      return await database.set(installation.enterprise.id, installation);
    }
    if (installation.team !== undefined) {
      // single team app installation

      return database.set(installation.team.id, installation);
    }
    throw new Error("Failed saving installation data to installationStore");
  };
  fetchInstallation: InstallationStore["fetchInstallation"] = async (
    installQuery
  ) => {
    // change the line below so it fetches from your database
    console.log(installQuery);
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      // org wide app installation lookup
      return await database.get(installQuery.enterpriseId);
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation lookup

      return await database.get(installQuery.teamId);
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
      return await database.delete(installQuery.enterpriseId);
    }
    if (installQuery.teamId !== undefined) {
      // single team app installation deletion
      return await database.delete(installQuery.teamId);
    }
    throw new Error("Failed to delete installation");
  };
}
