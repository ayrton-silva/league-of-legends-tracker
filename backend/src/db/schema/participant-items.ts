import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { matchParticipants } from './match-participants.ts'

export const participantItems = pgTable('participant_items', {
  id: text().primaryKey(), // matchId + puuid + slot
  matchParticipantId: text().references(() => matchParticipants.id),
  slot: integer().notNull(),
  itemId: integer(),
  updatedAt: timestamp().defaultNow(),
})
