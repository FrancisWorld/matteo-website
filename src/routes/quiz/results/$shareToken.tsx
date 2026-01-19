import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Repeat2, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../../convex/_generated/api";

export const Route = createFileRoute("/quiz/results/$shareToken")({
	head: ({ loaderData }: any) => {
		const score = loaderData?.result?.score ?? 0;
		const total = loaderData?.result?.totalQuestions ?? 0;
		const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

		return {
			meta: [
				{
					title: `Quiz Result: ${score}/${total} (${percentage}%) | Matteo`,
				},
				{
					name: "description",
					content: `I scored ${score}/${total} on a Matteo quiz! Can you beat my score?`,
				},
				{
					property: "og:title",
					content: `I scored ${percentage}% on a Matteo quiz!`,
				},
				{
					property: "og:description",
					content: `${score} out of ${total} questions correct. Can you beat my score?`,
				},
				{
					property: "og:image",
					content: "https://matteo.example.com/og-quiz-result.png",
				},
			],
		};
	},
	loader: async ({ params }) => {
		return { shareToken: params.shareToken };
	},
	component: QuizResults,
});

function QuizResults() {
	const { shareToken } = Route.useParams();
	const result = useQuery(api.quizzes.getResultByToken, { shareToken });

	if (result === undefined) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<div className="font-pixel">LOADING RESULTS...</div>
			</PageWrapper>
		);
	}

	if (!result) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<PixelCard className="text-center p-12">
					<h1 className="text-4xl font-pixel mb-4">RESULTS NOT FOUND</h1>
					<p className="text-muted-foreground mb-6">
						The quiz results you're looking for don't exist.
					</p>
					<Link to="/quiz">
						<PixelButton>BACK TO QUIZZES</PixelButton>
					</Link>
				</PixelCard>
			</PageWrapper>
		);
	}

	const percentage = Math.round((result.score / result.totalQuestions) * 100);
	const correctAnswers = result.answers.filter((a: any) => a.isCorrect).length;
	const incorrectAnswers = result.answers.length - correctAnswers;

	const getMessage = () => {
		if (percentage === 100) return "PERFECT SCORE! 🎉";
		if (percentage >= 80) return "EXCELLENT! 🌟";
		if (percentage >= 60) return "GOOD JOB! 👍";
		if (percentage >= 40) return "NOT BAD! 💪";
		return "KEEP PRACTICING! 📚";
	};

	return (
		<PageWrapper className="max-w-4xl mx-auto space-y-8">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ ease: "linear", duration: 0.5 }}
				className="text-center space-y-6"
			>
				<h1 className="text-5xl font-pixel">YOUR RESULTS</h1>

				<PixelCard className="p-12 bg-gradient-to-b from-card to-muted border-4 border-primary">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="space-y-6"
					>
						<div className="text-6xl font-pixel text-primary">
							{result.score}/{result.totalQuestions}
						</div>
						<div className="text-5xl font-pixel">{percentage}%</div>
						<div className="text-2xl font-pixel text-primary">
							{getMessage()}
						</div>
					</motion.div>
				</PixelCard>

				<div className="grid grid-cols-2 gap-4">
					<PixelCard className="p-6 bg-green-900/30 border-2 border-green-600">
						<div className="text-3xl font-pixel text-green-400 mb-2">
							{correctAnswers}
						</div>
						<div className="font-body text-sm text-green-300">CORRECT</div>
					</PixelCard>
					<PixelCard className="p-6 bg-red-900/30 border-2 border-red-600">
						<div className="text-3xl font-pixel text-red-400 mb-2">
							{incorrectAnswers}
						</div>
						<div className="font-body text-sm text-red-300">INCORRECT</div>
					</PixelCard>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="space-y-6"
			>
				<div className="space-y-4">
					<h2 className="text-2xl font-pixel">ANSWER BREAKDOWN</h2>
					{result.answers.map((ans: any, i: number) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 + i * 0.05 }}
						>
							<PixelCard
								className={`p-4 border-4 ${
									ans.isCorrect
										? "border-green-600 bg-green-900/20"
										: "border-red-600 bg-red-900/20"
								}`}
							>
								<div className="flex items-center justify-between">
									<span className="font-pixel">Question {i + 1}</span>
									<span className="text-2xl">
										{ans.isCorrect ? "✅" : "❌"}
									</span>
								</div>
							</PixelCard>
						</motion.div>
					))}
				</div>
			</motion.div>

			<div className="flex gap-4 justify-center pt-8">
				<PixelButton
					onClick={() => {
						const url = `${window.location.origin}/quiz/results/${shareToken}`;
						navigator.clipboard.writeText(url);
						alert("Link copied to clipboard!");
					}}
					className="flex items-center gap-2"
				>
					<Share2 size={16} /> SHARE
				</PixelButton>
				<Link to="/quiz">
					<PixelButton variant="secondary">
						<Repeat2 size={16} className="mr-2" /> TAKE ANOTHER
					</PixelButton>
				</Link>
			</div>
		</PageWrapper>
	);
}
