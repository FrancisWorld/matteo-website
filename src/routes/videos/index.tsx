import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContentCard } from "@/components/pixel/ContentCard";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/videos/")({
	head: () => ({
		meta: [
			{ title: "Vídeos | Matteo" },
			{
				name: "description",
				content: "Assista às últimas aventuras de Minecraft do Matteo",
			},
		],
	}),
	component: VideosIndex,
});

function VideosIndex() {
	const [search, setSearch] = useState("");
	const [limit, setLimit] = useState(20);

	const shorts = useQuery(api.videos.list, {
		limit: 20,
		search: search || undefined,
		type: "short",
	});

	const videos = useQuery(api.videos.list, {
		limit: limit,
		search: search || undefined,
		type: "video",
	});

	const formatViews = (views: number) => {
		if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
		if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
		return views.toString();
	};

	const isRecent = (timestamp: number) => {
		const threeDays = 3 * 24 * 60 * 60 * 1000;
		return Date.now() - timestamp < threeDays;
	};

	const isMostViewed = (video: any) => {
		return video.viewCount > 10000;
	};

	const handleLoadMore = () => {
		setLimit((prev) => prev + 20);
	};

	return (
		<PageWrapper>
			<div className="space-y-8 md:space-y-12 3xl:space-y-16">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
					<h1 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel text-white">
						VÍDEOS
					</h1>
					<div className="relative w-full sm:w-auto sm:max-w-sm md:max-w-md 3xl:max-w-lg 4xl:max-w-2xl">
						<input
							type="text"
							placeholder="PESQUISAR VÍDEOS..."
							className="w-full h-10 md:h-12 3xl:h-14 4xl:h-16 pl-10 md:pl-12 4xl:pl-14 pr-3 md:pr-4 4xl:pr-6 bg-input border-2 md:border-3 4xl:border-4 border-foreground font-pixel text-xs md:text-sm 3xl:text-base 4xl:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setLimit(20); // Reset limit on search
							}}
						/>
						<Search
							className="absolute left-3 md:left-4 4xl:left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4 md:size-5 4xl:size-6"
							size={20}
						/>
					</div>
				</div>

				{/* VIDEOS SECTION */}
				<section className="space-y-4 md:space-y-6">
					<h2 className="text-xl md:text-2xl 3xl:text-3xl font-pixel text-white pixel-text-shadow">
						TODOS OS VÍDEOS
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-4 md:gap-6">
						{videos === undefined ? (
							Array.from({ length: 6 }).map((_, i) => (
								<div
									key={`skeleton-${i}`}
									className="aspect-video bg-muted animate-pulse border-2 md:border-3 4xl:border-4 border-muted"
								/>
							))
						) : videos.length === 0 ? (
							<div className="col-span-full text-center py-12 md:py-16 3xl:py-20 4xl:py-32">
								<p className="text-xl md:text-2xl 3xl:text-3xl 4xl:text-4xl font-pixel text-muted-foreground">
									NENHUM VÍDEO ENCONTRADO
								</p>
							</div>
						) : (
							videos.map((video: any, i: number) => (
								<motion.div
									key={video._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
									className="h-full"
								>
									<ContentCard
										title={video.title}
										type="video"
										thumbnail={video.thumbnailHigh || video.thumbnail}
										href={`/videos/${video._id}`}
										isMostViewed={isMostViewed(video)}
										isRecent={isRecent(video.publishedAt)}
										metadata={[
											{
												label: "VISUALIZAÇÕES",
												value: formatViews(video.viewCount),
											},
											{
												label: "EM",
												value: new Date(video.publishedAt).toLocaleDateString(),
											},
										]}
									/>
								</motion.div>
							))
						)}
					</div>
					{/* Load More Button */}
					{videos && videos.length >= limit && (
						<div className="flex justify-center mt-8 md:mt-12">
							<PixelButton
								onClick={handleLoadMore}
								variant="secondary"
								className="px-8 py-3 text-sm md:text-base"
							>
								CARREGAR MAIS
							</PixelButton>
						</div>
					)}
				</section>

				{/* SHORTS CAROUSEL SECTION */}
				{shorts && shorts.length > 0 && !search && (
					<section className="space-y-4 md:space-y-6 pt-8 md:pt-12 border-t-4 border-muted/30">
						<h2 className="text-xl md:text-2xl 3xl:text-3xl font-pixel text-red-500 pixel-text-shadow flex items-center gap-2">
							SHORTS <span className="text-white text-sm">⚡</span>
						</h2>

						<div className="relative">
							<div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
							<div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
							<div className="px-8 md:px-12">
								<Carousel
									opts={{
										align: "start",
										loop: false,
									}}
									className="w-full"
								>
									<CarouselContent className="-ml-2 md:-ml-4">
										{shorts.map((video: any, i: number) => (
											<CarouselItem
												key={video._id}
												className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
											>
												<motion.div
													initial={{ opacity: 0, scale: 0.9 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ delay: i * 0.05 }}
												>
													<ContentCard
														title={video.title}
														type="video"
														thumbnail={video.thumbnailHigh || video.thumbnail}
														href={`/videos/${video._id}`}
														isShort
														isRecent={isRecent(video.publishedAt)}
														metadata={[
															{
																label: "VISUALIZAÇÕES",
																value: formatViews(video.viewCount),
															},
														]}
													/>
												</motion.div>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious className="left-0 md:-left-12 h-10 w-10 border-2 border-foreground bg-background hover:bg-muted text-foreground rounded-none pixel-shadow-3d" />
									<CarouselNext className="right-0 md:-right-12 h-10 w-10 border-2 border-foreground bg-background hover:bg-muted text-foreground rounded-none pixel-shadow-3d" />
								</Carousel>
							</div>
						</div>
					</section>
				)}
			</div>
		</PageWrapper>
	);
}
