import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useState } from "react";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { ChevronLeft } from "@/components/ui/chevron-left";
import { ChevronRight } from "@/components/ui/chevron-right";
import { authQueryOptions } from "@/lib/auth-query";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/blog/")({
	beforeLoad: async ({ context, location }) => {
		const sessionData =
			await context.queryClient.ensureQueryData(authQueryOptions);
		if (!sessionData?.user) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
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
		<PageWrapper>
			<div className="space-y-6 md:space-y-8 3xl:space-y-10 4xl:space-y-12">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
					<h1 className="text-2xl sm:text-3xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel">
						BLOG POSTS
					</h1>
					<Link to="/blog/new">
						<PixelButton className="text-xs md:text-sm 3xl:text-base 4xl:text-lg">
							NEW POST
						</PixelButton>
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-4 md:gap-6 3xl:gap-8 4xl:gap-10">
					{posts === undefined ? (
						// Loading Skeletons
						Array.from({ length: 4 }).map((_, i) => (
							<div
								key={`skeleton-${i}`}
								className="h-48 md:h-56 3xl:h-64 4xl:h-80 bg-muted animate-pulse border-2 md:border-3 4xl:border-4 border-muted"
							/>
						))
					) : posts.length === 0 ? (
						<p className="col-span-full text-center text-muted-foreground font-pixel py-12 md:py-16 text-sm md:text-base 3xl:text-lg 4xl:text-2xl">
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
										<div className="aspect-video bg-muted mb-3 md:mb-4 3xl:mb-5 overflow-hidden border-2 md:border-3 4xl:border-4 border-foreground relative">
											<img
												src={post.coverImage}
												alt={post.title}
												className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
											/>
											{/* Scanline effect overlay */}
											<div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none" />
										</div>
									)}
									<div className="flex-1 space-y-2 md:space-y-3 3xl:space-y-4">
										<h2 className="text-lg md:text-2xl 3xl:text-3xl 4xl:text-4xl font-pixel group-hover:text-primary transition-colors">
											{post.title}
										</h2>
										<p className="text-muted-foreground line-clamp-2 md:line-clamp-3 font-body text-xs md:text-base 3xl:text-lg 4xl:text-xl">
											{post.excerpt || post.content.substring(0, 150)}...
										</p>
									</div>
									<div className="mt-4 md:mt-6 3xl:mt-8 pt-3 md:pt-4 border-t-2 md:border-t-3 4xl:border-t-4 border-muted flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs md:text-sm 3xl:text-base 4xl:text-lg font-pixel text-muted-foreground">
										<span>
											{new Date(post.publishedAt).toLocaleDateString()}
										</span>
										<span className="whitespace-nowrap">
											BY {post.authorName}
										</span>
									</div>
								</PixelCard>
							</Link>
						))
					)}
				</div>

				{/* Pagination Controls */}
				{posts && posts.length > 0 && (
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
