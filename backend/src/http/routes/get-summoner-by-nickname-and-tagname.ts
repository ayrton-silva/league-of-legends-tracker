import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { fetchSummoner } from '../../services/riot/fetch-summoner.ts'
import { selectSummoner } from '../../storage/select-summoner.ts'
import { z } from 'zod/v4'

export const getSummonerRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/summoners',
    {
      schema: {
        body: z.object({
          nickname: z.string(),
          tagname: z.string(),
          region: z.string(),
        }),
      },
    },
    async (request) => {
      const { nickname, tagname, region } = request.body
      const summoner = await selectSummoner({ nickname, tagname, region })

      if (summoner.length > 0) {
        return summoner
      }

      const summonerByApi = await fetchSummoner({ nickname, tagname, region })
      return summonerByApi ? summonerByApi : null
    }
  )
}
