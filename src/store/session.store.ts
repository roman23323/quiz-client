import { create } from "zustand";
import { sessionApi } from "../services/api/session.api";
import { socket } from "../services/socket/socket";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  questionType: string;
  points: number;
  orderIndex: number;
  options: Option[];
};

type CurrentQuestionResponse = {
  sessionId: string;
  question: Question;
  progress: {
    current: number;
    total: number;
  };
  timing: {
    secondsPerQuestion: number;
  };
};

type GameResult = {
  sessionId: string;

  quiz: {
    id: string;
    title: string;
  };

  result: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    accuracy: number;
    timeSpentMs: number;
  };

  breakdown: {
    questionId: string;
    questionText: string;
    selectedOption: string;
    isCorrect: boolean;
    earnedPoints: number;
    responseTimeMs: number;
  }[];
};

type GameState = {
  sessionId: string | null;
  questionData: CurrentQuestionResponse | null;
  loading: boolean;
  result: GameResult | null;

  questionStartTime: number;

  playersAnswered: string[];

  isFinished: boolean;

  init: (sessionId: string) => Promise<void>;
  loadNext: () => Promise<void>;
  submitAnswer: (optionId: string) => Promise<void>;
  finish: () => Promise<void>;
  initLive: (sessionId: string) => Promise<void>;
  setupSocketListeners: () => void;
  submitLiveAnswer: (optionId: string) => Promise<void>;
  reset: () => Promise<void>;
};

export const useGameStore = create<GameState>((set, get) => ({
  sessionId: null,
  questionData: null,
  loading: true,
  result: null,
  questionStartTime: 0,
  isFinished: false,
  playersAnswered: [],

  init: async (sessionId) => {
    get().reset();
    set({ sessionId, loading: true });

    const res = await sessionApi.getCurrentQuestion(sessionId);

    if (!res.question) {
      await get().finish();
      return;
    }

    set({
      questionData: res,
      questionStartTime: Date.now(),
      loading: false,
    });
  },

  initLive: async (sessionId) => {
    set({
      sessionId,
      loading: false,
    });
  },

  loadNext: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    const res = await sessionApi.getCurrentQuestion(sessionId);

    if (!res.question) {
      await get().finish();
      return;
    }

    set({
      questionData: res,
      questionStartTime: Date.now(),
    });
  },

  submitAnswer: async (optionId) => {
    const { sessionId, questionData, questionStartTime } = get();
    if (!sessionId || !questionData) return;

    const responseTimeMs = Date.now() - questionStartTime;

    const result = await sessionApi.submitAnswer(
      sessionId,
      questionData.question.id,
      optionId,
      responseTimeMs
    );

    if (result.finished) {
      await get().finish();
      return;
    }

    await get().loadNext();
  },

  finish: async () => {
    const { sessionId } = get();
    if (!sessionId) return;

    const result = await sessionApi.getResult(sessionId);

    set({
      result,
      questionData: null,
      loading: false,
      isFinished: true
    });
  },

  setupSocketListeners: () => {
    socket.off("session:question");
    socket.off("session:player-answered");
    socket.off("session:finished");

    socket.on("session:question", (question) => {
      set({
        questionData: question,
        questionStartTime: Date.now(),
      });
    });

    socket.on("session:player-answered", ({ userId }) => {
      set((state) => ({
        playersAnswered: [
          ...state.playersAnswered,
          userId,
        ],
      }));
    });

    socket.on("session:finished", async () => {
      await get().finish();
    });
  },

  submitLiveAnswer: async (
    optionId: string
  ) => {
    const {
      sessionId,
      questionData,
      questionStartTime,
    } = get();

    if (!sessionId || !questionData) return;

    const responseTimeMs =
      Date.now() - questionStartTime;

    socket.emit("session:answer", {
      sessionId,
      dto: {
        questionId: questionData.question.id,
        selectedOptionId: optionId,
        responseTimeMs,
      },
    });
  },

  reset: async () => {
    set({
      sessionId: null,
      questionData: null,
      loading: true,
      result: null,
      questionStartTime: 0,
      isFinished: false,
    });
  },
}));