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
	const recentVideos = useQuery(api.videos.getRecent, { limit: 4 });

	const isShortVideo = (v: typeof video) => {
		if (!v) return false;
		const titleLower = v.title.toLowerCase();
		if (titleLower.includes("#shorts") || titleLower.includes("#short"))
			return true;

		if (v.duration) {
			if (v.duration.includes("H")) return false;
			// Matches PT1M30S etc
			const minuteMatch = v.duration.match(/(\d+)M/);
			const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
			const secondMatch = v.duration.match(/(\d+)S/);
			const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;
			return minutes * 60 + seconds <= 90;
		}
		return false;
	};

	const isShort = isShortVideo(video);

	if (video === undefined) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<div className="font-pixel text-xl animate-pulse">
					CARREGANDO VÍDEO...
				</div>
			</PageWrapper>
		);
	}

	if (!video) {
		return (
			<PageWrapper className="flex items-center justify-center">
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

	return (
		<PageWrapper className="space-y-8 pb-16">
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

			<div className="grid lg:grid-cols-3 gap-8 md:gap-12">
				<div className="lg:col-span-2 space-y-6 md:space-y-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							"bg-black border-4 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] md:shadow-[8px_8px_0px_0px_var(--foreground)] overflow-hidden",
							isShort
								? "aspect-[9/16] max-w-sm mx-auto w-full"
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

					<div className="space-y-4 md:space-y-6">
						<h1 className="text-2xl md:text-4xl font-pixel leading-tight text-primary pixel-text-shadow">
							{video.title}
						</h1>

						<div className="flex flex-wrap gap-4 text-xs md:text-sm font-pixel text-muted-foreground border-b-2 border-muted pb-4 md:pb-6">
							<div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-none border border-muted">
								<Eye size={16} />
								<span>{video.viewCount.toLocaleString()} VISUALIZAÇÕES</span>
							</div>
							<div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-none border border-muted">
								<ThumbsUp size={16} />
								<span>{video.likeCount?.toLocaleString() || 0} LIKES</span>
							</div>
							<div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-none border border-muted">
								<MessageSquare size={16} />
								<span>
									{video.commentCount?.toLocaleString() || 0} COMENTÁRIOS
								</span>
							</div>
							<div className="flex items-center gap-2 ml-auto bg-primary/10 px-3 py-1.5 rounded-none border border-primary/20 text-primary">
								<Calendar size={16} />
								<span>{new Date(video.publishedAt).toLocaleDateString()}</span>
							</div>
						</div>

						<div className="prose prose-sm md:prose-lg prose-invert max-w-none font-body leading-relaxed whitespace-pre-wrap text-gray-300">
							{video.description}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<h2 className="text-xl md:text-2xl font-pixel border-l-4 border-primary pl-4">
						VÍDEOS RECENTES
					</h2>
					<div className="space-y-4">
						{recentVideos
							?.filter((v: any) => v._id !== video._id)
							.map((v: any) => (
								<Link
									key={v._id}
									to="/videos/$id"
									params={{ id: v._id }}
									className="block group"
								>
									<PixelCard
										hoverEffect
										className="p-0 overflow-hidden flex gap-3 h-24 md:h-28"
									>
										<div className="w-32 md:w-40 h-full bg-black relative flex-shrink-0 border-r-2 border-foreground">
											<img
												src={v.thumbnail}
												alt={v.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
											<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
										</div>
										<div className="py-2 pr-2 flex-1 flex flex-col justify-center gap-1">
											<h3 className="font-pixel text-xs md:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
												{v.title}
											</h3>
											<p className="text-[10px] md:text-xs text-muted-foreground font-body flex items-center gap-1">
												<Calendar size={10} />
												{new Date(v.publishedAt).toLocaleDateString()}
											</p>
										</div>
									</PixelCard>
								</Link>
							))}
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
