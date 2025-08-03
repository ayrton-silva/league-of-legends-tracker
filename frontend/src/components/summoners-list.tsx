import { Link } from 'react-router-dom'
import { useSummoners } from '@/http/use-summoners'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export function SummonersList() {
  const { data, isLoading } = useSummoners()

  console.log(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invocadores</CardTitle>
        <CardDescription>Acessar detalhes dos invocadores</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-muted-foreground text-sm">
            Buscando invocadores...
          </p>
        )}

        {data?.map((summoner) => {
          console.log('summoner', summoner)
          return (
            <Link
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
              key={summoner.puuid}
              to={`/room/${summoner.puuid}`}
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="w-10 h-10 rounded-full relative">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/profileicon/${summoner.profileIconId}.png`}
                    alt=""
                  />
                  <p className="absolute bottom-[-10px] left-1/2 -translate-x-1/2">
                    {summoner.level}
                  </p>
                </div>
                <h3 className="font-medium">{summoner.nickname}</h3>
                <p>#{summoner.tagname}</p>

                <div className="flex gap-12">
                  {summoner.leagues.map((league) => (
                    <div
                      key={league.league_points}
                      className="flex flex-col items-center"
                    >
                      <p className="font-bold text-amber-400">
                        {league.queue_type === 'RANKED_FLEX_SR'
                          ? 'Flex'
                          : 'Solo/Duo'}
                      </p>
                      <div className="w-7 h-7 overflow-hidden">
                        <img src={`/assets/elos/${league.tier}.png`} alt="" />
                      </div>
                      <p>{league.ranking}</p>
                      <p>vitorias {league.wins}</p>
                      <p>derrotas {league.losses}</p>
                      <p
                        className={
                          (
                            (league.wins / (league.wins + league.losses)) *
                            100
                          ).toFixed(0) >= 50
                            ? 'text-green-500'
                            : 'text-red-400'
                        }
                      >
                        win rate{' '}
                        {(
                          (league.wins / (league.wins + league.losses)) *
                          100
                        ).toFixed(0)}
                        %
                        <p>
                          {(
                            (league.wins / (league.wins + league.losses)) *
                            100
                          ).toFixed(0) >= 50
                            ? 'BOM'
                            : 'BAGRE'}
                        </p>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
