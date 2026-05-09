import { apiClient } from './client';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task.types';
import { ApiResponse } from '../types/api.types';

export const tasksApi = {
  async getTasks(): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<Task[]>>('/tasks');
    return data.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Task>>('/tasks', payload);
    return data.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
