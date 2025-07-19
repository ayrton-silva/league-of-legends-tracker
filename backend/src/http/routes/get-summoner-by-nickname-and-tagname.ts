import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { fetchSummoner } from '../../utils/fetchSummoner.ts'
import { selectSummoners } from '../../utils/selectSummoners.ts'
import { z } from 'zod/v4'

export const getSummonerRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/summoners/:nickname/:tagname',
    {
      schema: {
        params: z.object({
          nickname: z.string(),
          tagname: z.string(),
        }),
      },
    },
    async (request) => {
      const { nickname, tagname } = request.params
      const summoners = await selectSummoners({ nickname, tagname })

      if (summoners.length > 0) {
        return summoners
      }

      const summonerByApi = await fetchSummoner({ nickname, tagname })
      return summonerByApi ? summonerByApi : null
    }
  )
}
