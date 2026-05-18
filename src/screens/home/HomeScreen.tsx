import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { quizApi } from "../../services/api/quiz.api";

type Quiz = {
  id: string;
  title: string;
  description: string;
  secondsPerQuestion: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
};

export default function HomeScreen({ navigation }: any) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await quizApi.getAllPublic();
      setQuizzes(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quizId: string) => {
    navigation.navigate("Lobby", { quizId });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 10 }}>
        Доступные квизы:
      </Text>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => startQuiz(item.id)}
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: "#f2f2f2",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.title}
            </Text>

            <Text style={{ marginTop: 4, color: "#555" }}>
              {item.description}
            </Text>

            <Text style={{ marginTop: 6, fontSize: 12, color: "#777" }}>
              ⏱ {item.secondsPerQuestion} секунд на вопрос
            </Text>

            <Text style={{ fontSize: 12, color: "#999" }}>
              Создано: {formatDate(item.createdAt)}
            </Text>

            <Text style={{ fontSize: 12, color: "#666" }}>
              Автор: {item.author.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}