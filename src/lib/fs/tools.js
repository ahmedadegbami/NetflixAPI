import fs from "fs-extra";
import { join } from "path";

const { writeJson, readJSON } = fs;

const dataFolderPath = join(process.cwd(), "./src/data");
const mediasJsonPath = join(dataFolderPath, "media.json");

export const getMedias = () => readJSON(mediasJsonPath);

export const writeMedias = (mediasArray) =>
  writeJson(mediasJsonPath, mediasArray);
