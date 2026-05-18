import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/auth.store";
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/home/HomeScreen";
import LobbyScreen from "../screens/session/LobbyScreen";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import GameScreen from "../screens/session/GameScreen";
import ResultScreen from "../screens/session/ResultScreen";
import QuizDetailsScreen from "../screens/quiz/QuizDetailsScreen";
import CreateQuizScreen from "../screens/quiz/CreateQuizScreen";
import AddQuestionsScreen from "../screens/quiz/AddQuestionScreen";
import GenerateQuizScreen from "../screens/quiz/GenerateQuizScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
	const { user, isLoading, restore } = useAuthStore();

	useEffect(() => {
		restore();
	}, []);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Stack.Navigator>
			{user ? (
				<>
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Lobby" component={LobbyScreen} />
					<Stack.Screen name="Game" component={GameScreen} />
					<Stack.Screen name="Result" component={ResultScreen} />
					<Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
					<Stack.Screen name="AddQuestion" component={AddQuestionsScreen} />
					<Stack.Screen name="GenerateQuiz" component={GenerateQuizScreen} />
					<Stack.Screen
						name="QuizDetails"
						component={QuizDetailsScreen}
					/>
				</>
			) : (
				<Stack.Screen name="Login" component={LoginScreen} />
			)}
		</Stack.Navigator>
	);
}