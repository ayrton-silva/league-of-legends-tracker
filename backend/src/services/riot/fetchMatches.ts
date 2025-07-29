import axios from 'axios'
import { env } from '../../env.ts'
import { saveSummoner } from '../../storage/saveSummoner.ts'

type FetchSummonerMatchesParams = {
  puuid: string
  region?: string
}

type SummonerMatchesResponse = string[]

export async function fetchMatches({
  puuid,
  region = 'americas',
}: FetchSummonerMatchesParams) {
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

    const summonerData: SummonerMatchesResponse = summonerResponse.data

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
