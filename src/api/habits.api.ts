import { apiClient } from './client';
import { Habit, CreateHabitPayload, UpdateHabitPayload } from '../types/habit.types';
import { ApiResponse } from '../types/api.types';

export const habitsApi = {
  async getHabits(): Promise<Habit[]> {
    const { data } = await apiClient.get<ApiResponse<Habit[]>>('/habits');
    return data.data;
  },

  async createHabit(payload: CreateHabitPayload): Promise<Habit> {
    const { data } = await apiClient.post<ApiResponse<Habit>>('/habits', payload);
    return data.data;
  },

  async updateHabit(id: string, payload: UpdateHabitPayload): Promise<Habit> {
    const { data } = await apiClient.patch<ApiResponse<Habit>>(`/habits/${id}`, payload);
    return data.data;
  },

  async checkIn(habitId: string, date: string): Promise<Habit> {
    const { data } = await apiClient.post<ApiResponse<Habit>>(`/habits/${habitId}/checkin`, {
      date,
    });
    return data.data;
  },

  async deleteHabit(id: string): Promise<void> {
    await apiClient.delete(`/habits/${id}`);
  },
};
