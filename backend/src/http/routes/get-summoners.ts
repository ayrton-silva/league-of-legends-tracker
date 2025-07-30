import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { selectSummoners } from '../../storage/select-summoners.ts'

export const getSummonersRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/summoners', async () => {
    const result = await selectSummoners()
    return result
  })
}
