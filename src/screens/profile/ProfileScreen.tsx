import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { userApi } from "../../services/api/user.api";
import { useAuthStore } from "../../store/auth.store";

export default function ProfileScreen({ navigation }: any) {
  const { user, token, login, logout } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    }
    const load = async () => {
      try {
        const data = await userApi.getMe();
        setName(data.name || "");
      } catch (e) {
        console.log("getMe failed", e);
      }
    };

    load();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (password) payload.password = password;

      const updated = await userApi.updateMe(payload);

      if (token) {
        await login(token, updated);
      }

      Alert.alert("Сохранено");
      setPassword("");
    } catch (e) {
      console.log("update failed", e);
      Alert.alert("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Удалить аккаунт",
      "Вы уверены? Это действие необратимо.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await userApi.deleteMe();
              await logout();
            } catch (e) {
              console.log("delete failed", e);
              Alert.alert("Ошибка при удалении");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
    }
  }, [user]);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Профиль</Text>

      <Text style={{ color: "#444" }}>Имя</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Text style={{ color: "#444" }}>Новый пароль (оставьте пустым, чтобы не менять)</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{ padding: 12, backgroundColor: "#15803d", borderRadius: 8, alignItems: "center" }}
        disabled={loading}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Сохранить</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{ padding: 12, backgroundColor: "#374151", borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Выйти</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        style={{ padding: 12, backgroundColor: "#b91c1c", borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Удалить аккаунт</Text>
      </TouchableOpacity>
    </View>
  );
}
