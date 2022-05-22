import createError from "http-errors";
import uniqid from "uniqid";
import { getMedias, writeMedias } from "../fs/tools.js";

export const saveNewMedia = async (newMediaData) => {
  const medias = await getMedias();
  const newMedia = {
    ...newMediaData,
    imdbID: uniqid(),
    createdAt: new Date(),
    reviews: [],
  };
  medias.push(newMedia);
  await writeMedias(medias);
  return newMedia;
};

export const findMedias = () => getMedias();

export const findMediaById = async (mediaId) => {
  const medias = await getMedias();
  const foundMedias = medias.find((media) => media.imdbID === mediaId);
  if (foundMedias) {
    return foundMedias;
  } else {
    throw createError(404, `media with id ${mediaId} not found`);
  }
};

export const findMediabyIdandUpdate = async (mediaId, updatedMedia) => {
  const medias = await getMedias();
  const foundMedias = medias.findIndex((media) => media.imdbID === mediaId);
  if (foundMedias !== -1) {
    medias[foundMedias] = {
      ...medias[foundMedias],
      ...updatedMedia,
      updatedAt: new Date(),
    };
    await writeMedias(medias);
    return medias[foundMedias];
  } else {
    throw createError(404, `media with id ${mediaId} not found`);
  }
};

export const findMediabyIdandDelete = async (mediaId) => {
  const medias = await getMedias();
  const remMedias = medias.filter((media) => media.imdbID !== mediaId);
  if (medias.length === remMedias.length) {
    throw createError(404, `media with id ${mediaId} not found`);
  } else {
    await writeMedias(remMedias);
  }
};
