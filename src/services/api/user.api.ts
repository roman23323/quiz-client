import { api } from "./axios";

export const userApi = {
  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateMe: async (payload: { name?: string; password?: string }) => {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },

  deleteMe: async () => {
    const { data } = await api.delete("/users/me");
    return data;
  },
};
