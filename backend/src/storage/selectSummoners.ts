import { and, eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

type SelectSummonersParams = {
  nickname: string
  tagname: string
  region: string
}

export async function selectSummoners({
  nickname,
  tagname,
  region
}: SelectSummonersParams) {
  const result = await db
    .select({
      puuid: schema.summoners.puuid,
      nickname: schema.summoners.nickname,
      region: schema.summoners.region,
      tagname: schema.summoners.tagname,
      updatedAt: schema.summoners.updatedAt,
    })
    .from(schema.summoners)
    .where(
      and(
        eq(schema.summoners.nickname, nickname),
        eq(schema.summoners.tagname, tagname),
        eq(schema.summoners.region, region)
      )
    )

  return result
}
