import api from "./api";
import type { OverviewResponse } from "../types/overview";

export const getOverview = async (
  userId: number
): Promise<OverviewResponse> => {
  const response = await api.get<OverviewResponse>(`/overview/${userId}`);
  return response.data;
};