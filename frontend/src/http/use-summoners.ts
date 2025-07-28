import { useQuery } from '@tanstack/react-query'
import type { GetSummonersResponse } from './types/get-summoners-response'

export function useSummoners() {
  return useQuery({
    queryKey: ['get-summoners'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/summoners')
      const result: GetSummonersResponse = await response.json()

      return result
    },
  })
}