import express from "express"
import createError from "http-errors"
import accommodationModel from "./model.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import { hostOnlyMiddleware } from "../../auth/hostOnlyMiddleware.js"

const accommodationRouter = express.Router()

accommodationRouter.post("/", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const newAccommodation = new accommodationModel(req.body)
    const { _id } = await newAccommodation.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

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

  accommodationRouter.put("/:accommodationId", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
    try {
      const updatedAccommodation = await accommodationModel.findByIdAndUpdate(req.params.accommodationId, req.body, { new: true, runValidators: true })
      if (updatedAccommodation) {
        res.status(204).send()
      } else {
        next(createError(404, `Accommodation with id ${req.params.accommodationId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  accommodationRouter.delete("/:accommodationId", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
    try {
      const deletedAccommodation = await accommodationModel.findByIdAndDelete(req.params.accommodationId)
      if (deletedAccommodation) {
        res.status(204).send()
      } else {
        next(createError(404, `User with id ${req.params.accommodationId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

  export default accommodationRouter