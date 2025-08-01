import { and, eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'
import type { GetSummonerRequest } from '../types/requests/get-summoners-request.ts'

export async function selectSummoner({
  nickname,
  tagname,
  region,
}: GetSummonerRequest) {
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
