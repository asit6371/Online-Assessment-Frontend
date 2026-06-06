export interface QuestionResponse {
  id: number;
  title: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  difficulty: string;
  topic: string;
  // Starter code shown in editor — driverCode is never sent to frontend
  starterCode: string;
}