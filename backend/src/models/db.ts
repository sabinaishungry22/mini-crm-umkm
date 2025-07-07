import fs from "fs/promises";
const DB_PATH = "db.json";

export const readDB = async () => {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
};

export const writeDB = async (data: any) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};
