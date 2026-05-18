// screens/auth/RegisterScreen.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { authApi } from "../../services/api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((s) => s.login);

  const handleRegister = async () => {
    try {
      const data = await authApi.register({
        name,
        password,
      });

      const userData = await authApi.login({
        name, 
        password
      });

      await login(userData.token, userData.user);
    } catch (e: any) {
      console.log("Register error:", e.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Register</Text>

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

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Text
          style={{
            marginTop: 10,
            color: "blue",
            textAlign: "center",
          }}
        >
          Уже есть аккаунт? Войти
        </Text>
      </TouchableOpacity>
    </View>
  );
}