import {
  View,
  Text,
  Button,
} from "react-native";

import { sessionApi } from "../../services/api/session.api";

export default function QuizDetailsScreen({
  route,
  navigation,
}: any) {
  const { quiz } = route.params;

  const playSolo = async () => {
    const session =
      await sessionApi.startSolo(quiz.id);

    navigation.navigate("Game", {
      sessionId: session.id,
      mode: "solo",
    });
  };

  const createLiveTournament =
    async () => {
      const session =
        await sessionApi.createLiveTournament(
          quiz.id
        );

      navigation.navigate("Lobby", {
        sessionId: session.id,
      });
    };

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          marginBottom: 10,
        }}
      >
        {quiz.title}
      </Text>

      <Text
        style={{
          marginBottom: 20,
        }}
      >
        {quiz.description}
      </Text>

      <Button
        title="Play Solo"
        onPress={playSolo}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Create Live Tournament"
        onPress={createLiveTournament}
      />
    </View>
  );
}