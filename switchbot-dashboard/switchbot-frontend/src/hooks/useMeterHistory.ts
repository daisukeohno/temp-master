import { useQuery } from '@tanstack/react-query'
import { fetchMeterHistory } from '../api/client'
import { REFRESH_INTERVAL } from '../constants/config'
import type { TimeScale } from '../api/types'

export function useMeterHistory(deviceId: string, timeScale: TimeScale, enabled = true) {
  return useQuery({
    queryKey: ['meter-history', deviceId, timeScale],
    queryFn: () => fetchMeterHistory(deviceId, timeScale),
    refetchInterval: REFRESH_INTERVAL,
    enabled,
  })
}
