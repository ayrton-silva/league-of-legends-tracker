import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

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
    }
  )
}
