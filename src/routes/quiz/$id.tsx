import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { motion } from "motion/react";
import { useState } from "react";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/quiz/$id")({
	head: () => ({
		meta: [
			{ title: "Quiz | Matteo" },
			{ name: "description", content: "Take an interactive Minecraft quiz" },
		],
	}),
	component: QuizPlayer,
});

function QuizPlayer() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const session = authClient.useSession();

	const quiz = useQuery(api.quizzes.get, { quizId: id as any });
	const submitResult = useMutation(api.quizzes.submitResult);

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [submitting, setSubmitting] = useState(false);

	if (quiz === undefined) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<div className="font-pixel">LOADING QUIZ...</div>
			</PageWrapper>
		);
	}

	if (!quiz) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<PixelCard className="text-center p-12">
					<h1 className="text-4xl font-pixel mb-4">QUIZ NOT FOUND</h1>
					<p className="text-muted-foreground">
						The quiz you're looking for doesn't exist.
					</p>
				</PixelCard>
			</PageWrapper>
		);
	}

	const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
	const question = quiz.questions[currentQuestion];
	const hasAnswered = currentQuestion in answers;

	const handleSubmit = async () => {
		setSubmitting(true);
		try {
			const result = await submitResult({
				quizId: id as any,
				userId: session.data?.user.id,
				answers: quiz.questions.map((q: any) => ({
					questionId: q.id,
					selectedAnswerIndex: answers[q.id] ?? 0,
				})),
			});

			navigate({
				to: "/quiz/results/$shareToken",
				params: { shareToken: result.shareToken },
			});
		} catch (err) {
			console.error("Failed to submit quiz:", err);
			alert("Failed to submit quiz. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<PageWrapper className="max-w-3xl mx-auto space-y-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-4"
			>
				<h1 className="text-4xl font-pixel">{quiz.title}</h1>
				{quiz.description && (
					<p className="text-lg text-muted-foreground font-body">
						{quiz.description}
					</p>
				)}

				<div className="space-y-2">
					<div className="flex justify-between items-center mb-2">
						<span className="font-pixel text-sm">
							QUESTION {currentQuestion + 1} OF {quiz.questions.length}
						</span>
						{quiz.timeLimit && (
							<span className="font-pixel text-sm">
								TIME: {Math.round(quiz.timeLimit / 60)} MIN
							</span>
						)}
					</div>
					<div className="w-full bg-muted h-6 border-2 border-foreground">
						<motion.div
							className="bg-primary h-full"
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ ease: "linear" }}
						/>
					</div>
				</div>
			</motion.div>

			<motion.div
				key={currentQuestion}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				className="space-y-6"
			>
				<PixelCard className="p-8 space-y-6">
					<h2 className="text-2xl font-pixel">{question.question}</h2>

					<div className="space-y-3">
						{question.answers.map((answer: string, idx: number) => (
							<motion.button
								key={`${currentQuestion}-${idx}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() =>
									setAnswers({
										...answers,
										[question.id]: idx,
									})
								}
								className={`w-full p-4 text-left border-2 font-body transition-all text-lg ${
									answers[question.id] === idx
										? "bg-primary border-foreground text-white"
										: "bg-muted border-foreground text-foreground hover:bg-card"
								}`}
							>
								<span className="mr-3 font-pixel">
									{String.fromCharCode(65 + idx)}.
								</span>
								{answer}
							</motion.button>
						))}
					</div>

					{question.explanation && hasAnswered && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-card border-2 border-muted p-4 text-sm font-body"
						>
							<p className="font-pixel text-xs text-primary mb-2">
								EXPLANATION
							</p>
							<p>{question.explanation}</p>
						</motion.div>
					)}
				</PixelCard>
			</motion.div>

			<div className="flex justify-between gap-4">
				<PixelButton
					onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
					disabled={currentQuestion === 0}
					variant="secondary"
				>
					← BACK
				</PixelButton>

				<div className="flex gap-4">
					{currentQuestion === quiz.questions.length - 1 ? (
						<PixelButton
							onClick={handleSubmit}
							disabled={submitting}
							isLoading={submitting}
							className="min-w-[200px]"
						>
							SUBMIT QUIZ
						</PixelButton>
					) : (
						<PixelButton
							onClick={() => setCurrentQuestion((q) => q + 1)}
							disabled={!hasAnswered}
						>
							NEXT →
						</PixelButton>
					)}
				</div>
			</div>
		</PageWrapper>
	);
}
