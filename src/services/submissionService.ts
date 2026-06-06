import api from "./api";

import type {
  SubmissionRequest,
  SubmissionResponse
} from "../types/submission";

export const submitCode =
  async (
    request: SubmissionRequest
  ): Promise<SubmissionResponse> => {

    const response =
      await api.post<SubmissionResponse>(
        "/submissions",
        request
      );

    return response.data;
};