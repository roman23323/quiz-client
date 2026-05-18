import { api } from "./axios";

export const quizApi = {
  getAllPublic: async () => {
    const res = await api.get("/quizzes/public");
    return res.data;
  },
};