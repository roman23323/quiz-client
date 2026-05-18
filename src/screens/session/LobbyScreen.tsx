import { useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { sessionApi } from "../../services/api/session.api";

export default function LobbyScreen({ route, navigation }: any) {
  const { quizId } = route.params;

  const [loading, setLoading] = useState(false);

  const joinSession = async () => {
    setLoading(true);

    try {
      const session = await sessionApi.startSolo(quizId);

      navigation.replace("Game", {
        sessionId: session.id,
        quizId,
        mode: "solo",
      });
    } catch (e) {
      console.log("join session error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Лобби</Text>
      <Text style={{ marginVertical: 10 }}>ID квиза: {quizId}</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Начать квиз" onPress={joinSession} />
      )}
    </View>
  );
}