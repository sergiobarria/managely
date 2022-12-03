import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

export const validateResource = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      })

      next()
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors[0].message
      })
    }
  }
}
