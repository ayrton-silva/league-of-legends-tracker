import axios from 'axios'
import { env } from '../../env.ts'
import type { GetMatchesRequest } from '../../types/requests/get-matches-request.ts'
import type { Match } from '../../types/riot/match.ts'

export async function fetchMatches({
  puuid,
  region = 'BR',
  count = 20,
  start = 0,
}: GetMatchesRequest) {
  try {
    // Validar PUUID
    if (!puuid || puuid.length < 10) {
      console.error('PUUID inválido:', puuid)
      return []
    }

    // Para o Brasil, usar a região americas
    const regionURL = 'americas'

    console.log('=== DEBUG FETCH MATCHES ===')
    console.log(`PUUID: ${puuid}`)
    console.log(`Region: ${region}`)
    console.log(`Count: ${count}`)
    console.log(`Start: ${start}`)
    console.log(`API Key: ${env.RIOT_API_KEY ? 'Presente' : 'Ausente'}`)
    console.log(`URL: https://${regionURL}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`)

    // Buscar lista de IDs das partidas
    const matchIdsResponse = await axios.get(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
      {
        baseURL: `https://${regionURL}.api.riotgames.com`,
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
        },
        timeout: 10000, // 10 segundos de timeout
      }
    )

    const matchIds: string[] = matchIdsResponse.data

    console.log(`IDs das partidas encontradas:`, matchIds)

    if (!matchIds || matchIds.length === 0) {
      console.log('Nenhuma partida encontrada')
      return []
    }

    // Buscar detalhes de cada partida
    const matchesPromises = matchIds.map(async (matchId) => {
      try {
        console.log(`Buscando detalhes da partida: ${matchId}`)
        const matchResponse = await axios.get(
          `/lol/match/v5/matches/${matchId}`,
          {
            baseURL: `https://${regionURL}.api.riotgames.com`,
            headers: {
              'X-Riot-Token': env.RIOT_API_KEY,
            },
            timeout: 10000,
          }
        )

        return matchResponse.data as Match
      } catch (error) {
        console.error(`Erro ao buscar partida ${matchId}:`, error)
        return null
      }
    })

    const matches = await Promise.all(matchesPromises)
    const validMatches = matches.filter((match): match is Match => match !== null)
    
    console.log(`Partidas válidas encontradas: ${validMatches.length}`)
    return validMatches
  } catch (err) {
    console.error('=== ERRO DETALHADO ===')
    console.error('Erro ao buscar partidas:', err.message)
    
    // Log mais detalhado do erro
    if (err.response) {
      console.error('Status do erro:', err.response.status)
      console.error('Dados do erro:', err.response.data)
      console.error('URL da requisição:', err.config?.url)
      console.error('Headers da requisição:', err.config?.headers)
    }
    
    return []
  }
} 