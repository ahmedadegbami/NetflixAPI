import { checkSchema } from "express-validator";
import createError from "http-errors";

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: true,
    errorMessage: "Comment is required"
  },
  rate: {
    in: ["body"],
    isInt: {
      options: {
        min: 1,
        max: 5
      },
      errorMessage: "Rating must be a number between 1 and 5"
    }
  }
};

const reviewUpdateSchema = {
  comment: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "Comment is required"
  },
  rate: {
    in: ["body"],
    optional: true,
    isInt: true,
    errorMessage: "Rate is required"
  }
};

export const checkReviewSchema = checkSchema(reviewSchema);
export const checkReviewUpdateSchema = checkSchema(reviewUpdateSchema);
