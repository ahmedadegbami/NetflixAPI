import express from "express";
import multer from "multer";
import {
  saveNewMedia,
  findMedias,
  findMediaById,
  findMediabyIdandUpdate,
  findMediabyIdandDelete
} from "../lib/db/media.js";
import {
  saveNewReview,
  findReviewById,
  findReviewByIdAndUpdate,
  findReviewByIdAndDelete
} from "../../src/lib/db/review.js";
import {
  checksMediasSchema,
  checksMediasUpdateSchema,
  checkValidationResult
} from "./mediasValidator.js";

import {
  checkReviewSchema,
  checkReviewUpdateSchema
} from "./reviewValidator.js";

import createError from "http-errors";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const mediasRouter = express.Router();

mediasRouter.post(
  "/",
  checksMediasSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newmedia = await saveNewMedia(req.body);
      res.status(201).json(newmedia);
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.get("/", async (req, res, next) => {
  try {
    const medias = await findMedias();
    if (req.query && req.query.category) {
      const filteredmedias = medias.filter(
        (media) => media.category === req.query.category
      );
      res.send(filteredmedias);
    } else {
      res.json(medias);
    }
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:mediaId", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.mediaId);
    res.json(media);
  } catch (error) {
    next(error);
  }
});

mediasRouter.put(
  "/:mediaId",
  checksMediasUpdateSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const updatedmedia = await findMediabyIdandUpdate(
        req.params.mediaId,
        req.body
      );
      res.send(updatedmedia);
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.delete("/:mediaId", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.mediaId);

    await deleteMediasImages(media.poster);

    await findMediabyIdandDelete(req.params.mediaId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

mediasRouter.post(
  "/:mediaId/image",
  multer().single(),
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.post(
  "/:mediaId/review",
  checkReviewSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newReview = await saveNewReview(req.params.mediaId, req.body);
      res.status(201).send(newReview);
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.get("/:mediaId/review", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.mediaId);
    res.send(media.reviews);
  } catch (error) {
    next(error);
  }
});

mediasRouter.get("/:mediaId/review/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewById(
      req.params.mediaId,
      req.params.reviewId
    );
    res.send(review);
  } catch (error) {
    next(error);
  }
});

mediasRouter.put(
  "/:mediaId/review/:reviewId",
  checkReviewUpdateSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const updatedReview = await findReviewByIdAndUpdate(
        req.params.mediaId,
        req.params.reviewId,
        req.body
      );
      res.send(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

mediasRouter.delete("/:mediaId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await findReviewByIdAndDelete(
      req.params.mediaId,
      req.params.reviewId
    );
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "netflix/media"
    }
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      multerNext(createError(400, "Only png/jpeg allowed!"));
    } else {
      multerNext(null, true);
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }
}).single("poster");

mediasRouter.post(
  "/:mediaId/poster",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const media = await findMediabyIdandUpdate(req.params.mediaId, {
        Poster: req.file.path
      });
      res.send(media);
    } catch (error) {
      next(error);
    }
  }
);
export default mediasRouter;
