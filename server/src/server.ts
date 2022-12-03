import * as http from 'http'

import * as dotenv from 'dotenv'
import chalk from 'chalk'

import { logger } from '@/lib/logger'
import { mongoConnect } from '@/services/mongo'

import app from './app'

dotenv.config()

let server: http.Server

const PORT = process.env.PORT ?? 1337
const ENV = process.env.NODE_ENV ?? 'development'

// Function to start express server
const startServer = async (): Promise<void> => {
  server = http.createServer(app)

  // Connect to MongoDB
  await mongoConnect()

  try {
    server.listen(PORT, () => {
      logger.info(
        chalk.green(
          `Server running on port ${chalk.bold(PORT)} in ${chalk.bold(ENV.toUpperCase())} mode`
        )
      )
    })
  } catch (err) {
    logger.error(chalk.red(err))
  }
}

// Start async server
void startServer()
