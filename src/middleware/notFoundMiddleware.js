import AppError from "../utils/AppError.js";

const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export default notFoundMiddleware;
