import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.122.1:3000", // потом заменишь на IP сервера
  withCredentials: true,
});