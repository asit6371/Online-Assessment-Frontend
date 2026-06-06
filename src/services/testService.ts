import api from "./api";

import type {
  TestResponse
} from "../types/test";

export const getAllTests =
  async (): Promise<TestResponse[]> => {

    const response =
      await api.get<TestResponse[]>(
        "/tests"
      );

    return response.data;
};

export const getTestById =
  async (
    id: number
  ): Promise<TestResponse> => {

    const response =
      await api.get<TestResponse>(
        `/tests/${id}`
      );

    return response.data;
};

export const startTest =
  async (
    id: number
  ): Promise<TestResponse> => {

    const response =
      await api.post<TestResponse>(
        `/tests/${id}/start`
      );

    return response.data;
};