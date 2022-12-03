// Custom error class for handling errors in the application
export class AppError extends Error {
  public isOperational: boolean
  public statusCode: number
  public status: string
  public message: string
  public stack: string | undefined

  constructor(message: string, statusCode: number) {
    super(message)

    this.isOperational = true
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.message = message
    this.stack = new Error().stack

    Error.captureStackTrace(this, this.constructor)
  }
}
