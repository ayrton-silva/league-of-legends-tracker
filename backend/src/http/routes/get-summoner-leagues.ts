import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { fetchSummonerLeagues } from '../../services/riot/fetch-summoner-leagues.ts'
import { upsertSummonerLeagues } from '../../storage/upsert-leagues.ts'
import { z } from 'zod/v4'

export const getSummonerLeaguesRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/summoner-leagues',
    {
      schema: {
        body: z.object({
          puuid: z.string(),
        }),
      },
    },
    async (request) => {
      const { puuid } = request.body

      try {
        const leagues = await fetchSummonerLeagues({ puuid })

        if (leagues) {
          // Salvar leagues no banco
          for (const league of leagues) {
            await upsertSummonerLeagues(league)
          }
        }

        return leagues || []
      } catch (error) {
        console.error('Erro ao buscar leagues:', error)
        return []
      }
    }
  )
} 