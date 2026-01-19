import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import {
	fadeInUp,
	PageWrapper,
	staggerContainer,
} from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/quiz/")({
	beforeLoad: async ({ location }) => {
		const session = await authClient.getSession();
		if (!session.data?.user) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
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

	const getDifficultyLabel = (difficulty?: string) => {
		switch (difficulty) {
			case "easy":
				return "FÁCIL";
			case "medium":
				return "MÉDIO";
			case "hard":
				return "DIFÍCIL";
			default:
				return "MÉDIO";
		}
	};

	return (
		<PageWrapper>
			<div className="space-y-8">
				<div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
					<PageTitle subtitle="Teste seus conhecimentos sobre Minecraft">
						QUIZZES
					</PageTitle>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Link to="/">
							<PixelButton variant="secondary">VOLTAR</PixelButton>
						</Link>
					</motion.div>
				</div>

				<motion.div
					key={quizzes ? "loaded" : "loading"}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{quizzes === undefined ? (
						["sk-q-1", "sk-q-2", "sk-q-3", "sk-q-4", "sk-q-5", "sk-q-6"].map(
							(id) => (
								<motion.div
									key={id}
									variants={fadeInUp}
									className="h-64 bg-[#1a1a1a] animate-pulse border-2 border-[#222]"
								/>
							),
						)
					) : quizzes.length === 0 ? (
						<motion.div
							className="col-span-full text-center py-20"
							variants={fadeInUp}
						>
							<Trophy
								size={64}
								className="mx-auto text-muted-foreground/30 mb-4"
							/>
							<p className="text-xl font-pixel text-muted-foreground">
								NENHUM QUIZ DISPONÍVEL AINDA
							</p>
						</motion.div>
					) : (
						quizzes.map((quiz: any) => (
							<motion.div key={quiz._id} variants={fadeInUp}>
								<Link
									to="/quiz/$id"
									params={{ id: quiz._id }}
									className="block group h-full"
								>
									<PixelCard hoverEffect className="h-full flex flex-col">
										{quiz.coverImage && (
											<div className="aspect-video bg-muted mb-4 overflow-hidden border-2 border-[#333] relative">
												<img
													src={quiz.coverImage}
													alt={quiz.title}
													className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
												{quiz.difficulty && (
													<span
														className={`absolute top-2 right-2 ${getDifficultyColor(quiz.difficulty)} text-white px-2 py-1 font-pixel text-[10px]`}
													>
														{getDifficultyLabel(quiz.difficulty)}
													</span>
												)}
											</div>
										)}
										<div className="flex-1 space-y-4">
											<h2 className="text-lg font-pixel group-hover:text-primary transition-colors pixel-text-shadow">
												{quiz.title}
											</h2>
											{quiz.description && (
												<p className="text-muted-foreground line-clamp-2 font-body">
													{quiz.description}
												</p>
											)}
										</div>
										<div className="mt-6 pt-4 border-t-2 border-[#333] flex justify-between items-center text-xs font-pixel text-muted-foreground">
											<span>{quiz.questions.length} QUESTÕES</span>
											{quiz.timeLimit && (
												<span className="text-primary">
													{Math.round(quiz.timeLimit / 60)} MIN
												</span>
											)}
										</div>
									</PixelCard>
								</Link>
							</motion.div>
						))
					)}
				</motion.div>

				{quizzes && quizzes.length > 0 && (
					<motion.div
						className="flex justify-between items-center mt-12 pt-8 border-t-2 border-[#222]"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<PixelButton
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							variant="secondary"
						>
							<ChevronLeft size={16} className="mr-1" /> ANTERIOR
						</PixelButton>
						<div className="flex items-center gap-2 font-pixel text-xs">
							<span className="text-muted-foreground">Página</span>
							<span className="bg-primary text-primary-foreground px-3 py-1">
								{page}
							</span>
							<span className="text-muted-foreground">de</span>
							<span className="bg-[#333] text-white px-3 py-1">
								{totalPages}
							</span>
						</div>
						<PixelButton
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
							variant="secondary"
						>
							PRÓXIMO <ChevronRight size={16} className="ml-1" />
						</PixelButton>
					</motion.div>
				)}
			</div>
		</PageWrapper>
	);
}
