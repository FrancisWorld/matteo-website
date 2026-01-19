import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import {
	Calendar,
	ChevronLeft,
	Eye,
	MessageSquare,
	ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { ContentCard } from "@/components/pixel/ContentCard";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { cn } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/videos/$id")({
	head: () => ({
		meta: [{ title: "Assistir | Matteo" }],
	}),
	component: VideoDetail,
});

function VideoDetail() {
	const { id } = Route.useParams();
	const video = useQuery(api.videos.getById, { id: id as any });
	const recentVideos = useQuery(api.videos.getRecent, { limit: 5 });
	const popularVideos = useQuery(api.videos.getMostViewed, { limit: 5 });

	const isShortVideo = (v: any) => {
		if (!v) return false;
		const titleLower = v.title.toLowerCase();
		if (titleLower.includes("#shorts") || titleLower.includes("#short"))
			return true;

		if (v.duration) {
			if (v.duration.includes("H")) return false;
			const minuteMatch = v.duration.match(/(\d+)M/);
			const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
			const secondMatch = v.duration.match(/(\d+)S/);
			const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;
			return minutes * 60 + seconds <= 90;
		}
		return false;
	};

	const isLoading = video === undefined;

	if (isLoading) {
		return (
			<PageWrapper className="space-y-8 pb-16">
				<div className="py-6">
					<div className="h-10 w-32 bg-muted animate-pulse rounded" />
				</div>
				<div className="grid lg:grid-cols-3 gap-8 md:gap-12">
					<div className="lg:col-span-2 space-y-6">
						<div className="aspect-video bg-muted animate-pulse border-4 border-muted" />
						<div className="space-y-4">
							<div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
							<div className="flex gap-4">
								<div className="h-6 w-24 bg-muted animate-pulse rounded" />
								<div className="h-6 w-24 bg-muted animate-pulse rounded" />
							</div>
							<div className="space-y-2 pt-4">
								<div className="h-4 w-full bg-muted animate-pulse rounded" />
								<div className="h-4 w-full bg-muted animate-pulse rounded" />
								<div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
							</div>
						</div>
					</div>
					<div className="space-y-6">
						<div className="h-8 w-48 bg-muted animate-pulse rounded" />
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-24 bg-muted animate-pulse rounded border-2 border-muted"
							/>
						))}
					</div>
				</div>
			</PageWrapper>
		);
	}

	if (!video) {
		return (
			<PageWrapper className="flex items-center justify-center min-h-[60vh]">
				<PixelCard className="text-center p-8 md:p-12">
					<h1 className="text-2xl md:text-4xl font-pixel mb-4">
						VÍDEO NÃO ENCONTRADO
					</h1>
					<p className="text-muted-foreground mb-6 font-body text-lg">
						O vídeo que você está procurando não existe ou foi removido.
					</p>
					<Link to="/videos">
						<PixelButton>VOLTAR PARA VÍDEOS</PixelButton>
					</Link>
				</PixelCard>
			</PageWrapper>
		);
	}

	const isShort = isShortVideo(video);

	return (
		<PageWrapper className="space-y-6 md:space-y-8 pb-16">
			{/* Back Button with proper spacing */}
			<div className="pt-4 md:pt-6">
				<Link to="/videos">
					<PixelButton
						variant="outline"
						size="sm"
						className="gap-2 text-xs md:text-sm"
					>
						<ChevronLeft className="w-4 h-4" />
						Voltar para Vídeos
					</PixelButton>
				</Link>
			</div>

			<div className="grid lg:grid-cols-3 gap-8 md:gap-12">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6 md:space-y-8 min-w-0">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							"bg-black border-2 md:border-4 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] md:shadow-[8px_8px_0px_0px_var(--foreground)] overflow-hidden mx-auto",
							isShort
								? "aspect-[9/16] w-full max-w-[400px]" // Limit width for Shorts on desktop
								: "aspect-video w-full",
						)}
					>
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
							title={video.title}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="w-full h-full"
						/>
					</motion.div>

					<div className="space-y-4 md:space-y-6 px-1 md:px-0">
						<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pixel leading-tight text-primary pixel-text-shadow break-words">
							{video.title}
						</h1>

						<div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-sm font-pixel text-muted-foreground border-b-2 border-muted pb-4 md:pb-6">
							<div className="flex items-center gap-1.5 md:gap-2 bg-muted/20 px-2 md:px-3 py-1 md:py-1.5 border border-muted">
								<Eye className="w-3 h-3 md:w-4 md:h-4" />
								<span>
									{video.viewCount.toLocaleString()}{" "}
									<span className="hidden sm:inline">VISUALIZAÇÕES</span>
									<span className="sm:hidden">VIEWS</span>
								</span>
							</div>
							<div className="flex items-center gap-1.5 md:gap-2 bg-muted/20 px-2 md:px-3 py-1 md:py-1.5 border border-muted">
								<ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
								<span>{video.likeCount?.toLocaleString() || 0} LIKES</span>
							</div>
							<div className="flex items-center gap-1.5 md:gap-2 bg-muted/20 px-2 md:px-3 py-1 md:py-1.5 border border-muted">
								<MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
								<span>
									{video.commentCount?.toLocaleString() || 0}{" "}
									<span className="hidden sm:inline">COMENTÁRIOS</span>
									<span className="sm:hidden">COMS</span>
								</span>
							</div>
							<div className="flex items-center gap-1.5 md:gap-2 ml-auto bg-primary/10 px-2 md:px-3 py-1 md:py-1.5 border border-primary/20 text-primary">
								<Calendar className="w-3 h-3 md:w-4 md:h-4" />
								<span>
									{new Date(video.publishedAt).toLocaleDateString("pt-BR")}
								</span>
							</div>
						</div>

						<div className="prose prose-sm md:prose-base prose-invert max-w-none font-body leading-relaxed whitespace-pre-wrap text-gray-300 break-words">
							{video.description}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-8 md:space-y-12">
					{/* Popular Videos */}
					<div className="space-y-4 md:space-y-6">
						<h2 className="text-lg md:text-xl font-pixel border-l-4 border-[#FFD700] pl-3 md:pl-4 text-[#FFD700]">
							POPULARES
						</h2>
						<div className="space-y-3 md:space-y-4">
							{popularVideos
								?.filter((v: any) => v._id !== video._id)
								.slice(0, 3)
								.map((v: any) => (
									<ContentCard
										key={v._id}
										title={v.title}
										type="video"
										thumbnail={v.thumbnail}
										href={`/videos/${v._id}`}
										isMostViewed
										isShort={isShortVideo(v)}
										orientation="horizontal"
										className="h-24"
										metadata={[
											{
												label: "",
												icon: <Eye className="w-3 h-3" />,
												value:
													v.viewCount >= 1000
														? `${(v.viewCount / 1000).toFixed(1)}K`
														: v.viewCount,
											},
										]}
									/>
								))}
						</div>
					</div>

					{/* Recent Videos */}
					<div className="space-y-4 md:space-y-6">
						<h2 className="text-lg md:text-xl font-pixel border-l-4 border-primary pl-3 md:pl-4">
							RECENTES
						</h2>
						<div className="space-y-3 md:space-y-4">
							{recentVideos
								?.filter((v: any) => v._id !== video._id)
								.slice(0, 4)
								.map((v: any) => (
									<ContentCard
										key={v._id}
										title={v.title}
										type="video"
										thumbnail={v.thumbnail}
										href={`/videos/${v._id}`}
										isShort={isShortVideo(v)}
										orientation="horizontal"
										className="h-24"
										metadata={[
											{
												label: "",
												icon: <Eye className="w-3 h-3" />,
												value:
													v.viewCount >= 1000
														? `${(v.viewCount / 1000).toFixed(1)}K`
														: v.viewCount,
											},
											{
												label: "",
												value: new Date(v.publishedAt).toLocaleDateString(
													"pt-BR",
													{ month: "numeric", day: "numeric" },
												),
											},
										]}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
