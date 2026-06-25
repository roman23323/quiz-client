// screens/auth/LoginScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";

import { authApi } from "../../services/api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    try {
      const data = await authApi.login({ name, password });
      await login(data.token, data.user);
    } catch (e: any) {
      Alert.alert("Ошибка входа", e.response.data.message);
    }
  };

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      })
    }
  }, [user]);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Login</Text>

      <TextInput
        placeholder="имя"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
        }}
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Text
          style={{
            marginTop: 10,
            color: "blue",
            textAlign: "center",
          }}
        >
          Нет аккаунта? Зарегистрироваться
        </Text>
      </TouchableOpacity>
    </View>
  );
}