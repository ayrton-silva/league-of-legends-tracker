import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'
import type { SummonerLeague } from '../types/riot/summoner-league.ts'

export async function upsertSummonerLeagues({
  leagueId,
  leaguePoints,
  queueType,
  tier,
  rank,
  puuid,
  wins,
  losses,
  hotStreak,
}: SummonerLeague) {
  const result = await db
    .insert(schema.leagues)
    .values({
      league_id: leagueId,
      queue_type: queueType,
      tier: tier,
      ranking: rank,
      league_points: leaguePoints,
      wins: wins,
      losses: losses,
      hot_streak: hotStreak,
      puuid: puuid,
    })
    .returning()

  return result
}
