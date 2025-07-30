import axios from 'axios'
import { env } from '../../env.ts'
import type { GetSummonerLevelAndIcon } from '../../types/requests/get-summoner-level-and-icon-request.ts'
import type { SummonerIconAndLevelResponse } from '../../types/responses/summoner-icon-and-level-response.ts'

export async function fetchSummonerIconAndLevel({
  puuid,
}: GetSummonerLevelAndIcon) {
  try {
    const summonerResponse = await axios.get(
      `/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        baseURL: 'https://br1.api.riotgames.com',
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
      }
    )

    const summonerData: SummonerIconAndLevelResponse = summonerResponse.data

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
