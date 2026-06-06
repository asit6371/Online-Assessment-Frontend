import api from "./api";

import type {
  QuestionResponse
} from "../types/question";

export const getQuestionById =
  async (
    id: number
  ): Promise<QuestionResponse> => {

    const response =
      await api.get<QuestionResponse>(
        `/questions/${id}`
      );

    return response.data;
};