import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { quizApi } from "../../services/api/quiz.api";

export default function GenerateQuizScreen({ navigation }: any) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const quiz = await quizApi.generateQuiz(topic);

      navigation.navigate("QuizDetails", { quiz })

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
        Генерация квиза
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Введите тему (например: "История Франции")
      </Text>

      <TextInput
        value={topic}
        onChangeText={setTopic}
        placeholder="Тема квиза"
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          paddingVertical: 8,
        }}
      />

      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading || !topic}
        style={{
          backgroundColor: topic ? "#7c3aed" : "#ccc",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {loading ? "Генерация..." : "Сгенерировать"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}