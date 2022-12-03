import * as mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

interface User {
  name: string
  email: string
  password: string
  photo: string
  phone?: string
  bio: string
}

interface UserMethods {
  matchPassword: (enteredPassword: string, userPassword: string) => Promise<boolean>
}

type UserModel = mongoose.Model<User, {}, UserMethods>

export const privateFields = ['password', '__v']

const userSchema = new mongoose.Schema<User, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters.'],
      maxlength: [75, 'Password must be at most 75 characters.']
    },
    photo: {
      type: String,
      required: [true, 'Photo is required.'],
      default: 'https://i.pravatar.cc/300'
    },
    phone: {
      type: String
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio must be at most 500 characters.'],
      default: 'bio'
    }
  },
  {
    timestamps: true
  }
)

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  //   Check if password was modified
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

// Compare user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

// Can declare the method in this way too
// userSchema.method('matchPassword', async function (enteredPassword, userPassword) {
//   return await bcrypt.compare(enteredPassword, userPassword)
// })

export const User = mongoose.model<User, UserModel>('User', userSchema)
