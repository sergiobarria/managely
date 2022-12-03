import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import chalk from 'chalk'

import { logger } from '@/lib/logger'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI ?? ''

export async function mongoConnect(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI)
    logger.info(chalk.blue.bold.underline(`Connected to MongoDB at ${MONGO_URI}`))
  } catch (err) {
    logger.error(chalk.red(err))
  }
}

export async function mongoDisconnect(): Promise<void> {
  try {
    await mongoose.disconnect()
    logger.info(chalk.green.underline('Disconnected from MongoDB'))
  } catch (err) {
    logger.error(chalk.red(err))
  }
}
