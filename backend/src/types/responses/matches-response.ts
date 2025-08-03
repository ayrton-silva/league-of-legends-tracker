export type MatchesResponse = {
  matchId: string
  gameCreation: Date
  gameDuration: number
  gameMode: string
  gameType: string
  queueId: number
  participants: Array<{
    puuid: string
    summonerName: string
    championName: string
    teamId: number
    win: boolean
    kills: number
    deaths: number
    assists: number
    goldEarned: number
    totalDamageDealt: number
    totalDamageDealtToChampions: number
    totalDamageTaken: number
    visionScore: number
    cs: number
  }>
}
