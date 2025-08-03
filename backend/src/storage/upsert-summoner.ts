import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

export async function upsertSummoner(summonerData: {
  puuid: string
  nickname: string
  tagname: string
  region: string
  profileIconId: number
  level: number
}) {
  return await db
    .insert(schema.summoners)
    .values(summonerData)
    .onConflictDoUpdate({
      target: schema.summoners.puuid,
      set: {
        nickname: summonerData.nickname,
        tagname: summonerData.tagname,
        profileIconId: summonerData.profileIconId,
        level: summonerData.level,
        updatedAt: new Date(),
      },
    })
}
