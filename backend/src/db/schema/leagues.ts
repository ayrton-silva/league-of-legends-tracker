import { boolean, numeric, pgTable, text } from 'drizzle-orm/pg-core'
import { summoners } from './summoners.ts'

export const leagues = pgTable('leagues', {
  league_id: text().primaryKey(),
  queue_type: text(),
  tier: text(),
  ranking: text(),
  league_points: numeric(),
  wins: numeric(),
  losses: numeric(),
  hot_streak: boolean(),
  puuid: text().references(() => summoners.puuid),
})
