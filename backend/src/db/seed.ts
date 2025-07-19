import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, schema).refine((f) => {
  return {
    summoners: {
      count: 10,
      columns: {
        puuid: f.uuid(),
        nickname: f.firstName(),
        region: f.country({ isUnique: false }),
      },
    },
  }
})

await sql.end()

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log('Database seeded!')
