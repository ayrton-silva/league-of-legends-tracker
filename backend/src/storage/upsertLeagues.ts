import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

type SummonerLeaguesParams = {
    leagueId: string
    queueType: string
    tier: string
    rank: string
    puuid: string
    leaguePoints: number
    wins: number
    losses: number
    hotStreak: boolean
}

export async function upsertSummonerLeagues({
  leagueId, leaguePoints, queueType, tier, rank, puuid, wins, losses, hotStreak
}: SummonerLeaguesParams) {
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
      puuid: puuid
    })
    .returning()

  return result
}
