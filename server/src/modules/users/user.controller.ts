import { CookieOptions, NextFunction, Request, Response } from 'express'
import { Types, Document } from 'mongoose'
import status from 'http-status'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'

import { User, privateFields } from '@/models/user.model'
import { CreateUserInput, LoginUserSchema } from '@/modules/users/user.schema'
import { createUser } from '@/modules/users/user.services'
import { AppError } from '@/shared/utils/AppError'

export const generateToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

// Create and send jwt token function
export const createAndSendToken = (user: Document, statusCode: number, res: Response) => {
  const token = generateToken(user._id)

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
    cookieOptions.sameSite = 'none'
  }

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: omit(user.toJSON(), privateFields) }
  })
}

/**
 * @description - Register user
 * @access - Public
 * @route - POST /api/users/register
 */
export const registerUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
    const { email } = req.body

    // Check if user already exists
    const user = await User.findOne({ email })

    if (user) {
      return next(new AppError('User already exists.', status.BAD_REQUEST))
    }

    // If user does not exist, create user
    const newUser = await createUser(req.body)

    if (!newUser) {
      return next(new AppError('Something went wrong.', status.BAD_REQUEST))
    }

    createAndSendToken(newUser, status.CREATED, res)
  }
)

/**
 * @description - Login user
 * @access - Public
 * @route - POST /api/users/login
 */
export const loginUser = asyncHandler(
  async (req: Request<{}, {}, LoginUserSchema>, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password, user.password))) {
      return next(new AppError('Invalid email or password', status.UNAUTHORIZED))
    }

    createAndSendToken(user, status.OK, res)
  }
)

/**
 * @description - Logout user
 * @access - Public
 * @route - POST /api/users/logout
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'logged out', {
    expires: new Date(0), // now
    httpOnly: true
  })

  res.status(status.OK).json({ status: 'success' })
})
