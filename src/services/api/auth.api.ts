import { api } from "./axios";

type LoginDto = {
  name: string;
  password: string;
};

export const authApi = {
  login: async (data: LoginDto) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },
};