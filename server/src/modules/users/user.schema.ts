import { z } from 'zod'

const payload = {
  body: z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6)
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    })
}

export const createUserSchema = z.object({
  ...payload
})

export const updateUserSchema = z.object({
  ...payload
})

export const getUserSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export type CreateUserInput = z.infer<typeof createUserSchema>['body']
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type GetUserSchema = z.infer<typeof getUserSchema>
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>
