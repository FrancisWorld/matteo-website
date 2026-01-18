import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
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
			<div className="flex items-center justify-center min-h-[50vh]">
				<PixelCard className="text-center p-12">
					<h1 className="text-4xl font-pixel mb-4">404</h1>
					<p className="text-muted-foreground">
						Post not found in this dimension.
					</p>
				</PixelCard>
			</div>
		);
	}

	return (
		<article className="max-w-4xl mx-auto space-y-8 pb-20">
			{post.coverImage && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ ease: "linear", duration: 0.5 }}
					className="aspect-video w-full overflow-hidden border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] relative"
				>
					<img
						src={post.coverImage}
						alt={post.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
					<div className="absolute bottom-0 left-0 p-8">
						<h1 className="text-4xl md:text-6xl font-pixel text-white drop-shadow-[4px_4px_0_#000] leading-tight">
							{post.title}
						</h1>
					</div>
				</motion.div>
			)}

			{!post.coverImage && (
				<h1 className="text-4xl md:text-6xl font-pixel text-center py-12 border-b-4 border-foreground border-dashed">
					{post.title}
				</h1>
			)}

			<div className="flex justify-between items-center text-muted-foreground font-pixel border-b-2 border-muted pb-4">
				<span>{new Date(post.publishedAt).toLocaleDateString()}</span>
				<span>AUTHOR: {post.authorName}</span>
			</div>

			<div className="prose prose-lg dark:prose-invert max-w-none font-body text-xl leading-relaxed">
				{/* Simple text rendering for now, can be upgraded to Markdown */}
				{post.content
					.split("\n")
					.map((paragraph: string) =>
						paragraph ? (
							<p key={paragraph}>{paragraph}</p>
						) : (
							<br key={Math.random()} />
						),
					)}
			</div>
		</article>
	);
}
