import fs from "fs";

export const db = {
  read() {
    return JSON.parse(fs.readFileSync("db.json", "utf8"));
  },
  write(data: any) {
    fs.writeFileSync("db.json", JSON.stringify(data));
  },
  set(key = "", value: any) {
    const dbData = this.read();
    dbData[key] = value;
    this.write(dbData);
  },
  get(key = "") {
    return this.read()[key];
  },
};
