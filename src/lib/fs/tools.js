import fs from "fs-extra";
import { join } from "path";

const { writeJson, readJSON, writeFile, unlink } = fs;

const dataFolderPath = join(process.cwd(), "./src/data");
const mediasJsonPath = join(dataFolderPath, "media.json");
const publicMediasFolder = join(process.cwd(), "./public/img/medias");

export const getMedias = () => readJSON(mediasJsonPath);

export const writeMedias = (mediasArray) =>
  writeJson(mediasJsonPath, mediasArray);

export const saveMediasImages = (filename, contentAsBuffer) =>
  writeFile(join(publicMediasFolder, filename), contentAsBuffer);

export const deleteMediasImages = (filename) =>
  unlink(join(publicMediasFolder, "../../", filename));
