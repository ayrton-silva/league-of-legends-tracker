import { pgTable, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core'

export const matches = pgTable('matches', {
  matchId: text().primaryKey(),
  gameCreation: timestamp(),
  gameDuration: integer(),
  gameEndTimestamp: timestamp(),
  gameId: numeric(),
  gameMode: text(),
  gameName: text(),
  gameStartTimestamp: timestamp(),
  gameType: text(),
  gameVersion: text(),
  mapId: integer(),
  participants: text(),
  platformId: text(),
  queueId: integer(),
  teams: text(),
  tournamentCode: text(),
  updatedAt: timestamp().defaultNow(),
})
