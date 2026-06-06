import api from "./api";

import type {
  RunCodeRequest,
  JudgeResponse
} from "../types/judge";

export const runCode =
  async (
    request: RunCodeRequest
  ): Promise<JudgeResponse> => {

    const response =
      await api.post<JudgeResponse>(
        "/execute/run",
        request
      );

    return response.data;
};