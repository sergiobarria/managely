import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import status from 'http-status'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'

import { User, privateFields } from '@/models/user.model'
import { CreateUserInput } from '@/modules/users/user.schema'
import { createUser } from '@/modules/users/user.services'
import { AppError } from '@/shared/utils/AppError'

export const generateToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

/**
 * @description - Register user
 * @access - Public
 * @returns {Response} - Express response object
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

    const token = generateToken(newUser._id)

    // Send HTTP-only cookie with token
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })

    if (!newUser) {
      return next(new AppError('Something went wrong.', status.BAD_REQUEST))
    }

    res.status(status.CREATED).json({
      message: 'User created successfully',
      data: {
        user: omit(newUser.toJSON(), privateFields)
      }
    })
  }
)
