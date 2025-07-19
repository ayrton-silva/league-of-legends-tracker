import { desc, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getSummonersRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/summoners/:nickname',
    {
      schema: {
        params: z.object({
          nickname: z.string(),
        }),
      },
    },
    async (request) => {
      const { nickname } = request.params

      const result = await db
        .select({
          puuid: schema.summoners.puuid,
          nickname: schema.summoners.nickname,
          region: schema.summoners.region,
          updatedAt: schema.summoners.updatedAt,
          tagname: schema.summoners.tagname
        })
        .from(schema.summoners)
        .where(eq(schema.summoners.nickname, nickname))
        .orderBy(desc(schema.summoners.updatedAt))

      return result
    }
  )
}