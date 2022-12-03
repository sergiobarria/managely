import * as express from 'express'

import { userRouter } from '@/modules/users'
import { routes } from '@/shared/constants/routes'
import { Request, Response } from 'express'

const router = express.Router()

/**
 * @description - API Healthcheck route
 * @access - Public
 * @routes - GET /api/healthcheck
 */
router.get(routes.healthcheck, (req: Request, res: Response) => {
  res.status(200).json({
    api_status: 'OK'
  })
})

/**
 * @description - User routes
 * @access - Public
 * @routes - GET /api/healthcheck
 */
router.use(routes.users, userRouter)

export { router as apiRouter }
