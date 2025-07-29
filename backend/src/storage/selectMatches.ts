import { eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

type SelectSummonersParams = {
  puuid: string
}

export async function selectMatches({ puuid }: SelectSummonersParams) {
  const result = await db
    .select({
      puuid: schema.summoners.puuid,
      nickname: schema.summoners.nickname,
      region: schema.summoners.region,
      tagname: schema.summoners.tagname,
      updatedAt: schema.summoners.updatedAt,
    })
    .from(schema.summoners)
    .where(eq(schema.matches, puuid))

  return result
}
