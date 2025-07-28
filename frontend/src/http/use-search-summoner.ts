import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SearchSummonerRequest } from './types/search-summoner-request'
import type { SearchSummonerResponse } from './types/search-summoner-response'

export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SearchSummonerRequest) => {
      const response = await fetch('http://localhost:3333/summoners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: SearchSummonerResponse = await response.json()

      return result
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-summoners'] })
    },
  })
}
