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
			<section className="relative bg-[#0a0a0a] border-b-4 border-black overflow-hidden min-h-[80vh] flex items-center">
				<div className="absolute inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-1-19-Wild-Update-Key-Art.jpg')] bg-cover bg-center opacity-40 grayscale-[30%]" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />

				<div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="space-y-6"
					>
						<h1 className="text-5xl md:text-7xl font-pixel leading-tight text-white drop-shadow-[4px_4px_0_#000]">
							EXPLORE THE <br />
							<span className="text-primary">MATTEO VERSE</span>
						</h1>
						<p className="text-xl md:text-2xl text-gray-200 font-body max-w-lg shadow-black drop-shadow-md">
							Join the adventure! Watch videos, read exclusive stories, and test
							your knowledge.
						</p>
						<div className="flex gap-4 pt-4">
							<Link to="/videos">
								<PixelButton size="lg" className="text-lg">
									WATCH VIDEOS
								</PixelButton>
							</Link>
							<Link to="/quiz">
								<PixelButton size="lg" variant="secondary" className="text-lg">
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
							className="hidden md:block"
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
			<section className="py-20 bg-[#121212]">
				<div className="container mx-auto px-4 space-y-12">
					<div className="flex justify-between items-end">
						<div>
							<h2 className="text-3xl md:text-4xl font-pixel text-white mb-2 flex items-center gap-3">
								<Youtube size={32} className="text-red-600" />
								LATEST VIDEOS
							</h2>
							<div className="h-1 w-32 bg-primary" />
						</div>
						<Link to="/videos">
							<PixelButton
								variant="ghost"
								className="text-primary hover:text-primary/80"
							>
								VIEW ALL <ChevronRight size={16} />
							</PixelButton>
						</Link>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
			<section className="py-20 bg-[#1a1a1a] border-y-4 border-black">
				<div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
					{/* BLOGS */}
					<div className="space-y-8">
						<div className="flex justify-between items-end">
							<div>
								<h2 className="text-3xl font-pixel text-white mb-2 flex items-center gap-3">
									<BookOpen size={32} className="text-[#795548]" />
									LATEST STORIES
								</h2>
								<div className="h-1 w-32 bg-[#795548]" />
							</div>
							<Link to="/blog">
								<PixelButton variant="ghost">MORE</PixelButton>
							</Link>
						</div>

						<div className="space-y-4">
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
												className="flex-row h-32"
											/>
										</motion.div>
									))
								: null}
						</div>
					</div>

					{/* QUIZZES */}
					<div className="space-y-8">
						<div className="flex justify-between items-end">
							<div>
								<h2 className="text-3xl font-pixel text-white mb-2 flex items-center gap-3">
									<Trophy size={32} className="text-[#FF5555]" />
									CHALLENGES
								</h2>
								<div className="h-1 w-32 bg-[#FF5555]" />
							</div>
							<Link to="/quiz">
								<PixelButton variant="ghost">MORE</PixelButton>
							</Link>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
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
			<section className="py-20 bg-[#121212]">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto bg-[#1e1e1e] p-8 md:p-12 border-4 border-[#333] shadow-[8px_8px_0_0_#000] relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
						<div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="text-3xl font-pixel text-white mb-4">
									JOIN THE SQUAD
								</h2>
								<p className="text-gray-400 font-body text-xl">
									Get the latest updates, exclusive skins, and early access to
									new content directly to your inbox.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<input
									type="email"
									placeholder="Enter your email"
									className="bg-[#2a2a2a] border-2 border-[#555] p-4 font-body text-lg text-white focus:border-primary focus:outline-none placeholder:text-gray-600 w-full"
								/>
								<PixelButton size="lg" className="w-full">
									SUBSCRIBE
								</PixelButton>
								<p className="text-xs text-gray-600 font-body text-center">
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
