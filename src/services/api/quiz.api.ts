import { api } from "./axios";

export const quizApi = {
    getAllPublic: async () => {
        const res = await api.get("/quizzes/public");
        return res.data;
    },

    createQuiz: async (payload: {
        title: string;
        description: string;
        visibility: "public" | "private";
        secondsPerQuestion: number;
    }) => {
        const res = await api.post("/quizzes", payload);
        return res.data;
    },

    addQuestion: async (quizId: number, payload: any) => {
        const res = await api.post(`/quizzes/${quizId}/questions`, payload);
        return res.data;
    },

    generateQuiz: async (topic: string) => {
        const res = await api.post("/ai/generate-quiz", { topic });
        return res.data;
    },
};