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
        <CardDescription>
          Acessar detalhes dos invocadores
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-muted-foreground text-sm">Buscando invocadores...</p>
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
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={`https://ddragon.leagueoflegends.com/cdn/15.14.1/img/profileicon/${summoner.profileIconId}.png`} alt="" />
                </div>
                <h3 className="font-medium w-[200px]">{summoner.nickname}</h3>
                <div className='flex gap-4'>
                  {summoner.leagues.map(league => (
                  <div key={league.league_points} className='flex flex-col items-center'>
                    <p>{league.queue_type === 'RANKED_FLEX_SR' ? 'Flex': 'Solo/Duo'}</p>
                    <div className="w-7 h-7 overflow-hidden">
                    <img src={`/assets/elos/${league.tier}.png`} alt="" />
                    </div>
                    <p>{league.ranking}</p>
                    <p>vitorias { league.wins}</p>
                    <p>derrotas { league.losses}</p>
                    <p>win rate { ((league.wins / (league.wins + league.losses)) * 100).toFixed(0)}%</p>
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