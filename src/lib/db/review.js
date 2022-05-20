import { getMedias, writeMedias } from "../fs/tools.js";
import createError from "http-errors";
import { findMediaById } from "./media.js";
import uniqid from "uniqid";

export const saveNewReview = async (mediaId, newReviewData) => {
  const medias = await getMedias();
  console.log(medias);
  const foundMedia = medias.findIndex((media) => media.id === mediaId);
  if (foundMedia !== -1) {
    medias[foundMedia].reviews.push({
      ...newReviewData,
      id: uniqid(),
      createdAt: new Date(),
    });
    await writeMedias(medias);
    return medias[foundMedia];
  } else {
    throw createError(404, `media with id ${mediaId} not found`);
  }
};

export const findReviewById = async (mediaId, reviewId) => {
  const media = await findMediaById(mediaId);
  const foundReview = media.reviews.find((review) => review.id === reviewId);
  if (foundReview) {
    return foundReview;
  }
  throw createError(404, `Review with id ${reviewId} not found`);
};
