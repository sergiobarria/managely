import express, { Request, Response } from 'express'
import cors from 'cors'

import { morganMiddleware } from './middleware/morgan.middleware'

import { routes } from '@/shared/routes'

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(morganMiddleware)

// Start express server and healthcheck route
app.get(routes.healthcheck, (req: Request, res: Response) => {
  res.status(200).json({
    api_status: 'OK'
  })
})

export default app
