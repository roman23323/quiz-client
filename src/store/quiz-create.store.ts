import { create } from "zustand";
import { quizApi } from "../services/api/quiz.api";

type Option = {
  text: string;
  isCorrect: boolean;
};

type QuestionDraft = {
  text: string;
  questionType: "single_choice";
  points: number;
  options: Option[];
};

type QuizCreationState = {
  quizId: number | null;

  title: string;
  description: string;
  visibility: "public" | "private";
  secondsPerQuestion: number;

  questions: QuestionDraft[];

  setBaseInfo: (data: Partial<QuizCreationState>) => void;

  createQuiz: () => Promise<void>;
  addQuestion: (q: QuestionDraft) => Promise<void>;
  updateQuiz: () => Promise<void>;

  reset: () => void;
};

export const useQuizCreationStore = create<QuizCreationState>((set, get) => ({
  quizId: null,

  title: "",
  description: "",
  visibility: "public",
  secondsPerQuestion: 200,

  questions: [],

  setBaseInfo: (data) => set((state) => ({ ...state, ...data })),

  createQuiz: async () => {
    const state = get();

    const quiz = await quizApi.createQuiz({
      title: state.title,
      description: state.description,
      visibility: state.visibility,
      secondsPerQuestion: state.secondsPerQuestion,
    });

    set({ quizId: quiz.id });
  },

  updateQuiz: async () => {
    const state = get();
    if (!state.quizId) return;

    await quizApi.updateQuiz(state.quizId, {
      title: state.title,
      description: state.description,
      visibility: state.visibility,
      secondsPerQuestion: state.secondsPerQuestion,
    });
  },

  addQuestion: async (q) => {
    const state = get();
    if (!state.quizId) return;

    const orderIndex = state.questions.length;

    const payload = {
      text: q.text,
      questionType: q.questionType,
      points: q.points,
      orderIndex,
      options: q.options.map((o, i) => ({
        ...o,
        orderIndex: i,
      })),
    };

    await quizApi.addQuestion(state.quizId, payload);

    set((s) => ({
      questions: [...s.questions, q],
    }));
  },

  reset: () =>
    set({
      quizId: null,
      title: "",
      description: "",
      visibility: "public",
      secondsPerQuestion: 200,
      questions: [],
    }),
}));