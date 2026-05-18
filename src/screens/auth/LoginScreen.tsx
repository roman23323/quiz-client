import { View, Text, Button } from "react-native";

export default function LoginScreen({ navigation }: any) {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Go Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}