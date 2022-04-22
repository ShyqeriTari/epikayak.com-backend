import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["host", "guest"], default: "guest" },
    FBaccessToken: {type: String}
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  
    const newUser = this 
    const plainPW = newUser.password
  
    if (newUser.isModified("password")) {
      const hash = await bcrypt.hash(plainPW, 11)
      newUser.password = hash
    }
  
    next()
  })
  
  UserSchema.methods.toJSON = function () {
  
    const userDocument = this
    const userObject = userDocument.toObject()
  
    delete userObject.password
    delete userObject.__v
    delete userObject.FBaccessToken
  
    return userObject
  }
  
  UserSchema.statics.checkCredentials = async function (email, plainPassword) {
  
    const user = await this.findOne({ email }) 
  
    if (user) {
      const isMatch = await bcrypt.compare(plainPassword, user.password)
  
      if (isMatch) {
        return user
      } else {
        return null
      }
    } else {
      return null
    }
  }

export default model("User", UserSchema)