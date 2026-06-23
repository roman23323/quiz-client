import { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";
import { useGameStore } from "../../store/session.store";
import { socket } from "../../services/socket/socket";

type Option = {
  id: string;
  text: string
}

export default function GameScreen({ route, navigation }: any) {
  const { sessionId, mode } = route.params;

  const {
    init,
    initLive,
    setupSocketListeners,
    submitLiveAnswer,
    questionData,
    loading,
    submitAnswer,
    playersAnswered,
    isFinished
  } = useGameStore();

  const submit = (optionId: string) => {
    if (mode === "solo") {
      submitAnswer(optionId);
    } else {
      submitLiveAnswer(optionId);
    }
  }

  useEffect(() => {
    if (mode === "solo") {
      init(sessionId);
    } else {
      initLive(sessionId);
      setupSocketListeners();
    }
  }, []);

  useEffect(() => {
    return () => {
      socket.off("session:question");
      socket.off("session:player-answered");
      socket.off("session:finished");
    };
  }, []);

  useEffect(() => {
    if (isFinished) {
      navigation.replace("Result");
    }
  }, [isFinished]);

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
        <Text>Загрузка квиза...</Text>
      </View>
    );
  }

  const { question, progress, timing } = questionData;

  return (
    <View style={{ padding: 20 }}>
      <Text>
        Вопрос {progress.current} / {progress.total}
      </Text>

      <Text>Время на ответ: {timing.secondsPerQuestion}s</Text>

      <Text style={{ fontSize: 18, marginVertical: 20 }}>
        {question.text}
      </Text>

      {question.options.map((opt: Option) => (
        <Button
          key={opt.id}
          title={opt.text}
          onPress={() => submit(opt.id)}
        />
      ))}
    </View>
  );
}