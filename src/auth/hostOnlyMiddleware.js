import createError from "http-errors"

export const hostOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "host") {
    next()
  } else {
    next(createError(403, "Host Only Endpoint!"))
  }
}