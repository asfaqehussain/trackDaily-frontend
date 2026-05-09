export interface Habit {
  id: string;
  name: string;
  description?: string;
  checkIns: string[]; // ISO date strings e.g. ["2026-05-05", "2026-05-04"]
  streak: number;     // computed locally from checkIns
  createdAt: string;
  updatedAt: string;
  // UI fields
  icon?: string;       // Ionicons name, default 'checkmark-circle-outline'
  color?: string;      // hex color, default '#5B4FE8'
  repeatType?: 'daily' | 'weekdays' | 'custom';
  repeatDays?: number[]; // 0=Mon ... 6=Sun
}

export interface CreateHabitPayload {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  repeatType?: 'daily' | 'weekdays' | 'custom';
  repeatDays?: number[];
}

export interface UpdateHabitPayload {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  repeatType?: 'daily' | 'weekdays' | 'custom';
  repeatDays?: number[];
  updatedAt?: string;
}

export interface CheckInPayload {
  habitId: string;
  date: string;
}
