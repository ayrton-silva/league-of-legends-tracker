import axios from 'axios'
import { env } from '../../env.ts'
import { upsertSummoner } from '../../storage/upsert-summoner.ts'
import { fetchSummonerIconAndLevel } from './fetch-summoner-icon-and-level.ts'
import { fetchSummonerLeagues } from './fetch-summoner-leagues.ts'
import { upsertSummonerLeagues } from '../../storage/upsert-leagues.ts'
import type { GetSummonerRequest } from '../../types/requests/get-summoners-request.ts'
import type { SummonerResponse } from '../../types/responses/summoner-response.ts'
import type { SummonerLeague } from '../../types/riot/summoner-league.ts'

export async function fetchSummoner({
  nickname,
  tagname,
  region = 'BR',
}: GetSummonerRequest) {
  try {
    const regionURL = region === 'BR' ? 'americas' : 'europe'

    console.log(`=== BUSCANDO SUMMONER ===`)
    console.log(`Nickname: ${nickname}`)
    console.log(`Tagname: ${tagname}`)
    console.log(`Region: ${region}`)
    console.log(`URL: https://${regionURL}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nickname}/${tagname}`)

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

    console.log(`=== DADOS DO SUMMONER ===`)
    console.log(`PUUID: ${summonerData.puuid}`)
    console.log(`GameName: ${summonerData.gameName}`)
    console.log(`TagLine: ${summonerData.tagLine}`)
    console.log(`Tamanho do PUUID: ${summonerData.puuid?.length}`)

    if (!summonerData) {
      return null
    }

    // Validar PUUID
    if (!summonerData.puuid || summonerData.puuid.length < 70) {
      console.error('PUUID inválido ou muito curto:', summonerData.puuid)
      return null
    }

    // Busca ícones e nível do invocador
    const iconAndLevelResponse = await fetchSummonerIconAndLevel({
      puuid: summonerData.puuid,
    })

    if (!iconAndLevelResponse) {
      return null
    }

    const result = await upsertSummoner({
      nickname: summonerData.gameName,
      region,
      tagname: summonerData.tagLine,
      puuid: summonerData.puuid,
      level: iconAndLevelResponse.summonerLevel,
      profileIconId: iconAndLevelResponse.profileIconId,
    })

    // Busca liga (elo) do jogador
    const leaguesResponse = await fetchSummonerLeagues({
      puuid: summonerData.puuid,
    })

    if (!leaguesResponse) {
      return null
    }

    await Promise.all(
      leaguesResponse.map(async (league: SummonerLeague) => {
        await upsertSummonerLeagues(league)
      })
    )

    return result.length > 0 ? result : null
  } catch (err) {
    console.error('=== ERRO AO BUSCAR SUMMONER ===')
    console.error('Erro:', err.message)
    
    if (err.response) {
      console.error('Status:', err.response.status)
      console.error('Dados:', err.response.data)
    }
    
    return null
  }
}
