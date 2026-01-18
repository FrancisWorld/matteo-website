import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { BookOpen, ChevronRight, Trophy, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { ContentCard } from "@/components/pixel/ContentCard";
import { PixelButton } from "@/components/pixel/PixelButton";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const recentVideos = useQuery(api.videos.getRecent, { limit: 4 });
	const mostViewedVideos = useQuery(api.videos.getMostViewed, { limit: 3 });
	const recentPosts = useQuery(api.posts.getRecent, { limit: 3 });
	const recentQuizzes = useQuery(api.quizzes.list, { limit: 3 });

	const heroVideo = mostViewedVideos?.[0];

	return (
		<div className="space-y-0">
			{/* HERO SECTION */}
			<section className="relative bg-[#0a0a0a] border-b-4 md:border-b-6 4xl:border-b-8 border-black overflow-hidden min-h-[60vh] md:min-h-[70vh] 3xl:min-h-[80vh] 4xl:min-h-screen flex items-center">
				<div className="absolute inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-1-19-Wild-Update-Key-Art.jpg')] bg-cover bg-center opacity-40 grayscale-[30%]" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />

				<div className="container mx-auto px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 3xl:gap-12 4xl:gap-16 items-center py-12 md:py-16 3xl:py-20 4xl:py-32">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="space-y-4 md:space-y-6 3xl:space-y-8"
					>
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 3xl:text-7xl 4xl:text-8xl font-pixel leading-tight text-white drop-shadow-[4px_4px_0_#000]">
							EXPLORE THE <br />
							<span className="text-primary">MATTEO VERSE</span>
						</h1>
						<p className="text-base sm:text-lg md:text-xl lg:text-2xl 3xl:text-2xl 4xl:text-4xl text-gray-200 font-body max-w-lg shadow-black drop-shadow-md">
							Join the adventure! Watch videos, read exclusive stories, and test
							your knowledge.
						</p>
						<div className="flex flex-col sm:flex-row gap-2 md:gap-4 pt-2 md:pt-4">
							<Link to="/videos">
								<PixelButton size="lg" className="text-sm md:text-base w-full sm:w-auto">
									WATCH VIDEOS
								</PixelButton>
							</Link>
							<Link to="/quiz">
								<PixelButton size="lg" variant="secondary" className="text-sm md:text-base w-full sm:w-auto">
									PLAY QUIZ
								</PixelButton>
							</Link>
						</div>
					</motion.div>

					{heroVideo && (
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
							className="hidden lg:block"
						>
							<ContentCard
								title={heroVideo.title}
								type="video"
								href={`/videos/${heroVideo._id}`}
								thumbnail={heroVideo.thumbnailHigh || heroVideo.thumbnail}
								isMostViewed
								className="transform rotate-2 hover:rotate-0 transition-transform duration-300"
							/>
						</motion.div>
					)}
				</div>
			</section>

			{/* LATEST VIDEOS */}
			<section className="py-12 md:py-16 3xl:py-20 4xl:py-32 bg-[#121212]">
				<div className="container mx-auto px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16 space-y-8 md:space-y-12 3xl:space-y-16">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
						<div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel text-white mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
								<Youtube size={28} className="md:size-8 4xl:size-12 text-red-600" />
								LATEST VIDEOS
							</h2>
							<div className="h-1 md:h-1.5 4xl:h-2 w-32 md:w-40 bg-primary" />
						</div>
						<Link to="/videos">
							<PixelButton
								variant="ghost"
								className="text-primary hover:text-primary/80 text-xs md:text-sm 3xl:text-base 4xl:text-lg"
							>
								VIEW ALL <ChevronRight size={16} className="md:size-5 4xl:size-7" />
							</PixelButton>
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-4 md:gap-6 3xl:gap-8 4xl:gap-10">
						{recentVideos
							? recentVideos.map((video: any, i: number) => (
									<motion.div
										key={video._id}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: i * 0.1 }}
									>
										<ContentCard
											title={video.title}
											type="video"
											href={`/videos/${video._id}`}
											thumbnail={video.thumbnailHigh || video.thumbnail}
											isRecent={i === 0}
											metadata={[
												{
													label: "VIEWS",
													value: video.viewCount.toLocaleString(),
												},
											]}
										/>
									</motion.div>
								))
							: Array.from({ length: 4 }).map((_, i) => (
									<div
										key={`skeleton-${i}`}
										className="aspect-video bg-muted animate-pulse border-2 border-muted"
									/>
								))}
					</div>
				</div>
			</section>

			{/* BLOGS & QUIZZES GRID */}
			<section className="py-12 md:py-16 3xl:py-20 4xl:py-32 bg-[#1a1a1a] border-y-4 md:border-y-6 4xl:border-y-8 border-black">
				<div className="container mx-auto px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 3xl:gap-20 4xl:gap-24">
					{/* BLOGS */}
					<div className="space-y-6 md:space-y-8 3xl:space-y-10">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
							<div>
								<h2 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel text-white mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
									<BookOpen size={28} className="md:size-8 4xl:size-12 text-[#795548]" />
									LATEST STORIES
								</h2>
								<div className="h-1 md:h-1.5 4xl:h-2 w-32 md:w-40 bg-[#795548]" />
							</div>
							<Link to="/blog">
								<PixelButton variant="ghost" className="text-xs md:text-sm 3xl:text-base 4xl:text-lg">MORE</PixelButton>
							</Link>
						</div>

						<div className="space-y-3 md:space-y-4 3xl:space-y-5">
							{recentPosts
								? recentPosts.map((post: any, i: number) => (
										<motion.div
											key={post._id}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.1 }}
										>
											<ContentCard
												title={post.title}
												type="blog"
												href={`/blog/${post.slug}`}
												thumbnail={post.coverImage}
												subtitle={post.excerpt}
												className="flex-row h-24 md:h-28 3xl:h-32 4xl:h-40"
											/>
										</motion.div>
									))
								: null}
						</div>
					</div>

					{/* QUIZZES */}
					<div className="space-y-6 md:space-y-8 3xl:space-y-10">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
							<div>
								<h2 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel text-white mb-2 md:mb-3 flex items-center gap-2 md:gap-3">
									<Trophy size={28} className="md:size-8 4xl:size-12 text-[#FF5555]" />
									CHALLENGES
								</h2>
								<div className="h-1 md:h-1.5 4xl:h-2 w-32 md:w-40 bg-[#FF5555]" />
							</div>
							<Link to="/quiz">
								<PixelButton variant="ghost" className="text-xs md:text-sm 3xl:text-base 4xl:text-lg">MORE</PixelButton>
							</Link>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 3xl:gap-5 4xl:gap-6">
							{recentQuizzes
								? recentQuizzes.map((quiz: any, i: number) => (
										<motion.div
											key={quiz._id}
											initial={{ opacity: 0, scale: 0.9 }}
											whileInView={{ opacity: 1, scale: 1 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.1 }}
										>
											<ContentCard
												title={quiz.title}
												type="quiz"
												href={`/quiz/${quiz._id}`}
												thumbnail={quiz.coverImage}
												metadata={[
													{
														label: "Q",
														value: quiz.questions.length.toString(),
													},
													{
														label: "DIFF",
														value: quiz.difficulty?.toUpperCase() || "MED",
													},
												]}
											/>
										</motion.div>
									))
								: null}
						</div>
					</div>
				</div>
			</section>

			{/* NEWSLETTER */}
			<section className="py-12 md:py-16 3xl:py-20 4xl:py-32 bg-[#121212]">
				<div className="container mx-auto px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16">
					<div className="max-w-4xl mx-auto bg-[#1e1e1e] p-6 md:p-8 3xl:p-10 4xl:p-16 border-4 md:border-6 4xl:border-8 border-[#333] shadow-[8px_8px_0_0_#000] md:shadow-[10px_10px_0_0_#000] 4xl:shadow-[16px_16px_0_0_#000] relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-primary/10 rounded-full blur-3xl" />
						<div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 3xl:gap-10 4xl:gap-12 items-center">
							<div>
								<h2 className="text-2xl md:text-3xl 3xl:text-4xl 4xl:text-5xl font-pixel text-white mb-3 md:mb-4 3xl:mb-6">
									JOIN THE SQUAD
								</h2>
								<p className="text-gray-400 font-body text-base md:text-lg 3xl:text-xl 4xl:text-2xl">
									Get the latest updates, exclusive skins, and early access to
									new content directly to your inbox.
								</p>
							</div>
							<div className="flex flex-col gap-3 md:gap-4 3xl:gap-5 4xl:gap-6">
								<input
									type="email"
									placeholder="Enter your email"
									className="bg-[#2a2a2a] border-2 md:border-3 4xl:border-4 border-[#555] p-3 md:p-4 3xl:p-5 4xl:p-6 font-body text-sm md:text-base 3xl:text-lg 4xl:text-2xl text-white focus:border-primary focus:outline-none placeholder:text-gray-600 w-full"
								/>
								<PixelButton size="lg" className="w-full text-xs md:text-sm 3xl:text-base 4xl:text-lg">
									SUBSCRIBE
								</PixelButton>
								<p className="text-[10px] md:text-xs 3xl:text-sm 4xl:text-base text-gray-600 font-body text-center">
									No spam, just blocks. Unsubscribe anytime.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
