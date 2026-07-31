import { QueryClient } from '@tanstack/react-query'

export const REFRESH_INTERVAL = 30000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
