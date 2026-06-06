import api from "./api";
import type { AssessmentSessionResponse } from "../types/session";

export const startSession = async (
  category: string,
  userId: number
): Promise<AssessmentSessionResponse> => {

  const response = await api.post<AssessmentSessionResponse>(
    `/sessions/start/${category}`,
    null,
    { params: { userId } }
  );

  return response.data;
};

export const getSession = async (
  sessionId: number
): Promise<AssessmentSessionResponse> => {

  const response = await api.get<AssessmentSessionResponse>(
    `/sessions/${sessionId}`
  );

  return response.data;
};