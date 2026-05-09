import { apiClient } from './client';
import { SyncRequest, SyncResponse, ApiResponse } from '../types/api.types';

export const syncApi = {
  async batchSync(payload: SyncRequest): Promise<SyncResponse> {
    const { data } = await apiClient.post<ApiResponse<SyncResponse>>('/sync', payload);
    return data.data;
  },
};
