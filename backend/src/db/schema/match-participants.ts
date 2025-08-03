import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { matches } from './matches.ts'
import { summoners } from './summoners.ts'

export const matchParticipants = pgTable('match_participants', {
  id: text().primaryKey(), // matchId + puuid
  matchId: text().references(() => matches.matchId),
  puuid: text().references(() => summoners.puuid),
  summonerName: text(),
  summonerId: text(),
  championId: integer(),
  championName: text(),
  teamId: integer(),
  win: boolean(),
  kills: integer(),
  deaths: integer(),
  assists: integer(),
  goldEarned: integer(),
  totalDamageDealt: integer(),
  totalDamageDealtToChampions: integer(),
  totalDamageTaken: integer(),
  visionScore: integer(),
  cs: integer(),
  gameDuration: integer(),
  updatedAt: timestamp().defaultNow(),
})
