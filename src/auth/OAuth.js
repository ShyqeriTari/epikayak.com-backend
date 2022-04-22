// import * as queryString from 'query-string';

// const stringifiedParams = queryString.stringify({
//   client_id: process.env.APP_ID,
//   redirect_uri: `${process.env.API_URL}/user/FBredirect`,
//   scope: ['email'], 
//   response_type: 'code',
//   auth_type: 'rerequest',
//   display: 'popup',
// });

// export const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`

import FacebookStrategy from "passport-facebook"
import passport from "passport"
import UsersModel from "../services/users/model.js"
import { generateAccessToken } from "./tools.js"

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: `${process.env.API_URL}/user/facebookRedirect`,
    // passReqToCallback : true,
    profileFields: ['id', 'emails', 'name']
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      console.log("PROFILE: ", profile)

      const user = await UsersModel.findOne({ email: profile.emails[0].value })

      if (user) {
        const accessToken = await generateAccessToken({ _id: user._id, role: user.role })

        passportNext(null, { token: accessToken })
      } else {
        const newUser = new UsersModel({
          email: profile.emails[0].value,
          facebookId: profile.id,
        })

        const savedUser = await newUser.save()
        const accessToken = await generateAccessToken({ _id: savedUser._id, role: savedUser.role })

        passportNext(null, { token: accessToken })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

passport.serializeUser((data, passportNext) => {
  passportNext(null, data)
})

export default facebookStrategy