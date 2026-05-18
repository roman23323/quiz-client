import { View, Text, Button } from "react-native";

export default function LobbyScreen({ route }: any) {
  const { quizId } = route.params;

  const joinSession = () => {
    console.log("join session for quiz:", quizId);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Lobby</Text>
      <Text>Quiz ID: {quizId}</Text>

      <Button title="Join session" onPress={joinSession} />
    </View>
  );
}