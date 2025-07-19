import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

type SummonerDataParams = {
  puuid: string
  nickname: string
  tagname: string
  region?: string
}

export async function saveSummoner({
  puuid,
  nickname,
  tagname,
  region = 'Brazil',
}: SummonerDataParams) {
  const result = await db
    .insert(schema.summoners)
    .values({
      puuid,
      nickname,
      tagname,
      region,
    })
    .returning()

  return result
}
