import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "http://10.67.113.166:3000";

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