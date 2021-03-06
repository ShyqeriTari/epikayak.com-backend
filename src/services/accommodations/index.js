import express from "express"
import createError from "http-errors"
import accommodationModel from "./model.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import { hostOnlyMiddleware } from "../../auth/hostOnlyMiddleware.js"


const accommodationRouter = express.Router()

accommodationRouter.post("/", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const newAccommodation = new accommodationModel({name: req.body.name, host: req.user._id, description: req.body.description, maxGuests: req.body.maxGuests, city: req.body.city})
    const { _id } = await newAccommodation.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const accommodations = await accommodationModel.find().populate({path: "host", select: "email -_id" })
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
      const accommodation = await accommodationModel.findById(req.params.accommodationId)
      if(req.user._id === accommodation.host.toString()){
      const updatedAccommodation = await accommodationModel.findByIdAndUpdate(req.params.accommodationId, req.body, { new: true, runValidators: true })
      if (updatedAccommodation) {
        res.status(204).send()
      } else {
        next(createError(404, `Accommodation with id ${req.params.accommodationId} not found!`))
      }}else {
        next(createError(403, `You are not authorized to modify accommodation with id ${req.params.accommodationId}`))
      }
    } catch (error) {
      next(error)
    }
  })

  accommodationRouter.delete("/:accommodationId", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
    try {
      const accommodation = await accommodationModel.findById(req.params.accommodationId)
      if(req.user._id === accommodation.host.toString()){
      const deletedAccommodation = await accommodationModel.findByIdAndDelete(req.params.accommodationId)
      if (deletedAccommodation) {
        res.status(204).send()
      } else {
        next(createError(404, `User with id ${req.params.accommodationId} not found!`))
      }}else {
        next(createError(403, `You are not authorized to delete accommodation with id ${req.params.accommodationId}`))
      }
    } catch (error) {
      next(error)
    }
  })

  export default accommodationRouter