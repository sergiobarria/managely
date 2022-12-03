import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { morganMiddleware } from './middleware/morgan.middleware'
import { globalErrorHandler, notFound } from '@/middleware/error.middleware'

import { apiRouter } from './router'
import { routes } from '@/shared/constants/routes'

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morganMiddleware)

// App Routes
app.use(routes.prefix, apiRouter)

// Not Found
app.use(notFound)

// Error Handler
app.use(globalErrorHandler)

export default app
