import axios from 'axios'
import { env } from '../../env.ts'
import { saveSummoner } from '../../storage/saveSummoner.ts'
import { fetchSummonerIconAndLevel } from './fetchSummonerIconAndLevel.ts'
import { fetchSummonerLeagues } from './fetchSummonerLeagues.ts'
import { upsertSummonerLeagues } from '../../storage/upsertLeagues.ts'

type FetchSummonerParams = {
  nickname: string
  tagname: string
  region?: string
}

type SummonerResponse = {
  puuid: string
  gameName: string
  tagLine: string
}

export async function fetchSummoner({
  nickname,
  tagname,
  region = 'BR',
}: FetchSummonerParams) {
  try {
    const regionURL = region == 'BR' ? 'americas' : 'europe'

    const summonerResponse = await axios.get(
      `/riot/account/v1/accounts/by-riot-id/${nickname}/${tagname}`,
      {
        baseURL: `https://${regionURL}.api.riotgames.com`,
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
      }
    )

    const summonerData: SummonerResponse = summonerResponse.data

    if (!summonerData) {
      return null
    }

    // Busca ícones e nível do invocador
    const iconAndLevelResponse = await fetchSummonerIconAndLevel({puuid: summonerData.puuid})

    if (!iconAndLevelResponse) return null 

    const result = await saveSummoner({
      nickname: summonerData.gameName,
      tagname: summonerData.tagLine,
      puuid: summonerData.puuid,
      level: iconAndLevelResponse.summonerLevel,
      profileIconId: iconAndLevelResponse.profileIconId
    })    

        // Busca liga (elo) do jogador
    const leaguesResponse = await fetchSummonerLeagues({puuid: summonerData.puuid})

    if (!leaguesResponse) return null
    console.log('leagues response', leaguesResponse)
    
    leaguesResponse.map(async (league) => {
      console.log('leagues id', league)

      await upsertSummonerLeagues({leagueId: league.leagueId, hotStreak: league.hotStreak, leaguePoints: league.leaguePoints, losses: league.losses, puuid: league.puuid, queueType: league.queueType, rank: league.rank, tier: league.tier, wins: league.wins})
    })


    return result.length > 0 ? result : null
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.log(err)
    return null
  }
}
