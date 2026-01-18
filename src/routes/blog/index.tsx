import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/blog/")({
	head: () => ({
		meta: [
			{ title: "Blog | Matteo" },
			{
				name: "description",
				content: "Read the latest posts from the Matteo community",
			},
		],
	}),
	component: BlogIndex,
});

function BlogIndex() {
	const [page, setPage] = useState(1);
	const postsPerPage = 10;
	const offset = (page - 1) * postsPerPage;

	const posts = useQuery(api.posts.list, { limit: postsPerPage, offset });
	const totalCount = useQuery(api.posts.count, {});

	const totalPages = totalCount ? Math.ceil(totalCount / postsPerPage) : 1;

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl font-pixel">BLOG POSTS</h1>
				<Link to="/blog/new">
					<PixelButton>NEW POST</PixelButton>
				</Link>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{posts === undefined ? (
					// Loading Skeletons
					Array.from({ length: 4 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="h-64 bg-muted animate-pulse"
						/>
					))
				) : posts.length === 0 ? (
					<p className="col-span-2 text-center text-muted-foreground font-pixel py-12">
						NO POSTS FOUND. START WRITING!
					</p>
				) : (
					posts.map((post) => (
						<Link
							key={post._id}
							to="/blog/$slug"
							params={{ slug: post.slug }}
							className="block group"
						>
							<PixelCard hoverEffect className="h-full flex flex-col">
								{post.coverImage && (
									<div className="aspect-video bg-muted mb-4 overflow-hidden border-2 border-foreground relative">
										<img
											src={post.coverImage}
											alt={post.title}
											className="object-cover w-full h-full"
										/>
										{/* Scanline effect overlay */}
										<div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none" />
									</div>
								)}
								<div className="flex-1 space-y-4">
									<h2 className="text-2xl font-pixel group-hover:text-primary transition-colors">
										{post.title}
									</h2>
									<p className="text-muted-foreground line-clamp-3 font-body text-lg">
										{post.excerpt || post.content.substring(0, 150)}...
									</p>
								</div>
								<div className="mt-6 pt-4 border-t-2 border-muted flex justify-between items-center text-sm font-pixel text-muted-foreground">
									<span>{new Date(post.publishedAt).toLocaleDateString()}</span>
									<span>BY {post.authorName}</span>
								</div>
							</PixelCard>
						</Link>
					))
				)}
			</div>

			{/* Pagination Controls */}
			{posts && posts.length > 0 && (
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
