import { getMedias, writeMedias } from "../fs/tools.js";
import createError from "http-errors";
import { findMediaById } from "./media.js";
import uniqid from "uniqid";

export const saveNewReview = async (mediaId, newReviewData) => {
  const medias = await getMedias();
  console.log(medias);
  const foundMedia = medias.findIndex((media) => media.imdbID === mediaId);
  if (foundMedia !== -1) {
    medias[foundMedia].reviews.push({
      ...newReviewData,
      _id: uniqid(),
      elementId: medias[foundMedia].imdbID,
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
  const foundReview = media.reviews.find((review) => review._id === reviewId);
  if (foundReview) {
    return foundReview;
  }
  throw createError(404, `Review with id ${reviewId} not found`);
};

export const findReviewByIdAndUpdate = async (mediaId, reviewId, updates) => {
  const medias = await getMedias();

  const mediaIndex = medias.findIndex((media) => media.imdbID === mediaId);
  if (mediaIndex !== -1) {
    const reviewIndex = medias[mediaIndex].reviews.findIndex(
      (review) => review._id === reviewId
    );

    if (reviewIndex !== -1) {
      medias[mediaIndex].reviews[reviewIndex] = {
        ...medias[mediaIndex].reviews[reviewIndex],
        ...updates,
        updatedAt: new Date(),
      };

      await writeMedias(medias);

      return medias[mediaIndex].reviews[reviewIndex];
    } else {
      throw createError(404, `Review with id ${reviewId} not found!`);
    }
  } else {
    throw createError(404, `media with id ${mediaId} not found!`);
  }
};

export const findReviewByIdAndDelete = async (mediaId, reviewId) => {
  const medias = await getMedias();

  const mediaIndex = medias.findIndex((media) => media.imdbID === mediaId);
  if (mediaIndex !== -1) {
    const reviewIndex = medias[mediaIndex].reviews.findIndex(
      (review) => review._id === reviewId
    );

    if (reviewIndex !== -1) {
      medias[mediaIndex].reviews.splice(reviewIndex, 1);
      await writeMedias(medias);
    } else {
      throw createError(404, `Review with id ${reviewId} not found!`);
    }
  } else {
    throw createError(404, `Media with id ${mediaId} not found!`);
  }
};
