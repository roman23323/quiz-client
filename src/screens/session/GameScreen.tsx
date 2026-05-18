import { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";
import { sessionApi } from "../../services/api/session.api";

type CurrentQuestionResponse = {
  sessionId: string;
  question: {
    id: string;
    text: string;
    questionType: string;
    points: number;
    orderIndex: number;
    options: { id: string; text: string }[];
  };
  progress: {
    current: number;
    total: number;
  };
  timing: {
    secondsPerQuestion: number;
  };
};

export default function GameScreen({ route }: any) {
  const { sessionId, mode } = route.params;

  const [questionData, setQuestionData] =
    useState<CurrentQuestionResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const questionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const res = await sessionApi.getCurrentQuestion(sessionId);

      if (res.question === null) {
        await finishSession();
        return;
      }

      setQuestionData(res);
      questionStartTimeRef.current = Date.now();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadNext = async () => {
    const res = await sessionApi.getCurrentQuestion(sessionId);

    if (!res.question) {
      await finishSession();
      return;
    }

    setQuestionData(res);
    questionStartTimeRef.current = Date.now();
  };

  const sendAnswer = async (optionId: string) => {
    if (!questionData) return;

    const responseTimeMs =
      Date.now() - questionStartTimeRef.current;

    try {
      const result = await sessionApi.submitAnswer(
        sessionId,
        questionData.question.id,
        optionId,
        responseTimeMs
      );

      if (result.finished) {
        await finishSession();
        return;
      }

      await loadNext();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const finishSession = async () => {
    const result = await sessionApi.getResult(sessionId);
    console.log("RESULT:", result);
    setQuestionData(null);
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!questionData) {
    return (
      <View>
        <Text>Quiz finished</Text>
      </View>
    );
  }

  const { question, progress, timing } = questionData;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        Вопрос {progress.current} / {progress.total}
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Время на ответ: {timing.secondsPerQuestion}с
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        {question.text}
      </Text>

      {question.options.map((opt) => (
        <Button
          key={opt.id}
          title={opt.text}
          onPress={() => sendAnswer(opt.id)}
        />
      ))}
    </View>
  );
}