export interface RunCodeRequest {
  questionId: number;
  code: string;
}

export interface JudgeResponse {
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  message: string;
}