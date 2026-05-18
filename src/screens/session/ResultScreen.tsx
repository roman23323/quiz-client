import {
  View,
  Text,
  Button,
  FlatList,
} from "react-native";

import { useGameStore } from "../../store/session.store";

export default function ResultScreen({ navigation }: any) {
  const resultData = useGameStore((s) => s.result);
  const reset = useGameStore((s) => s.reset);

  if (!resultData) {
    return (
      <View>
        <Text>No result</Text>
      </View>
    );
  }

  const { quiz, result, breakdown } = resultData;

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)} sec`;
  };

  const goHome = () => {
    reset();
    navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        Квиз завершён!
      </Text>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 20,
        }}
      >
        {quiz.title}
      </Text>

      <View
        style={{
          backgroundColor: "#f2f2f2",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text>Баллы: {result.score}</Text>

        <Text>
          Правильных ответов: {result.correctCount} /{" "}
          {result.totalQuestions}
        </Text>

        <Text>
          Точность: {(result.accuracy * 100).toFixed(0)}%
        </Text>

        <Text>
          Всего затрачено времени: {formatTime(result.timeSpentMs)}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Ваши ответы:
      </Text>

      <FlatList
        data={breakdown}
        keyExtractor={(item) => item.questionId}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: "#f7f7f7",
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              {item.questionText}
            </Text>

            <Text>
              Ваш ответ: {item.selectedOption}
            </Text>

            <Text>
              Результат: {item.isCorrect ? "Верно!" : "Неверно"}
            </Text>

            <Text>
              Баллы: {item.earnedPoints}
            </Text>

            <Text>
              Время: {formatTime(item.responseTimeMs)}
            </Text>
          </View>
        )}
      />

      <Button title="Back to Home" onPress={goHome} />
    </View>
  );
}