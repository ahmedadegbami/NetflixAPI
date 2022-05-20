import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const mediasSchema = {
  Type: {
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  Title: {
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  Year: {
    isString: {
      errorMessage: "Brand must be a string",
    },
  },
};

const mediasUpdateSchema = {
  Type: {
    isString: {
      errorMessage: "Description must be a string",
    },
    optional: true,
  },
  Title: {
    isString: {
      errorMessage: "Name must be a string",
    },
    optional: true,
  },
  Year: {
    isString: {
      errorMessage: "Brand must be a string",
    },
    optional: true,
  },
};

export const checksMediasSchema = checkSchema(mediasSchema);

export const checksMediasUpdateSchema = checkSchema(mediasUpdateSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(
      createError(400, `validation errors!`, { errorslist: errors.array() })
    );
  } else {
    next();
  }
};
