// screens/auth/RegisterScreen.tsx
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

export default function RegisterScreen({ navigation }: any) {

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
      const rawMessage = e.response.data.message ?? 'Неизвестная ошибка';
      const message = Array.isArray(rawMessage)
        ? rawMessage.join('\n')
        : rawMessage;

      Alert.alert('Ошибка регистрации', message);
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