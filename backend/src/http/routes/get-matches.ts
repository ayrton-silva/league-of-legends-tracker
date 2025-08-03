import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { fetchMatches } from '../../services/riot/fetch-matches.ts'
import { selectMatches } from '../../storage/select-matches.ts'
import { upsertMatch } from '../../storage/upsert-match.ts'
import { z } from 'zod/v4'

export const getMatchesRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/matches',
    {
      schema: {
        body: z.object({
          puuid: z.string(),
          region: z.string().optional().default('BR'),
          count: z.number().optional().default(5),
          start: z.number().optional().default(0),
        }),
      },
    },
    async (request) => {
      const { puuid, region, count, start } = request.body

      // Primeiro, tenta buscar do banco de dados
      const matchesFromDB = await selectMatches(puuid, count)

      if (matchesFromDB.length >= count) {
        return matchesFromDB
      }

      // Se não tiver dados suficientes, busca da API
      const matchesFromAPI = await fetchMatches({
        puuid,
        region,
        count,
        start,
      })

      // Salva partidas no banco
      await Promise.all(
        matchesFromAPI.map(async (match) => {
          await upsertMatch(match)
        })
      )

      // Retorna dados combinados
      const allMatches = await selectMatches(puuid, count)
      return allMatches
    }
  )
}
