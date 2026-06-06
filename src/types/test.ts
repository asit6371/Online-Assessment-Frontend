export interface TestResponse {
  id: number;

  userId: number;

  questionIds: number[];

  title: string;

  description: string;

  durationMinutes: number;

  startTime: string | null;

  endTime: string | null;
}