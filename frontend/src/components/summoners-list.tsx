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
                <h3 className="font-medium">{summoner.nickname}</h3>
                <p>{summoner.level}</p>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}