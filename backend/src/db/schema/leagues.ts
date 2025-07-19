import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { summoners } from './summoners.ts'

export const leagues = pgTable('leagues', {
    id: text().primaryKey(),
    type: text(),
    points: numeric(),
    tier: text(),
    rank: text(),
    wins: numeric(),
    losses: numeric(),
    summonerId: text().references(() => summoners.puuid),
    updatedAt: timestamp().defaultNow()
})
