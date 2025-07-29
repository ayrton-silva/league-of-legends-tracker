type League = {
  queue_type: string
  tier: string
  ranking: string
  league_points: number
  wins: number
  losses: number
  hot_streak: boolean
}

export type GetSummonersResponse = Array<{
  puuid: string
  nickname: string
  tagname: string
  region: string
  updated_at: string
  level: number 
  profileIconId: number
  tier: string
  leagues: Array<League>
}>