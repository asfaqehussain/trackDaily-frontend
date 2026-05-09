import { apiClient } from './client';
import { ApiResponse, StatsData, StatsPeriod } from '../types/api.types';

export const statsApi = {
  async getStats(period: StatsPeriod = 'week'): Promise<StatsData> {
    const { data } = await apiClient.get<ApiResponse<StatsData>>('/stats', {
      params: { period },
    });
    return data.data;
  },
};
