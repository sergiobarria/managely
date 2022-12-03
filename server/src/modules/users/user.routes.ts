import express from 'express'

import { routes } from '@/shared/constants/routes'
import { loginUser, logoutUser, registerUser } from '@/modules/users/user.controller'
import { validateResource } from '@/middleware/validateResource.middleware'
import { createUserSchema, loginUserSchema } from '@/modules/users/user.schema'

const router = express.Router()

router.route(routes.register).post(validateResource(createUserSchema), registerUser)

router.route(routes.login).post(validateResource(loginUserSchema), loginUser)

router.route(routes.logout).get(logoutUser)

export { router as userRouter }
