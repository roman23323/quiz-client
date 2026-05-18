import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useQuizCreationStore } from "../../store/quiz-create.store";

export default function CreateQuizScreen({ navigation }: any) {
  const { setBaseInfo, createQuiz, title, description, secondsPerQuestion } =
    useQuizCreationStore();

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createQuiz();
      navigation.navigate("AddQuestion");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
        Создание квиза
      </Text>

      <TextInput
        placeholder="Название"
        value={title}
        onChangeText={(text) => setBaseInfo({ title: text })}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Описание"
        value={description}
        onChangeText={(text) => setBaseInfo({ description: text })}
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TextInput
        placeholder="Секунд на вопрос"
        value={String(secondsPerQuestion)}
        keyboardType="numeric"
        onChangeText={(text) =>
          setBaseInfo({ secondsPerQuestion: Number(text) })
        }
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        style={{
          backgroundColor: "#4f46e5",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {loading ? "Создание..." : "Далее"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}