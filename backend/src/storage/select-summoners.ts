import { eq, sql } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

export async function selectSummoners() {
  const result = await db
    .select({
      puuid: schema.summoners.puuid,
      nickname: schema.summoners.nickname,
      region: schema.summoners.region,
      updatedAt: schema.summoners.updatedAt,
      tagname: schema.summoners.tagname,
      level: schema.summoners.level,
      profileIconId: schema.summoners.profileIconId,
      leagues: sql`
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'queue_type', ${schema.leagues.queue_type},
                    'tier', ${schema.leagues.tier},
                    'ranking', ${schema.leagues.ranking},
                    'league_points', ${schema.leagues.league_points},
                    'wins', ${schema.leagues.wins},
                    'losses', ${schema.leagues.losses},
                    'hot_streak', ${schema.leagues.hot_streak}
                  )
                )`.as('leagues'),
    })
    .from(schema.summoners)
    .leftJoin(schema.leagues, eq(schema.summoners.puuid, schema.leagues.puuid))
    .groupBy(schema.summoners.puuid)

  return result
}
