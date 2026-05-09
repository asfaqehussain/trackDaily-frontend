import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';
import { StatsData, StatsPeriod } from '../types/api.types';

const STATS_QUERY_KEY = ['stats'] as const;

export function useStats(period: StatsPeriod = 'week') {
  return useQuery<StatsData>({
    queryKey: [...STATS_QUERY_KEY, period],
    queryFn: () => statsApi.getStats(period),
    staleTime: 60_000,
  });
}
