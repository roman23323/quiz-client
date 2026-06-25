import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useQuizCreationStore } from "../../store/quiz-create.store";
import { quizApi } from "../../services/api/quiz.api";

export default function CreateQuizScreen({ navigation, route }: any) {
  const { setBaseInfo, createQuiz, title, description, secondsPerQuestion } =
    useQuizCreationStore();

  const [loading, setLoading] = useState(false);

  const quizId = route?.params?.quizId ?? null;

  useEffect(() => {
    if (!quizId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await quizApi.getQuizForEdit(quizId);
        if (!mounted) return;
        setBaseInfo({
          title: data.title || "",
          description: data.description || "",
          secondsPerQuestion: data.secondsPerQuestion ?? 200,
          visibility: data.visibility || "public",
          quizId: data.id,
        });
      } catch (e) {
        console.log("Failed to load quiz for edit:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [quizId, setBaseInfo]);

  const handleCreate = async () => {
    try {
      setLoading(true);
      if (quizId) {
        await useQuizCreationStore.getState().updateQuiz();
        navigation.goBack();
      } else {
        await createQuiz();
        navigation.navigate("AddQuestion");
      }
    } catch (e) {
      console.log('Creating quiz failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!quizId;

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
          {loading ? (isEditMode ? "Сохранение..." : "Создание...") : (isEditMode ? "Сохранить" : "Далее")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}