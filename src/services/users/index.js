import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"
import accommodationModel from "../accommodations/model.js"
import { generateAccessToken } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js"
import { hostOnlyMiddleware } from "../../auth/hostOnlyMiddleware.js"
import passport from "passport"
// import { facebookLoginUrl } from "../../auth/OAuth.js"
// import axios from "axios"

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
      const { email, password} = req.body
  
      const user = await UsersModel.checkCredentials(email, (password))
  
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

  usersRouter.get("/facebookLogin", passport.authenticate("facebook", { scope:  "email"}))

  usersRouter.get("/facebookRedirect", passport.authenticate("facebook"), async (req, res, next) => {

    // try {
    //   console.log("Token: ", req.user.token)
  
    //   if (req.user.role === "Admin") {
    //     res.redirect(`${process.env.FE_URL}/adminDashboard?accessToken=${req.user.token}`)
    //   } else {
    //     res.redirect(`${process.env.FE_URL}/profile?accessToken=${req.user.token}`)
    //   }
    // } catch (error) {
    //   next(error)
    // }
    try {
      console.log("Token: ", req.user.token)
  
        res.redirect(`${process.env.API_URL}/user/loginOk`)
    } catch (error) {
      next(error)
    }
  })

  // usersRouter.get("/FBredirect", async (req, res, next)=> {

  //   // const { data } = await axios({
  //   //   url: 'https://graph.facebook.com/v4.0/oauth/access_token',
  //   //   method: 'get',
  //   //   params: {
  //   //     client_id: process.env.APP_ID,
  //   //     client_secret: process.env.APP_SECRET,
  //   //     redirect_uri: `${process.env.API_URL}/login/facebook/final`
        
  //   //   },
  //   // });
  //   // console.log(data.access_token);
  //   // return data.access_token;
  //   const getUserData = async (accesstoken) => {
  //     const { data } = await axios({
  //     url: 'https://graph.facebook.com/me',
  //     method: 'get',
  //     params: {
  //       fields: 'email',
  //       access_token: accesstoken,
  //     },
  //   });
  //   console.log(data)
  
  // }

  //  const  getAccessTokenFromCode = async (code) => {
  //     const { data } = await axios({
  //       url: 'https://graph.facebook.com/v4.0/oauth/access_token',
  //       method: 'get',
  //       params: {
  //         client_id: process.env.APP_ID,
  //         client_secret: process.env.APP_SECRET,
  //         redirect_uri: `${process.env.API_URL}/user/FBredirect`,
  //         code,
  //       },
  //     });
  //     // console.log(data); 
  //     return getUserData(data.access_token)

  //  }

  //  res.send(getAccessTokenFromCode(req.query.code))
   
  // })

  usersRouter.get("/loginOk", async (req, res, next)=> {
    res.send("facebookLoginUrl")
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

  usersRouter.get("/me/accommodation", JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
    try {
      const managedAccommodations = await accommodationModel.find({host: req.user._id})
      if (managedAccommodations) {
        res.send(managedAccommodations)
      } else {
        next(401, `Accommodations with host id ${req.user._id} not found!`)
      }
    } catch (error) {
      next(error)
    }
  })
  
  export default usersRouter