import express from "express"
import createError from "http-errors"
import accommodationModel from "./model.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"

const accommodationRouter = express.Router()

accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const accommodations = await accommodationModel.find()
      res.send(accommodations)
    } catch (error) {
      next(error)
    }
  })

accommodationRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const accommodation = await accommodationModel.findById(req.params.id)
      if (accommodation) {
        res.send(accommodation)
      } else {
        next(createError(404, `Accommodation with id ${req.params.id} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  export default accommodationRouter