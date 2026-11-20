import api from "./api";
import type {
  SystemDesignTrack,
  SystemDesignPhase,
  SystemDesignTopicSummary,
  SystemDesignTopicDetail,
  SystemDesignTopicTabResponse,
  UserProgressSummary,
  RecentlyVisitedTopic,
  VisitTopicRequest,
  CompleteTopicRequest,
} from "../types/systemDesign";

/**
 * Fetch all system design tracks with user progress.
 */
export const getAllTracks = async (
  userId: number
): Promise<SystemDesignTrack[]> => {
  const response = await api.get<SystemDesignTrack[]>("/system-design/tracks", {
    params: { userId },
  });
  return response.data;
};

/**
 * Fetch all phases for a given track with user completion info.
 */
export const getPhasesByTrack = async (
  trackId: number,
  userId: number
): Promise<SystemDesignPhase[]> => {
  const response = await api.get<SystemDesignPhase[]>(
    `/system-design/tracks/${trackId}/phases`,
    {
      params: { userId },
    }
  );
  return response.data;
};

/**
 * Fetch all topics for a given phase with status for the user.
 */
export const getTopicsByPhase = async (
  phaseId: number,
  userId: number
): Promise<SystemDesignTopicSummary[]> => {
  const response = await api.get<SystemDesignTopicSummary[]>(
    `/system-design/phases/${phaseId}/topics`,
    {
      params: { userId },
    }
  );
  return response.data;
};

/**
 * Fetch full topic details including all tabs content and status.
 */
export const getTopicDetail = async (
  topicId: number,
  userId: number
): Promise<SystemDesignTopicDetail> => {
  const response = await api.get<SystemDesignTopicDetail>(
    `/system-design/topics/${topicId}`,
    {
      params: { userId },
    }
  );
  return response.data;
};

/**
 * Fetch content for a specific topic tab (e.g. overview, theory, examples, diagrams, interview-qa, practice).
 */
export const getTopicTabContent = async (
  topicId: number,
  tab: string
): Promise<SystemDesignTopicTabResponse> => {
  const response = await api.get<SystemDesignTopicTabResponse>(
    `/system-design/topics/${topicId}/tab/${tab}`
  );
  return response.data;
};

/**
 * Fetch user progress summary (total topics, time spent, streak, LLD vs HLD completed).
 */
export const getUserProgressSummary = async (
  userId: number
): Promise<UserProgressSummary> => {
  const response = await api.get<UserProgressSummary>(
    `/system-design/progress/summary/${userId}`
  );
  return response.data;
};

/**
 * Fetch recently visited topics for quick resume.
 */
export const getRecentlyVisited = async (
  userId: number
): Promise<RecentlyVisitedTopic[]> => {
  const response = await api.get<RecentlyVisitedTopic[]>(
    `/system-design/progress/recent/${userId}`
  );
  return response.data;
};

/**
 * Mark a topic as visited.
 */
export const visitTopic = async (
  request: VisitTopicRequest
): Promise<void> => {
  await api.post("/system-design/progress/visit", request);
};

/**
 * Mark a topic as completed.
 */
export const completeTopic = async (
  request: CompleteTopicRequest
): Promise<void> => {
  await api.post("/system-design/progress/complete", request);
};
