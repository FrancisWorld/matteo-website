import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/quiz/")({
	head: () => ({
		meta: [
			{ title: "Quizzes | Matteo" },
			{
				name: "description",
				content: "Test your Minecraft knowledge with interactive quizzes",
			},
		],
	}),
	component: QuizIndex,
});

function QuizIndex() {
	const [page, setPage] = useState(1);
	const quizzesPerPage = 10;
	const offset = (page - 1) * quizzesPerPage;

	const quizzes = useQuery(api.quizzes.list, { limit: quizzesPerPage, offset });
	const totalCount = useQuery(api.quizzes.count, {});

	const totalPages = totalCount ? Math.ceil(totalCount / quizzesPerPage) : 1;

	const getDifficultyColor = (difficulty?: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-green-600";
			case "medium":
				return "bg-yellow-600";
			case "hard":
				return "bg-red-600";
			default:
				return "bg-gray-600";
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-pixel">QUIZZES</h1>
				<Link to="/">
					<PixelButton variant="secondary">BACK HOME</PixelButton>
				</Link>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{quizzes === undefined ? (
					Array.from({ length: 4 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="h-64 bg-muted animate-pulse border-2 border-muted"
						/>
					))
				) : quizzes.length === 0 ? (
					<p className="col-span-2 text-center text-muted-foreground font-pixel py-12">
						NO QUIZZES AVAILABLE YET
					</p>
				) : (
					quizzes.map((quiz: any) => (
						<Link
							key={quiz._id}
							to="/quiz/$id"
							params={{ id: quiz._id }}
							className="block group"
						>
							<PixelCard hoverEffect className="h-full flex flex-col">
								{quiz.coverImage && (
									<div className="aspect-video bg-muted mb-4 overflow-hidden border-2 border-foreground relative">
										<img
											src={quiz.coverImage}
											alt={quiz.title}
											className="object-cover w-full h-full"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
									</div>
								)}
								<div className="flex-1 space-y-4">
									<div className="flex items-start justify-between gap-2">
										<h2 className="text-2xl font-pixel group-hover:text-primary transition-colors">
											{quiz.title}
										</h2>
										{quiz.difficulty && (
											<span
												className={`${getDifficultyColor(quiz.difficulty)} text-white px-2 py-1 font-pixel text-xs whitespace-nowrap`}
											>
												{quiz.difficulty.toUpperCase()}
											</span>
										)}
									</div>
									{quiz.description && (
										<p className="text-muted-foreground line-clamp-2 font-body text-lg">
											{quiz.description}
										</p>
									)}
								</div>
								<div className="mt-6 pt-4 border-t-2 border-muted flex justify-between items-center text-sm font-pixel text-muted-foreground">
									<span>{quiz.questions.length} QUESTIONS</span>
									{quiz.timeLimit && (
										<span>{Math.round(quiz.timeLimit / 60)} MIN</span>
									)}
								</div>
							</PixelCard>
						</Link>
					))
				)}
			</div>

			{quizzes && quizzes.length > 0 && (
				<div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-muted">
					<PixelButton
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
						variant="secondary"
					>
						<ChevronLeft size={16} className="mr-1" /> PREVIOUS
					</PixelButton>
					<div className="flex items-center gap-2 font-pixel">
						<span className="text-muted-foreground">Page</span>
						<span className="bg-primary text-primary-foreground px-3 py-1">
							{page}
						</span>
						<span className="text-muted-foreground">of</span>
						<span className="bg-primary text-primary-foreground px-3 py-1">
							{totalPages}
						</span>
					</div>
					<PixelButton
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						variant="secondary"
					>
						NEXT <ChevronRight size={16} className="ml-1" />
					</PixelButton>
				</div>
			)}
		</div>
	);
}
