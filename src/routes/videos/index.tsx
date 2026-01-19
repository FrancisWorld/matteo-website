import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContentCard } from "@/components/pixel/ContentCard";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { ChevronLeft } from "@/components/ui/chevron-left";
import { ChevronRight } from "@/components/ui/chevron-right";
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
	const [page, setPage] = useState(1);
	const postsPerPage = 20;

	const shorts = useQuery(api.videos.list, {
		limit: 20,
		search: search || undefined,
		type: "short",
	});

	const videos = useQuery(api.videos.list, {
		limit: postsPerPage,
		search: search || undefined,
		type: "video",
	});

	// Mock total pages since api.videos.count might not be available yet or I should assume logic
	const totalPages = 5; // Placeholder or derived from videos if pagination supported by API

	const formatViews = (views: number) => {
		if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
		if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
		return views.toString();
	};

	const isRecent = (timestamp: number) => {
		const threeDays = 3 * 24 * 60 * 60 * 1000;
		return Date.now() - timestamp < threeDays;
	};

	// Helper for most viewed logic (client side approx for now as the API returns list)
	const isMostViewed = (id: string) => false;

	return (
		<PageWrapper>
			<div className="space-y-8 md:space-y-12 3xl:space-y-16">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
					<h1 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel text-white">
						VIDEOS
					</h1>
					<div className="relative w-full sm:w-auto sm:max-w-sm md:max-w-md 3xl:max-w-lg 4xl:max-w-2xl">
						<input
							type="text"
							placeholder="SEARCH VIDEOS..."
							className="w-full h-10 md:h-12 3xl:h-14 4xl:h-16 pl-10 md:pl-12 4xl:pl-14 pr-3 md:pr-4 4xl:pr-6 bg-input border-2 md:border-3 4xl:border-4 border-foreground font-pixel text-xs md:text-sm 3xl:text-base 4xl:text-lg focus:outline-none focus:ring-2 focus:ring-primary"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
						/>
						<Search
							className="absolute left-3 md:left-4 4xl:left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4 md:size-5 4xl:size-6"
							size={20}
						/>
					</div>
				</div>

				{/* SHORTS SECTION */}
				{shorts && shorts.length > 0 && !search && (
					<section className="space-y-4 md:space-y-6">
						<h2 className="text-xl md:text-2xl 3xl:text-3xl font-pixel text-red-500 pixel-text-shadow flex items-center gap-2">
							SHORTS <span className="text-white text-sm">⚡</span>
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-8 gap-3 md:gap-4">
							{shorts.map((video: any, i: number) => (
								<motion.div
									key={video._id}
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
											{ label: "VIEWS", value: formatViews(video.viewCount) },
										]}
									/>
								</motion.div>
							))}
						</div>
					</section>
				)}

				{/* VIDEOS SECTION */}
				<section className="space-y-4 md:space-y-6">
					<h2 className="text-xl md:text-2xl 3xl:text-3xl font-pixel text-white pixel-text-shadow">
						ALL VIDEOS
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-3 md:gap-4 3xl:gap-5 4xl:gap-6">
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
									NO VIDEOS FOUND
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
										isMostViewed={isMostViewed(video._id)}
										isRecent={isRecent(video.publishedAt)}
										metadata={[
											{ label: "VIEWS", value: formatViews(video.viewCount) },
											{
												label: "AGO",
												value: new Date(video.publishedAt).toLocaleDateString(),
											},
										]}
									/>
								</motion.div>
							))
						)}
					</div>
				</section>

				{videos && videos.length > 0 && !search && (
					<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 md:mt-12 pt-6 md:pt-8 border-t-2 md:border-t-3 4xl:border-t-4 border-muted">
						<PixelButton
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							variant="secondary"
							className="w-full sm:w-auto text-xs md:text-sm 3xl:text-base 4xl:text-lg"
						>
							<ChevronLeft
								size={14}
								animated={false}
								className="md:size-4 4xl:size-6"
							/>
							PREVIOUS
						</PixelButton>
						<div className="flex items-center gap-1 md:gap-2 3xl:gap-3 4xl:gap-4 font-pixel text-xs md:text-sm 3xl:text-base 4xl:text-lg">
							<span className="text-muted-foreground">Page</span>
							<span className="bg-primary text-primary-foreground px-2 md:px-3 4xl:px-4 py-1 md:py-1.5 4xl:py-2">
								{page}
							</span>
							<span className="text-muted-foreground">of</span>
							<span className="bg-primary text-primary-foreground px-2 md:px-3 4xl:px-4 py-1 md:py-1.5 4xl:py-2">
								{totalPages}
							</span>
						</div>
						<PixelButton
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
							variant="secondary"
							className="w-full sm:w-auto text-xs md:text-sm 3xl:text-base 4xl:text-lg"
						>
							NEXT
							<ChevronRight
								size={14}
								animated={false}
								className="md:size-4 4xl:size-6"
							/>
						</PixelButton>
					</div>
				)}
			</div>
		</PageWrapper>
	);
}
