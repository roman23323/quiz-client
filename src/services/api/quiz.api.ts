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

    deleteQuiz: async (quizId: string) => {
        const res = await api.delete(`/quizzes/${quizId}`);
        return res.data;
    },

    updateQuiz: async (quizId: string | number, payload: Partial<{
        title: string;
        description: string;
        visibility: "public" | "private";
        secondsPerQuestion: number;
    }>) => {
        const res = await api.patch(`/quizzes/${quizId}`, payload);
        return res.data;
    },

    addQuestion: async (quizId: number, payload: any) => {
        const res = await api.post(`/quizzes/${quizId}/questions`, payload);
        return res.data;
    },

    updateQuestion: async (quizId: number, questionId: string | number, payload: any) => {
        const res = await api.patch(`/quizzes/${quizId}/questions/${questionId}`, payload);
        return res.data;
    },

    getQuizForEdit: async (quizId: string | number) => {
        const res = await api.get(`/quizzes/${quizId}/edit`);
        return res.data;
    },

    deleteQuestion: async (quizId: string | number, questionId: string | number) => {
        const res = await api.delete(`/quizzes/${quizId}/questions/${questionId}`);
        return res.data;
    },

    generateQuiz: async (topic: string) => {
        const res = await api.post("/ai/generate-quiz", { topic });
        return res.data;
    },
};