export const badRequestErrorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    return res
      .status(400)
      .send({ message: err.message, errorsList: err.errorslist });
  }
  next(err);
};
export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).send({ message: err.message });
  }
};
export const genericServerErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "generic ERROR ON OUR SIDE" });
};
