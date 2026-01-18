import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContentCard } from "@/components/pixel/ContentCard";
import { PixelButton } from "@/components/pixel/PixelButton";
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
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const videosPerPage = 12;
	const offset = (page - 1) * videosPerPage;

	const videos = useQuery(api.videos.list, {
		limit: videosPerPage,
		offset,
		search: search || undefined,
	});
	const totalCount = useQuery(api.videos.count, {});
	const mostViewedVideos = useQuery(api.videos.getMostViewed, { limit: 3 });

	const totalPages = totalCount ? Math.ceil(totalCount / videosPerPage) : 1;

	const formatViews = (views: number) => {
		if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
		if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
		return views.toString();
	};

	const isRecent = (timestamp: number) => {
		const oneWeek = 7 * 24 * 60 * 60 * 1000;
		return Date.now() - timestamp < oneWeek;
	};

	const isMostViewed = (id: string) => {
		return mostViewedVideos?.some((v: any) => v._id === id) ?? false;
	};

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<h1 className="text-4xl font-pixel">VIDEOS</h1>
				<div className="relative w-full md:w-96">
					<input
						type="text"
						placeholder="SEARCH VIDEOS..."
						className="w-full h-12 pl-12 pr-4 bg-input border-2 border-foreground font-pixel text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
					<Search
						className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
						size={20}
					/>
				</div>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{videos === undefined ? (
					Array.from({ length: 6 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="aspect-video bg-muted animate-pulse border-2 border-muted"
						/>
					))
				) : videos.length === 0 ? (
					<div className="col-span-full text-center py-20">
						<p className="text-2xl font-pixel text-muted-foreground">
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

			{videos && videos.length > 0 && !search && (
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
