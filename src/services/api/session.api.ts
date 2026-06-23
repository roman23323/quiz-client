import { api } from "./axios";

export const sessionApi = {
  startSolo: async (quizId: string) => {
    const res = await api.post("/sessions", { quizId, mode: 'solo' });
    return res.data;
  },

  createLiveTournament: async (
    quizId: string
  ) => {
    const res = await api.post("/sessions", {
      quizId,
      mode: "live_tournament",
    });

    return res.data;
  },

  getCurrentQuestion: async (sessionId: string) => {
    const res = await api.get(`/sessions/${sessionId}/current-question`);
    return res.data;
  },

  submitAnswer: async (
    sessionId: string,
    questionId: string,
    selectedOptionId: string,
    responseTimeMs: number
  ) => {
    const res = await api.post(`/sessions/${sessionId}/answer`, {
      questionId,
      selectedOptionId,
      responseTimeMs
    });
    return res.data;
  },

  getResult: async (sessionId: string) => {
    const res = await api.get(`/sessions/${sessionId}/result`);
    return res.data;
  },
};