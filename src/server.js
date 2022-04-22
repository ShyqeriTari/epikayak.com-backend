import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import passport from "passport"
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"
import usersRouter from "./services/users/index.js"
import accommodationRouter from "./services/accommodations/index.js"
import facebookStrategy from "./auth/OAuth.js"


const server = express()
const port = process.env.PORT

passport.use("facebook", facebookStrategy)

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

server.use("/user", usersRouter)
server.use("/accommodation", accommodationRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})