import { useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ScrollView,
} from "react-native";
import { useQuizCreationStore } from "../../store/quiz-create.store";
import { quizApi } from "../../services/api/quiz.api";

type Option = {
	text: string;
	isCorrect: boolean;
};

type RemoteOption = Option & { id?: string | number };

type RemoteQuestion = {
	id: string | number;
	text: string;
	points: number;
	options: RemoteOption[];
	orderIndex?: number;
};

export default function AddQuestionsScreen({ navigation, route }: any) {
	const { addQuestion, questions, reset } = useQuizCreationStore();

	const quizId = route?.params?.quizId;
	const isEditMode = Boolean(quizId);

	const [remoteQuestions, setRemoteQuestions] = useState<RemoteQuestion[]>([]);
	const [loadingRemote, setLoadingRemote] = useState(false);
	const [editingQuestionId, setEditingQuestionId] = useState<string | number | null>(null);

	const [text, setText] = useState("");
	const [points, setPoints] = useState("1");

	const [options, setOptions] = useState<Option[]>([
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
		{ text: "", isCorrect: false },
	]);

	useEffect(() => {
		if (!isEditMode) return;

		const load = async () => {
			try {
				setLoadingRemote(true);
				const data = await quizApi.getQuizForEdit(quizId);
				setRemoteQuestions(
					data.questions.map((q: any, i: number) => ({
						id: q.id,
						text: q.text,
						points: q.points,
						options: q.options || [],
						orderIndex: q.orderIndex ?? i,
					}))
				);
			} catch (e) {
				console.log("Failed load questions:", e);
			} finally {
				setLoadingRemote(false);
			}
		};

		load();
	}, [isEditMode, quizId]);

	const handleFinish = () => {
		reset();
		navigation.popToTop();
	};

	const handleDeleteQuiz = () => {
		if (!quizId) return;

		(async () => {
			try {
				await quizApi.deleteQuiz(String(quizId));
				reset();
				navigation.popToTop();
			} catch (e: any) {
				console.log("Failed to delete quiz:", e.response.data.message);
			}
		})();
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
		if (isEditMode) {
			const stateOptions = options.map((o, i) => ({ ...o, orderIndex: i }));
			const payload = {
				text,
				questionType: "single_choice",
				points: Number(points),
				orderIndex: remoteQuestions.length,
				options: stateOptions,
			};

			try {
				await quizApi.addQuestion(quizId, payload);
				// refresh list
				const data = await quizApi.getQuizForEdit(quizId);
				setRemoteQuestions(data.questions.map((q: any) => ({ id: q.id, text: q.text, points: q.points, options: q.options || [] })));
			} catch (e) {
				console.log("Failed to add question:", e);
			}
		} else {
			await addQuestion({
				text,
				questionType: "single_choice",
				points: Number(points),
				options,
			});
		}

		setText("");
		setPoints("1");
		setOptions([
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
			{ text: "", isCorrect: false },
		]);
		setEditingQuestionId(null);
	};

	const handleDeleteRemote = async (questionId: string | number) => {
		if (!quizId) return;
		try {
			await quizApi.deleteQuestion(quizId, questionId);
			setRemoteQuestions((prev) => prev.filter((q) => q.id !== questionId));
		} catch (e) {
			console.log("Failed to delete question:", e);
		}
	};

	const handleStartEditRemote = (q: RemoteQuestion) => {
		setEditingQuestionId(q.id);
		setText(q.text);
		setPoints(String(q.points ?? 1));
		setOptions(
			q.options.map((o) => ({ text: o.text || "", isCorrect: !!o.isCorrect })) as Option[]
		);
	};

	const handleSaveEditRemote = async () => {
		if (!quizId || editingQuestionId == null) return;
		const payload = {
			text,
			questionType: "single_choice",
			points: Number(points),
			orderIndex: remoteQuestions.length,
			options: options.map((o, i) => ({ ...o, orderIndex: i })),
		};

		try {
			const existingIndex = remoteQuestions.findIndex((rq) => rq.id === editingQuestionId);
			const questionOrderIndex = existingIndex >= 0 ? existingIndex : 0;
			const payloadWithOrderIndex = { ...payload, orderIndex: questionOrderIndex };
			await quizApi.updateQuestion(quizId, editingQuestionId, payloadWithOrderIndex);
			const data = await quizApi.getQuizForEdit(quizId);
			setRemoteQuestions(data.questions.map((q: any, i: number) => ({ id: q.id, text: q.text, points: q.points, options: q.options || [], orderIndex: q.orderIndex ?? i })));
			setEditingQuestionId(null);
			setText("");
			setPoints("1");
			setOptions([
				{ text: "", isCorrect: false },
				{ text: "", isCorrect: false },
				{ text: "", isCorrect: false },
				{ text: "", isCorrect: false },
			]);
		} catch (e: any) {
			console.log("Failed to save edit:", e.response?.data?.message ?? e.message);
		}
	};

	return (
		<ScrollView
			contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
			keyboardShouldPersistTaps="handled"
		>
			<Text style={{ fontSize: 20, fontWeight: "600" }}>
				Добавление вопросов
			</Text>

			{isEditMode && (
				<TouchableOpacity
					onPress={() => navigation.navigate("CreateQuiz", { quizId })}
					style={{
						backgroundColor: "#2563eb",
						padding: 8,
						borderRadius: 8,
						marginTop: 12,
					}}
				>
					<Text style={{ color: "white", textAlign: "center" }}>
						Редактировать квиз
					</Text>
				</TouchableOpacity>
			)}

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
				onPress={editingQuestionId ? handleSaveEditRemote : handleAddQuestion}
				style={{
					backgroundColor: "#16a34a",
					padding: 12,
					borderRadius: 10,
					marginTop: 20,
				}}
			>
				<Text style={{ color: "white", textAlign: "center" }}>
					{editingQuestionId ? "Сохранить изменения" : "Добавить вопрос"}
				</Text>
			</TouchableOpacity>

			<Text style={{ marginTop: 30, fontWeight: "600" }}>
				{isEditMode ? `Вопросов: ${remoteQuestions.length}` : `Уже добавлено: ${questions.length}`}
			</Text>
			{isEditMode ? (
				<FlatList
					data={remoteQuestions}
					keyExtractor={(it) => String(it.id)}
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
							<View style={{ flexDirection: "row", marginTop: 8 }}>
								<TouchableOpacity
									onPress={() => handleStartEditRemote(item)}
									style={{ marginRight: 10, padding: 6, backgroundColor: "#2563eb", borderRadius: 6 }}
								>
									<Text style={{ color: "white" }}>Ред.</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleDeleteRemote(item.id)}
									style={{ padding: 6, backgroundColor: "#dc2626", borderRadius: 6 }}
								>
									<Text style={{ color: "white" }}>Удалить</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				/>
			) : (
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
			)}
			<View>
				<TouchableOpacity
					onPress={handleFinish}
					style={{
						backgroundColor: "#3bdc26",
						padding: 12,
						borderRadius: 10,
						marginTop: 30,
					}}
				>
					<Text style={{ color: "white", textAlign: "center" }}>
						Завершить квиз
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleDeleteQuiz}
					style={{
						backgroundColor: "#dc2626",
						padding: 12,
						borderRadius: 10,
						marginTop: 30,
					}}
				>
					<Text style={{ color: "white", textAlign: "center" }}>
						Удалить квиз
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}