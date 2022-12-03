import express, { Request, Response } from 'express'

const app = express()

const PORT = 3333

// Start express server and healthcheck route
app.get('/healthcheck', (req: Request, res: Response) => {
  res.send('Server is running')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
