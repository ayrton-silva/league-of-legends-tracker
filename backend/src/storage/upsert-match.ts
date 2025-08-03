import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'
import type { Match } from '../types/riot/match.ts'
import { fetchSummonerLeagues } from '../services/riot/fetch-summoner-leagues.ts'
import { upsertSummonerLeagues } from './upsert-leagues.ts'
import axios from 'axios'
import { env } from '../env.ts'
import { rateLimiter } from '../utils/rate-limiter.ts'

// Função para buscar nome do jogador pelo PUUID
function fetchPlayerNameByPUUID(
  puuid: string
): Promise<{ nickname: string; tagname: string } | null> {
  return rateLimiter.executeWithRetry(async () => {
    try {
      const accountResponse = await axios.get(
        `/riot/account/v1/accounts/by-puuid/${puuid}`,
        {
          baseURL: 'https://americas.api.riotgames.com',
          headers: {
            'X-Riot-Token': env.RIOT_API_KEY,
          },
          timeout: 5000,
        }
      )

      const accountData = accountResponse.data

      if (accountData?.gameName && accountData.tagLine) {
        return {
          nickname: accountData.gameName,
          tagname: accountData.tagLine,
        }
      }

      return null
    } catch (error) {
      console.error(`Erro ao buscar nome do jogador ${puuid}:`, error.message)
      return null
    }
  })
}

export async function upsertMatch(match: Match) {
  try {
    // Inserir/atualizar partida
    await db
      .insert(schema.matches)
      .values({
        matchId: match.info.gameId.toString(),
        gameCreation: new Date(match.info.gameCreation),
        gameDuration: match.info.gameDuration,
        gameEndTimestamp: new Date(match.info.gameEndTimestamp),
        gameId: match.info.gameId,
        gameMode: match.info.gameMode,
        gameName: match.info.gameName,
        gameStartTimestamp: new Date(match.info.gameStartTimestamp),
        gameType: match.info.gameType,
        gameVersion: match.info.gameVersion,
        mapId: match.info.mapId,
        participants: JSON.stringify(
          match.info.participants.map((p) => p.puuid)
        ),
        platformId: match.info.platformId,
        queueId: match.info.queueId,
        teams: JSON.stringify(match.info.teams),
        tournamentCode: match.info.tournamentCode,
      })
      .onConflictDoUpdate({
        target: schema.matches.matchId,
        set: {
          gameDuration: match.info.gameDuration,
          gameEndTimestamp: new Date(match.info.gameEndTimestamp),
          participants: JSON.stringify(
            match.info.participants.map((p) => p.puuid)
          ),
          teams: JSON.stringify(match.info.teams),
          updatedAt: new Date(),
        },
      })

    // Buscar nomes dos jogadores em lotes (máximo 5 por vez)
    console.log('=== BUSCANDO NOMES DOS JOGADORES ===')
    const batchSize = 5
    const puuidToNameMap = new Map()

    for (let i = 0; i < match.info.participants.length; i += batchSize) {
      const batch = match.info.participants.slice(i, i + batchSize)

      const batchPromises = batch.map(async (participant) => {
        const playerName = await fetchPlayerNameByPUUID(participant.puuid)
        return {
          puuid: participant.puuid,
          playerName,
        }
      })

      const batchResults = await Promise.all(batchPromises)

      batchResults.forEach((result) => {
        if (result.playerName) {
          puuidToNameMap.set(result.puuid, result.playerName)
        }
      })

      // Pequena pausa entre lotes
      if (i + batchSize < match.info.participants.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.log('=== MAPA DE NOMES ===')
    puuidToNameMap.forEach((name, puuid) => {
      console.log(`PUUID: ${puuid} -> Nome: ${name.nickname}#${name.tagname}`)
    })

    // Inserir summoners automaticamente se não existirem
    const summonersToInsert = match.info.participants.map((participant) => {
      const playerName = puuidToNameMap.get(participant.puuid)

      return {
        puuid: participant.puuid,
        nickname:
          playerName?.nickname ||
          participant.riotIdName ||
          participant.summonerName ||
          '',
        tagname: playerName?.tagname || participant.riotIdTagline || '',
        region: 'BR',
        profileIconId: participant.profileIcon,
        level: participant.summonerLevel,
      }
    })

    // biome-ignore lint/suspicious/noConsole: only for dev
    console.log('=== DADOS DOS SUMMONERS ===')
    summonersToInsert.forEach((summoner, index) => {
      // biome-ignore lint/suspicious/noConsole: only for dev
      console.log(`Summoner ${index + 1}:`, summoner)
    })

    // Inserir/atualizar summoners com todos os campos
    for (const summoner of summonersToInsert) {
      await db
        .insert(schema.summoners)
        .values(summoner)
        .onConflictDoUpdate({
          target: schema.summoners.puuid,
          set: {
            nickname: summoner.nickname,
            tagname: summoner.tagname,
            profileIconId: summoner.profileIconId,
            level: summoner.level,
            updatedAt: new Date(),
          },
        })
    }

    // Inserir/atualizar participantes
    const participantsData = match.info.participants.map((participant) => {
      const playerName = puuidToNameMap.get(participant.puuid)

      return {
        id: `${match.info.gameId}_${participant.puuid}`,
        matchId: match.info.gameId.toString(),
        puuid: participant.puuid,
        summonerName:
          playerName?.nickname ||
          participant.summonerName ||
          participant.riotIdName ||
          '',
        summonerId: participant.summonerId,
        championId: participant.championId,
        championName: participant.championName,
        teamId: participant.teamId,
        win: participant.win,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        goldEarned: participant.goldEarned,
        totalDamageDealt: participant.totalDamageDealt,
        totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
        totalDamageTaken: participant.totalDamageTaken,
        visionScore: participant.visionScore,
        cs: participant.totalMinionsKilled,
        gameDuration: match.info.gameDuration,
      }
    })

    // Inserir/atualizar participantes com todos os campos
    for (const participant of participantsData) {
      await db
        .insert(schema.matchParticipants)
        .values(participant)
        .onConflictDoUpdate({
          target: schema.matchParticipants.id,
          set: {
            summonerName: participant.summonerName,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            goldEarned: participant.goldEarned,
            totalDamageDealt: participant.totalDamageDealt,
            totalDamageDealtToChampions:
              participant.totalDamageDealtToChampions,
            totalDamageTaken: participant.totalDamageTaken,
            visionScore: participant.visionScore,
            cs: participant.cs,
            updatedAt: new Date(),
          },
        })
    }

    // Inserir/atualizar itens dos participantes
    const itemsData: Array<{
      id: string
      matchParticipantId: string
      slot: number
      itemId: number
    }> = []

    match.info.participants.forEach((participant) => {
      const participantId = `${match.info.gameId}_${participant.puuid}`

      // Adicionar todos os slots de itens (0-6)
      const items = [
        participant.item0,
        participant.item1,
        participant.item2,
        participant.item3,
        participant.item4,
        participant.item5,
        participant.item6,
      ]

      items.forEach((itemId, slot) => {
        if (itemId && itemId > 0) {
          itemsData.push({
            id: `${participantId}_${slot}`,
            matchParticipantId: participantId,
            slot,
            itemId,
          })
        }
      })
    })

    if (itemsData.length > 0) {
      await db
        .insert(schema.participantItems)
        .values(itemsData)
        .onConflictDoUpdate({
          target: schema.participantItems.id,
          set: {
            itemId: undefined,
            updatedAt: new Date(),
          },
        })
    }

    // Atualizar leagues dos participantes (apenas para partidas ranqueadas)
    if (match.info.queueId === 420 || match.info.queueId === 440) {
      // Solo/Duo e Flex
      try {
        // Buscar leagues em lotes
        const leagueBatchSize = 3
        for (
          let i = 0;
          i < match.info.participants.length;
          i += leagueBatchSize
        ) {
          const batch = match.info.participants.slice(i, i + leagueBatchSize)

          const leaguePromises = batch.map(async (participant) => {
            const leagues = await fetchSummonerLeagues({
              puuid: participant.puuid,
            })
            return { puuid: participant.puuid, leagues }
          })

          const leagueResults = await Promise.all(leaguePromises)

          // Salvar leagues no banco
          for (const result of leagueResults) {
            if (result.leagues) {
              for (const league of result.leagues) {
                await upsertSummonerLeagues(league)
              }
            }
          }

          // Pausa entre lotes de leagues
          if (i + leagueBatchSize < match.info.participants.length) {
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }
        }
      } catch (leagueError) {
        // biome-ignore lint/suspicious/noConsole: only for dev
        console.error('Erro ao atualizar leagues:', leagueError)
      }
    }

    return true
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.error('Erro ao salvar partida:', error)
    return false
  }
}
