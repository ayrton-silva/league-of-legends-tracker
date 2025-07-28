import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { selectMatches } from '../../utils/selectMatches.ts'

export const getMatchesRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/matches/:summonerId',
    {
      schema: {
        params: z.object({
          summonerId: z.string(),
        }),
      },
    },
    async (request) => {
      const { summonerId } = request.params
      const matches = await selectMatches({ puuid: summonerId })

      if (matches.length > 0) {
        return matches
      }

      const summonerByApi = await fetchSummoner({ nickname, tagname })
      return summonerByApi ? summonerByApi : null
    }
  )
}
