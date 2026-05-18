import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ScrollView,
} from "react-native";
import { useQuizCreationStore } from "../../store/quiz-create.store";

type Option = {
	text: string;
	isCorrect: boolean;
};

export default function AddQuestionsScreen({ navigation }: any) {
	const { addQuestion, questions, reset } = useQuizCreationStore();

	const [text, setText] = useState("");
	const [points, setPoints] = useState("1");

	const [options, setOptions] = useState<Option[]>([
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
	]);

	const handleFinish = () => {
		reset();
		navigation.popToTop();
	};

	const toggleCorrect = (index: number) => {
		setOptions((prev) =>
			prev.map((o, i) => ({
				...o,
				isCorrect: i === index,
			}))
		);
	};

	const updateOptionText = (text: string, index: number) => {
		setOptions((prev) =>
			prev.map((o, i) => (i === index ? { ...o, text } : o))
		);
	};

	const handleAddQuestion = async () => {
		await addQuestion({
			text,
			questionType: "single_choice",
			points: Number(points),
			options,
		});

		setText("");
		setPoints("1");
		setOptions([
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
		]);
	};

	return (
		<ScrollView
			contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
			keyboardShouldPersistTaps="handled"
		>
			<Text style={{ fontSize: 20, fontWeight: "600" }}>
				Добавление вопросов
			</Text>

			<TextInput
				placeholder="Текст вопроса"
				value={text}
				onChangeText={setText}
				style={{ borderBottomWidth: 1, marginTop: 15 }}
			/>

			<TextInput
				placeholder="Баллы"
				value={points}
				onChangeText={setPoints}
				keyboardType="numeric"
				style={{ borderBottomWidth: 1, marginTop: 10 }}
			/>

			<Text style={{ marginTop: 20, fontWeight: "600" }}>
				Варианты ответа:
			</Text>

			{options.map((opt, index) => (
				<View key={index} style={{ marginTop: 10 }}>
					<TextInput
						placeholder={`Вариант ${index + 1}`}
						value={opt.text}
						onChangeText={(t) => updateOptionText(t, index)}
						style={{ borderBottomWidth: 1 }}
					/>

					<TouchableOpacity onPress={() => toggleCorrect(index)}>
						<Text
							style={{
								marginTop: 5,
								color: opt.isCorrect ? "green" : "gray",
							}}
						>
							{opt.isCorrect ? "✓ правильный" : "сделать правильным"}
						</Text>
					</TouchableOpacity>
				</View>
			))}

			<TouchableOpacity
				onPress={handleAddQuestion}
				style={{
					backgroundColor: "#16a34a",
					padding: 12,
					borderRadius: 10,
					marginTop: 20,
				}}
			>
				<Text style={{ color: "white", textAlign: "center" }}>
					Добавить вопрос
				</Text>
			</TouchableOpacity>

			<Text style={{ marginTop: 30, fontWeight: "600" }}>
				Уже добавлено: {questions.length}
			</Text>

			<FlatList
				data={questions}
				keyExtractor={(_, i) => String(i)}
				renderItem={({ item, index }) => (
					<View
						style={{
							marginTop: 10,
							padding: 10,
							backgroundColor: "#f3f4f6",
							borderRadius: 8,
						}}
					>
						<Text>
							{index + 1}. {item.text}
						</Text>
					</View>
				)}
			/>
			<TouchableOpacity
				onPress={handleFinish}
				style={{
					backgroundColor: "#dc2626",
					padding: 12,
					borderRadius: 10,
					marginTop: 30,
				}}
			>
				<Text style={{ color: "white", textAlign: "center" }}>
					Завершить квиз
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}