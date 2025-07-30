import axios from 'axios'
import { env } from '../../env.ts'
import type { GetSummonerLeaguesRequest } from '../../types/requests/get-summoner-leagues-request.ts'
import type { SummonerLeague } from '../../types/riot/summoner-league.ts'

export async function fetchSummonerLeagues({
  puuid,
}: GetSummonerLeaguesRequest) {
  try {
    const summonerResponse = await axios.get(
      `/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        baseURL: 'https://br1.api.riotgames.com',
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
      }
    )

    const summonerData: SummonerLeague[] = summonerResponse.data

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
