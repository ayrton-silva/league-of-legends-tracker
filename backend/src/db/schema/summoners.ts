import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const summoners = pgTable('summoners', {
  puuid: text().primaryKey(),
  nickname: text(),
  region: text(),
  updatedAt: timestamp().defaultNow(),
})
