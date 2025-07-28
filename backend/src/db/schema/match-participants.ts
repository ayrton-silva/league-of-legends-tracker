import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { summoners } from './summoners.ts'

export const matchParticipants = pgTable('match_participants', {
  league_id: text().primaryKey(),

  puuid: text().references(() => summoners.puuid),
  updatedAt: timestamp().defaultNow(),
})
