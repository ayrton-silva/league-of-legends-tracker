import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'
import { eq, desc, inArray } from 'drizzle-orm'

// Função para buscar partidas de um summoner específico
export async function selectMatches(puuid: string, count = 10) {
  try {
    const matches = await db
      .select({
        matchId: schema.matches.matchId,
        gameCreation: schema.matches.gameCreation,
        gameDuration: schema.matches.gameDuration,
        gameMode: schema.matches.gameMode,
        gameType: schema.matches.gameType,
        queueId: schema.matches.queueId,
        win: schema.matchParticipants.win,
        championId: schema.matchParticipants.championId,
        championName: schema.matchParticipants.championName,
        kills: schema.matchParticipants.kills,
        deaths: schema.matchParticipants.deaths,
        assists: schema.matchParticipants.assists,
        cs: schema.matchParticipants.cs,
        goldEarned: schema.matchParticipants.goldEarned,
      })
      .from(schema.matches)
      .innerJoin(
        schema.matchParticipants,
        eq(schema.matches.matchId, schema.matchParticipants.matchId)
      )
      .where(eq(schema.matchParticipants.puuid, puuid))
      .orderBy(desc(schema.matches.gameCreation))
      .limit(count)

    return matches
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.error('Erro ao buscar partidas:', error)
    return []
  }
}

export async function selectMatchesWithParticipantsAndItems(matchId: string) {
  try {
    const match = await db
      .select()
      .from(schema.matches)
      .where(eq(schema.matches.matchId, matchId))
      .limit(1)

    if (match.length === 0) {
      return null
    }

    const participants = await db
      .select()
      .from(schema.matchParticipants)
      .where(eq(schema.matchParticipants.matchId, matchId))

    if (participants.length === 0) {
      return {
        ...match[0],
        participants: [],
      }
    }

    const participantIds = participants.map((p) => p.id)

    try {
      // Busca itens para todos os participantes
      const allItems = await db
        .select()
        .from(schema.participantItems)
        .where(
          inArray(schema.participantItems.matchParticipantId, participantIds)
        )

      // Organiza itens por participante
      const participantsWithItems = participants.map((participant) => {
        const participantItems = allItems.filter(
          (item) => item.matchParticipantId === participant.id
        )

        return {
          ...participant,
          items: participantItems.sort((a, b) => a.slot - b.slot),
        }
      })

      return {
        ...match[0],
        participants: participantsWithItems,
      }
    } catch (itemsError) {
      // biome-ignore lint/suspicious/noConsole: only for dev
      console.error(
        'Erro ao buscar itens, retornando participantes sem itens:',
        itemsError
      )

      // Se der erro ao buscar itens, retorna participantes sem itens
      const participantsWithoutItems = participants.map((participant) => ({
        ...participant,
        items: [],
      }))

      return {
        ...match[0],
        participants: participantsWithoutItems,
      }
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: only for dev
    console.error('Erro ao buscar partida com participantes e itens:', error)
    return null
  }
}
