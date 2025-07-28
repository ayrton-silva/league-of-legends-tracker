import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const matches = pgTable('matches', {
  matchid: text().primaryKey().notNull(),
  gamemode: text().notNull(),
  gamemap: text().notNull(),
  gameDuration: timestamp().notNull(),
})
