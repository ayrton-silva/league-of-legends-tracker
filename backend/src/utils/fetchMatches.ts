import axios from 'axios'
import { env } from '../env.ts'
import { saveSummoner } from './saveSummoner.ts'

type FetchMatchesParams = {
  puuid: string
  region?: string
}

type SummonerResponse = {
  puuid: string
  gameName: string
  tagLine: string
}

export async function fetchMatches({
  puuid,
  region = 'americas',
}: FetchMatchesParams) {
  try {
    const summonerResponse = await axios.get(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        baseURL: `https://${region}.api.riotgames.com`,
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
      }
    )

    const summonerData: SummonerResponse = summonerResponse.data

    if (!summonerData) {
      return null
    }

    const result = await saveSummoner({
      nickname: summonerData.gameName,
      tagname: summonerData.tagLine,
      puuid: summonerData.puuid,
    })

    return result.length > 0 ? result : null
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.log(err)
    return null
  }
}
