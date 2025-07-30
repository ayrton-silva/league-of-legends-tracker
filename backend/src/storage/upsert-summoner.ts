import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'
import type { Summoner } from '../types/riot/summoner.ts'

export async function upsertSummoner({
  puuid,
  nickname,
  tagname,
  region = 'Brazil',
  level,
  profileIconId,
}: Summoner) {
  const result = await db
    .insert(schema.summoners)
    .values({
      puuid,
      nickname,
      tagname,
      region,
      level,
      profileIconId,
    })
    .returning()

  return result
}
