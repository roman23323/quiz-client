import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem("token");

  socket.io.opts.extraHeaders = {
    access_token: token || "",
  };

  if (!socket.connected) {
    socket.connect();
  }
};