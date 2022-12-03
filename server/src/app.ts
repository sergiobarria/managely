import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { morganMiddleware } from './middleware/morgan.middleware'
import { globalErrorHandler, notFound } from '@/middleware/error.middleware'

import { routes } from '@/shared/constants/routes'
import { userRouter } from '@/modules/users'

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morganMiddleware)

// App Routes
app.get(routes.healthcheck, (req: Request, res: Response) => {
  res.status(200).json({
    api_status: 'OK'
  })
})

/*
 * Prefix: /api
 * Routes: /api/users
 */
app.use(`${routes.prefix}${routes.users}`, userRouter)

// Not Found
app.use(notFound)

// Error Handler
app.use(globalErrorHandler)

export default app
