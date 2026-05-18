import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
} from "react-native";

import {
  socket,
  connectSocket,
} from "../../services/socket/socket";

export default function LobbyScreen({
  route,
  navigation,
}: any) {
  const { sessionId } = route.params;

  const [joinedUsers, setJoinedUsers] =
    useState<string[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await connectSocket();

    socket.emit("session:join", {
      sessionId,
    });

    socket.on(
      "session:joined",
      ({ userId }) => {
        setJoinedUsers((prev) => [
          ...prev,
          userId,
        ]);
      }
    );

    socket.on("session:started", () => {
      navigation.replace("Game", {
        sessionId,
        mode: "live_tournament",
      });
    });
  };

  const startGame = () => {
    socket.emit("session:start", {
      sessionId,
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>
        Lobby
      </Text>

      <Text>ID сессии: {sessionId}</Text>

      <Text>
        Players joined: {joinedUsers.length}
      </Text>

      <Button
        title="Start game"
        onPress={startGame}
      />
    </View>
  );
}