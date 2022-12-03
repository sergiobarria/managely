import express from 'express'

import { routes } from '@/shared/constants/routes'
import { registerUser } from '@/modules/users/user.controller'
import { validateResource } from '@/middleware/validateResource.middleware'
import { createUserSchema } from '@/modules/users/user.schema'

const router = express.Router()

router.route(routes.register).post(validateResource(createUserSchema), registerUser)

export { router as userRouter }
