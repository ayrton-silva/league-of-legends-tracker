import { pgTable, text, timestamp, numeric } from 'drizzle-orm/pg-core'

export const summoners = pgTable('summoners', {
  puuid: text().primaryKey(),
  nickname: text(),
  tagname: text(),
  region: text(),
  profileIconId: numeric(),
  level: numeric(),
  updatedAt: timestamp().defaultNow(),
})
