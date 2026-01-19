import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { BookOpen, Eye, Trophy, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedText } from "@/components/pixel/AnimatedText";
import { ContentCard } from "@/components/pixel/ContentCard";
import {
	fadeInScale,
	fadeInUp,
	PageWrapper,
	staggerContainer,
} from "@/components/pixel/PageWrapper";
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

	const isMostViewed = (video: any) => {
		// Simple check if video is in the top 3 most viewed list we fetched
		return (
			mostViewedVideos?.some((v) => v._id === video._id) ||
			video.viewCount > 10000
		);
	};

	const isRecent = (timestamp: number) => {
		const threeDays = 3 * 24 * 60 * 60 * 1000;
		return Date.now() - timestamp < threeDays;
	};

	return (
		<PageWrapper
			withContainer={false}
			withPadding={false}
			className="space-y-0"
		>
			{/* HERO SECTION */}
			<section className="relative bg-[#0a0a0a] border-b-4 border-black overflow-hidden min-h-[70vh] md:min-h-[80vh] flex items-center pt-20">
				{/* Background Image - Full Color */}
				<div className="absolute inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-1-19-Wild-Update-Key-Art.jpg')] bg-cover bg-center" />

				{/* Gradient Overlay - Deeper and smoother */}
				<div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
				<div className="absolute inset-0 bg-black/30" />

				{/* Floating Particles (CSS based) */}
				<div
					className="absolute inset-0 pointer-events-none opacity-20"
					style={{
						backgroundImage:
							"radial-gradient(circle, #fff 1px, transparent 1px)",
						backgroundSize: "40px 40px",
						maskImage:
							"linear-gradient(to bottom, transparent, black, transparent)",
					}}
				/>

				<div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="space-y-6 md:space-y-8"
					>
						<div className="space-y-4">
							<motion.h1
								variants={fadeInUp}
								className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-pixel leading-tight text-white pixel-text-shadow-lg"
							>
								BEM-VINDO AO <br />
								<span className="text-primary drop-shadow-[0_0_15px_rgba(85,170,85,0.6)]">
									<AnimatedText
										text="MUNDO DO MATTEO"
										animation="glitch"
										delay={0.5}
									/>
								</span>
							</motion.h1>
						</div>

						<motion.p
							variants={fadeInUp}
							className="text-base sm:text-lg md:text-2xl text-gray-200 font-body max-w-lg shadow-black drop-shadow-md bg-black/40 p-4 md:p-6 border-l-4 border-primary backdrop-blur-sm"
						>
							O ponto de spawn definitivo da comunidade. Mergulhe em aventuras
							épicas, descubra segredos do servidor e conquiste seu lugar na
							lenda.
						</motion.p>

						<motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
							<Link to="/videos">
								<PixelButton
									size="lg"
									className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8"
								>
									COMEÇAR A JORNADA
								</PixelButton>
							</Link>
							<Link to="/quiz">
								<PixelButton
									size="lg"
									variant="secondary"
									className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8"
								>
									JOGAR QUIZ
								</PixelButton>
							</Link>
						</motion.div>
					</motion.div>

					{heroVideo && (
						<motion.div
							variants={fadeInScale}
							initial="initial"
							animate="animate"
							className="hidden lg:block relative"
						>
							<div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
							<ContentCard
								title={heroVideo.title}
								type="video"
								href={`/videos/${heroVideo._id}`}
								thumbnail={heroVideo.thumbnailHigh || heroVideo.thumbnail}
								isMostViewed
								className="transform rotate-2 hover:rotate-0 transition-transform duration-300 relative z-10"
							/>
						</motion.div>
					)}
				</div>
			</section>

			{/* LATEST VIDEOS */}
			<section className="py-12 md:py-20 bg-[#121212]">
				<div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-8 md:space-y-12">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
						<div>
							<h2 className="text-2xl md:text-4xl font-pixel text-white mb-4 flex items-center gap-3 pixel-text-shadow">
								<Youtube
									size={32}
									className="text-red-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] md:w-8 md:h-8 w-6 h-6"
								/>
								ÚLTIMOS VÍDEOS
							</h2>
							<div className="h-2 w-32 bg-primary shadow-[2px_2px_0_#1a4d23]" />
						</div>
						<Link to="/videos">
							<PixelButton
								variant="ghost"
								className="text-primary hover:text-primary/80"
							>
								VER TODOS <ChevronRight size={16} />
							</PixelButton>
						</Link>
					</div>

					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, margin: "-100px" }}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
					>
						{recentVideos
							? recentVideos.map((video: any) => (
									<motion.div key={video._id} variants={fadeInUp}>
										<ContentCard
											title={video.title}
											type="video"
											href={`/videos/${video._id}`}
											thumbnail={video.thumbnailHigh || video.thumbnail}
											isMostViewed={isMostViewed(video)}
											isRecent={isRecent(video.publishedAt)}
											metadata={[
												{
													label: "",
													icon: <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />,
													value: video.viewCount.toLocaleString(),
												},
											]}
										/>
									</motion.div>
								))
							: [1, 2, 3, 4].map((id) => (
									<div
										key={id}
										className="aspect-video bg-[#1a1a1a] animate-pulse border-2 border-[#222]"
									/>
								))}
					</motion.div>
				</div>
			</section>

			{/* BLOGS & QUIZZES GRID */}
			<section className="py-12 md:py-20 bg-[#1a1a1a] border-y-4 border-black">
				<div className="container mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 md:gap-16">
					{/* BLOGS */}
					<div className="space-y-8">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
							<div>
								<h2 className="text-2xl md:text-3xl font-pixel text-white mb-4 flex items-center gap-3 pixel-text-shadow">
									<BookOpen
										size={32}
										className="text-[#795548] drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] md:w-8 md:h-8 w-6 h-6"
									/>
									ÚLTIMAS HISTÓRIAS
								</h2>
								<div className="h-2 w-32 bg-[#795548] shadow-[2px_2px_0_#3e2723]" />
							</div>
							<Link to="/blog">
								<PixelButton variant="ghost">MAIS</PixelButton>
							</Link>
						</div>

						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="space-y-4"
						>
							{recentPosts
								? recentPosts.map((post: any) => (
										<motion.div key={post._id} variants={fadeInUp}>
											<ContentCard
												title={post.title}
												type="blog"
												href={`/blog/${post.slug}`}
												thumbnail={post.coverImage}
												subtitle={post.excerpt}
												orientation="horizontal"
											/>
										</motion.div>
									))
								: null}
						</motion.div>
					</div>

					{/* QUIZZES */}
					<div className="space-y-8">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
							<div>
								<h2 className="text-2xl md:text-3xl font-pixel text-white mb-4 flex items-center gap-3 pixel-text-shadow">
									<Trophy
										size={32}
										className="text-[#FF5555] drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] md:w-8 md:h-8 w-6 h-6"
									/>
									DESAFIOS
								</h2>
								<div className="h-2 w-32 bg-[#FF5555] shadow-[2px_2px_0_#990000]" />
							</div>
							<Link to="/quiz">
								<PixelButton variant="ghost">MAIS</PixelButton>
							</Link>
						</div>

						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid sm:grid-cols-2 gap-4"
						>
							{recentQuizzes
								? recentQuizzes.map((quiz: any) => (
										<motion.div key={quiz._id} variants={fadeInScale}>
											<ContentCard
												title={quiz.title}
												type="quiz"
												href={`/quiz/${quiz._id}`}
												thumbnail={quiz.coverImage}
												metadata={[
													{
														label: "PERGUNTAS",
														value: quiz.questions.length.toString(),
													},
													{
														label: "DIF.",
														value: quiz.difficulty?.toUpperCase() || "MÉD",
													},
												]}
											/>
										</motion.div>
									))
								: null}
						</motion.div>
					</div>
				</div>
			</section>

			{/* NEWSLETTER */}
			<section className="py-12 md:py-20 bg-[#121212]">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="max-w-4xl mx-auto bg-[#1e1e1e] p-6 md:p-12 border-2 border-white relative overflow-hidden pixel-shadow-3d"
						style={
							{
								"--shadow-right": "#000000",
								"--shadow-bottom": "#000000",
							} as React.CSSProperties
						}
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
						<div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="text-2xl md:text-3xl font-pixel text-white mb-4 pixel-text-shadow">
									ENTRE PARA O ESQUADRÃO
								</h2>
								<p className="text-base md:text-xl text-gray-400 font-body">
									Receba as últimas atualizações, skins exclusivas e acesso
									antecipado a novos conteúdos diretamente na sua caixa de
									entrada.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<input
									type="email"
									placeholder="Digite seu email"
									className="bg-[#2a2a2a] border-2 border-[#555] p-4 font-body text-base md:text-lg text-white focus:border-primary focus:outline-none placeholder:text-gray-600 w-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]"
								/>
								<PixelButton size="lg" className="w-full">
									INSCREVER-SE
								</PixelButton>
								<p className="text-xs text-gray-600 font-body text-center">
									Sem spam, apenas blocos. Cancele a inscrição a qualquer
									momento.
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</PageWrapper>
	);
}
