import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelCard } from "@/components/pixel/PixelCard";
import { fetchPostBySlug } from "@/lib/convex-server";

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		const post = await fetchPostBySlug(params.slug);
		return { post };
	},
	head: ({ loaderData }: { loaderData?: { post?: any } }) => ({
		meta: !loaderData?.post
			? [{ title: "Post Not Found | Matteo" }]
			: [
					{ title: `${loaderData.post.title} | Matteo` },
					{
						name: "description",
						content:
							loaderData.post.excerpt || "Read this amazing post on Matteo.",
					},
					{ property: "og:title", content: loaderData.post.title },
					{ property: "og:image", content: loaderData.post.coverImage },
				],
	}),
	component: BlogPost,
});

function BlogPost() {
	const { post } = Route.useLoaderData();

	if (!post) {
		return (
			<PageWrapper className="flex items-center justify-center min-h-[50vh]">
				<PixelCard className="text-center p-6 md:p-8 3xl:p-12 4xl:p-16">
					<h1 className="text-2xl md:text-4xl 3xl:text-5xl 4xl:text-6xl font-pixel mb-2 md:mb-4">
						404
					</h1>
					<p className="text-muted-foreground text-sm md:text-base 3xl:text-lg 4xl:text-xl">
						Post not found in this dimension.
					</p>
				</PixelCard>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<article className="max-w-3xl mx-auto space-y-6 md:space-y-8 3xl:space-y-10 4xl:space-y-12 pb-12 md:pb-16 3xl:pb-20 4xl:pb-32">
				{post.coverImage && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ ease: "linear", duration: 0.5 }}
						className="aspect-video w-full overflow-hidden border-4 md:border-6 4xl:border-8 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] md:shadow-[10px_10px_0px_0px_var(--foreground)] 4xl:shadow-[16px_16px_0px_0px_var(--foreground)] relative"
					>
						<img
							src={post.coverImage}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
						<div className="absolute bottom-0 left-0 p-4 md:p-6 lg:p-8 3xl:p-10 4xl:p-16">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-7xl font-pixel text-white drop-shadow-[4px_4px_0_#000] leading-tight">
								{post.title}
							</h1>
						</div>
					</motion.div>
				)}

				{!post.coverImage && (
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-6xl 4xl:text-7xl font-pixel text-center py-8 md:py-12 3xl:py-16 4xl:py-24 border-b-4 md:border-b-6 4xl:border-b-8 border-foreground border-dashed">
						{post.title}
					</h1>
				)}

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs md:text-sm 3xl:text-base 4xl:text-lg text-muted-foreground font-pixel border-b-2 md:border-b-3 4xl:border-b-4 border-muted pb-3 md:pb-4 3xl:pb-5 4xl:pb-6">
					<span>{new Date(post.publishedAt).toLocaleDateString()}</span>
					<span className="whitespace-nowrap">AUTHOR: {post.authorName}</span>
				</div>

				<div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl dark:prose-invert max-w-none font-body leading-relaxed text-sm md:text-base 3xl:text-lg 4xl:text-2xl text-foreground">
					{/* Simple text rendering for now, can be upgraded to Markdown */}
					{post.content.split("\n").map((paragraph: string) =>
						paragraph ? (
							<p key={paragraph} className="mb-4 md:mb-5 3xl:mb-6 4xl:mb-8">
								{paragraph}
							</p>
						) : (
							<br key={Math.random()} />
						),
					)}
				</div>
			</article>
		</PageWrapper>
	);
}
