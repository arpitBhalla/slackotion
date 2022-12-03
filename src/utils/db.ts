import fs from "fs";

type DB = {
  access_token: string;
  database_id: string;
};

export const db = {
  read() {
    return JSON.parse(fs.readFileSync("db.json", "utf8"));
  },
  write(data: any) {
    fs.writeFileSync("db.json", JSON.stringify(data));
  },
  set(key: string, value: DB) {
    const dbData = this.read();
    dbData[key] = value;
    this.write(dbData);
  },
  get(key: string): DB {
    return this.read()[key] || {};
  },
};
