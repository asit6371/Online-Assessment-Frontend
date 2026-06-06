export interface SubmissionRequest {
  sessionId: number;
  questionId: number;
  userId: number;
  code: string;
}

export interface SubmissionResponse {
  id: number;
  userId: number;
  sessionId: number;
  questionId: number;
  code: string;
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  submittedAt: string;
}