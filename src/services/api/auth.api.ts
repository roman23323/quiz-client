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

    register: async (dto: { name: string; password: string }) => {
        const { data } = await api.post("/auth/register", dto);

        return data;
    }
}