import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"
import { generateAccessToken } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import { hostOnlyMiddleware } from "../../auth/hostOnlyMiddleware.js"

const usersRouter = express.Router()

usersRouter.post("/register", async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body)
      const { _id, role } = await newUser.save()
      const accessToken = await generateAccessToken({ _id: _id, role: role })
      res.status(201).send({ _id, accessToken })
    } catch (error) {
      next(error)
    }
  })

usersRouter.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
  
      const user = await UsersModel.checkCredentials(email, password)
  
      if (user) {
  
        const accessToken = await generateAccessToken({ _id: user._id, role: user.role })
  
        res.send({ accessToken })
      } else {
        next(createError(401, `Credentials are not ok!`))
      }
    } catch (error) {
      next(error)
    }
  })

  usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.user._id)
      if (user) {
        res.send(user)
      } else {
        next(401, `User with id ${req.user._id} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })

  // usersRouter.get("/me/accommodation", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  //   try {
  //     const user = await UsersModel.findById(req.user._id)
  //     if (user) {
  //       res.send(user)
  //     } else {
  //       next(401, `User with id ${req.user._id} not found!`)
  //     }
  //   } catch (error) {
  //     next(error)
  //   }
  // })
  
  export default usersRouter