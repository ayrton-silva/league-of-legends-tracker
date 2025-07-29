import axios from 'axios'
import { env } from '../../env.ts'

type FetchSummonerLeaguesRequest = {
  puuid: string
}

type SummonerLeaguesResponse = {
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

export async function fetchSummonerLeagues({puuid}: FetchSummonerLeaguesRequest) {
  try {
    const summonerResponse = await axios.get(
      `/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        baseURL: `https://br1.api.riotgames.com`,
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
      }
    )

    const summonerData: SummonerLeaguesResponse[] = summonerResponse.data

    if (!summonerData) {
      return null
    }

    return summonerData
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.log(err)
    return null
  }
}
