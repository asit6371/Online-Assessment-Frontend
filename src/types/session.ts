export interface AssessmentSessionResponse {
  id: number;
  userId: number;
  category: string;
  questionIds: number[];
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
}