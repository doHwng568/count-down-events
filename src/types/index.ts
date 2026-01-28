export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: number; // timestamp
  isHardcoded?: boolean;
}

export interface CompletedEvent extends CountdownEvent {
  completedAt: number;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
