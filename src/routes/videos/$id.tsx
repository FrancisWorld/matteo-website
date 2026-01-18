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
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/videos/$id")({
	head: ({ loaderData }: any) => {
		if (!loaderData?.video) {
			return { meta: [{ title: "Video Not Found | Matteo" }] };
		}
		return {
			meta: [
				{ title: `${loaderData.video.title} | Matteo` },
				{
					name: "description",
					content: loaderData.video.description || "Watch this video on Matteo",
				},
				{ property: "og:title", content: loaderData.video.title },
				{
					property: "og:image",
					content: loaderData.video.thumbnailHigh || loaderData.video.thumbnail,
				},
				{ property: "og:type", content: "video.other" },
			],
		};
	},
	loader: async ({ params }) => {
		return { id: params.id };
	},
	component: VideoDetail,
});

function VideoDetail() {
	const { id } = Route.useParams();
	const video = useQuery(api.videos.getById, { id: id as any });
	const recentVideos = useQuery(api.videos.getRecent, { limit: 4 });

	if (video === undefined) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="font-pixel">LOADING VIDEO...</div>
			</div>
		);
	}

	if (!video) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<PixelCard className="text-center p-12">
					<h1 className="text-4xl font-pixel mb-4">VIDEO NOT FOUND</h1>
					<p className="text-muted-foreground mb-6">
						The video you're looking for doesn't exist.
					</p>
					<Link to="/videos">
						<PixelButton>BACK TO VIDEOS</PixelButton>
					</Link>
				</PixelCard>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<Link to="/videos">
				<PixelButton variant="outline" size="sm" className="gap-2">
					<ChevronLeft className="w-4 h-4" />
					Back to Videos
				</PixelButton>
			</Link>

			<div className="grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="aspect-video bg-black border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)]"
					>
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
							title={video.title}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</motion.div>

					<div className="space-y-4">
						<h1 className="text-3xl font-pixel leading-tight">{video.title}</h1>

						<div className="flex flex-wrap gap-4 text-sm font-pixel text-muted-foreground border-b-2 border-muted pb-4">
							<div className="flex items-center gap-2">
								<Eye size={16} />
								<span>{video.viewCount.toLocaleString()} VIEWS</span>
							</div>
							<div className="flex items-center gap-2">
								<ThumbsUp size={16} />
								<span>{video.likeCount?.toLocaleString() || 0} LIKES</span>
							</div>
							<div className="flex items-center gap-2">
								<MessageSquare size={16} />
								<span>
									{video.commentCount?.toLocaleString() || 0} COMMENTS
								</span>
							</div>
							<div className="flex items-center gap-2 ml-auto">
								<Calendar size={16} />
								<span>{new Date(video.publishedAt).toLocaleDateString()}</span>
							</div>
						</div>

						<div className="prose prose-invert max-w-none font-body text-lg whitespace-pre-wrap">
							{video.description}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<h2 className="text-2xl font-pixel">RECENT VIDEOS</h2>
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
										className="p-0 overflow-hidden flex gap-4 h-24"
									>
										<div className="w-32 h-full bg-black relative flex-shrink-0">
											<img
												src={v.thumbnail}
												alt={v.title}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="py-2 pr-2 flex-1 flex flex-col justify-center">
											<h3 className="font-pixel text-sm line-clamp-2 group-hover:text-primary transition-colors">
												{v.title}
											</h3>
											<p className="text-xs text-muted-foreground font-body mt-1">
												{new Date(v.publishedAt).toLocaleDateString()}
											</p>
										</div>
									</PixelCard>
								</Link>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
