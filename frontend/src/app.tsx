import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TeamDashboard } from './pages/team-dashboard'
import { Summoner } from './pages/summoner'
import { Summoners } from './pages/summoners'
import { Header } from './components/header'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<TeamDashboard />} index />
          <Route element={<Summoners />} path="/summoners" />
          <Route element={<Summoner />} path="/summoners/:summonerId" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
