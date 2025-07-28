import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getSummonersRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/summoners',
    async () => {
      const result = await db
        .select({
          puuid: schema.summoners.puuid,
          nickname: schema.summoners.nickname,
          region: schema.summoners.region,
          updatedAt: schema.summoners.updatedAt,
          tagname: schema.summoners.tagname,
          level: schema.summoners.level,
          profileIconId: schema.summoners.profileIconId
        })
        .from(schema.summoners)
        .orderBy(schema.summoners.nickname)

      return result
    }
  )
}