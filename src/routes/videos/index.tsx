import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { motion } from "motion/react";
import { useState } from "react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import { ContentCard } from "@/components/pixel/ContentCard";
import { fadeInUp, PageWrapper } from "@/components/pixel/PageWrapper";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { SearchIcon } from "@/components/ui/search";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/videos/")({
	head: () => ({
		meta: [
			{ title: "Videos | Matteo" },
			{
				name: "description",
				content: "Watch the latest Minecraft adventures from Matteo",
			},
		],
	}),
	component: VideosIndex,
});

function VideosIndex() {
	const [search, setSearch] = useState("");

	const shorts = useQuery(api.videos.list, {
		limit: 20,
		search: search || undefined,
		type: "short",
	});

	const videos = useQuery(api.videos.list, {
		limit: 20,
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

	return (
		<PageWrapper>
			<div className="space-y-12">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
					<PageTitle subtitle="Assista às últimas aventuras do Matteo">
						VÍDEOS
					</PageTitle>

					<motion.div
						className="relative w-full md:w-96"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<input
							type="text"
							placeholder="PESQUISAR VÍDEOS..."
							className="w-full h-12 pl-12 pr-4 bg-[#1a1a1a] border-2 border-[#333] font-pixel text-xs focus:outline-none focus:border-primary transition-colors"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
							<SearchIcon size={18} />
						</div>
					</motion.div>
				</div>

				<section className="space-y-6">
					<motion.h2
						variants={fadeInUp}
						initial="initial"
						animate="animate"
						className="text-2xl font-pixel text-white pixel-text-shadow border-l-4 border-primary pl-4"
					>
						VÍDEOS COMPLETOS
					</motion.h2>

					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4 py-8">
							{videos === undefined
								? Array.from({ length: 4 }).map((_, i) => (
										<CarouselItem
											key={`sk-v-${i}`}
											className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
										>
											<div className="aspect-video bg-[#1a1a1a] animate-pulse border-2 border-[#222]" />
										</CarouselItem>
									))
								: videos.map((video: any) => (
										<CarouselItem
											key={video._id}
											className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
										>
											<ContentCard
												title={video.title}
												type="video"
												thumbnail={video.thumbnailHigh || video.thumbnail}
												href={`/videos/${video._id}`}
												isRecent={isRecent(video.publishedAt)}
												metadata={[
													{
														label: "VIEWS",
														value: formatViews(video.viewCount),
													},
													{
														label: "",
														value: new Date(
															video.publishedAt,
														).toLocaleDateString("pt-BR"),
													},
												]}
											/>
										</CarouselItem>
									))}
						</CarouselContent>
						<div className="hidden md:block">
							<CarouselPrevious className="left-4 bg-black/80 hover:bg-primary text-white hover:text-black border-2 border-white rounded-none h-12 w-12 transition-all pixel-shadow-3d" />
							<CarouselNext className="right-4 bg-black/80 hover:bg-primary text-white hover:text-black border-2 border-white rounded-none h-12 w-12 transition-all pixel-shadow-3d" />
						</div>
					</Carousel>
				</section>

				<section className="space-y-6">
					<motion.h2
						variants={fadeInUp}
						initial="initial"
						animate="animate"
						transition={{ delay: 0.2 }}
						className="text-2xl font-pixel text-red-500 pixel-text-shadow flex items-center gap-2"
					>
						SHORTS <span className="text-white text-sm">⚡</span>
					</motion.h2>

					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-4 py-8">
							{shorts === undefined
								? Array.from({ length: 6 }).map((_, i) => (
										<CarouselItem
											key={`sk-s-${i}`}
											className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
										>
											<div className="aspect-[9/16] bg-[#1a1a1a] animate-pulse border-2 border-[#222]" />
										</CarouselItem>
									))
								: shorts.map((video: any) => (
										<CarouselItem
											key={video._id}
											className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
										>
											<ContentCard
												title={video.title}
												type="video"
												thumbnail={video.thumbnailHigh || video.thumbnail}
												href={`/videos/${video._id}`}
												isRecent={isRecent(video.publishedAt)}
												isShort
												metadata={[
													{
														label: "VIEWS",
														value: formatViews(video.viewCount),
													},
												]}
											/>
										</CarouselItem>
									))}
						</CarouselContent>
						<div className="hidden md:block">
							<CarouselPrevious className="left-4 bg-black/80 hover:bg-red-500 text-white hover:text-black border-2 border-white rounded-none h-10 w-10 transition-all pixel-shadow-3d" />
							<CarouselNext className="right-4 bg-black/80 hover:bg-red-500 text-white hover:text-black border-2 border-white rounded-none h-10 w-10 transition-all pixel-shadow-3d" />
						</div>
					</Carousel>
				</section>
			</div>
		</PageWrapper>
	);
}
