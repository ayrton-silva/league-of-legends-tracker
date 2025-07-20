import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { summoners } from './summoners.ts'

export const leagues = pgTable('leagues', {
  leagueid: text().primaryKey(),
  queuetype: text().notNull(),
  tier: text().unique().notNull(),
  ranking: text().notNull(),
  leaguePoints: numeric(),
  wins: numeric(),
  losses: numeric(),
  puuid: text().references(() => summoners.puuid),
  updatedAt: timestamp().defaultNow(),
})
