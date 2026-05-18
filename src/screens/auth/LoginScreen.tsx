import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { authApi } from "../../services/api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    try {
      const data = await authApi.login({ name, password });

      await login(data.token, data.user);
    } catch (e) {
      console.log("Login error:", e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="имя"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}