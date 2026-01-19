import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../../convex/_generated/api";

export const Route = createFileRoute("/user/$username/blog")({
	head: ({ params }) => ({
		meta: [
			{ title: `${params.username}'s Blog | Matteo` },
			{ name: "description", content: `Read posts from ${params.username}` },
		],
	}),
	component: UserBlogIndex,
});

function UserBlogIndex() {
	const { username } = Route.useParams();
	const [page, setPage] = useState(1);
	const postsPerPage = 10;
	const offset = (page - 1) * postsPerPage;

	const user = useQuery(api.users.getByName, { name: username });
	const posts = useQuery(
		api.posts.listByAuthor,
		user ? { authorId: user.id, limit: postsPerPage, offset } : "skip",
	);
	const postCount = useQuery(
		api.posts.countByAuthor,
		user ? { authorId: user.id } : "skip",
	);

	const totalPages = postCount ? Math.ceil(postCount / postsPerPage) : 1;

	if (!user) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<PixelCard className="text-center p-12">
					<h1 className="text-4xl font-pixel mb-4">USER NOT FOUND</h1>
					<p className="text-muted-foreground mb-6">
						The user "{username}" could not be found.
					</p>
					<Link to="/blog">
						<PixelButton>BACK TO BLOG</PixelButton>
					</Link>
				</PixelCard>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-pixel mb-2">{username.toUpperCase()}</h1>
					<p className="text-muted-foreground font-body">
						{postCount || 0} post{postCount !== 1 ? "s" : ""}
					</p>
				</div>
				<Link to="/blog">
					<PixelButton variant="secondary">BACK TO BLOG</PixelButton>
				</Link>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{posts === undefined ? (
					Array.from({ length: 4 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="h-64 bg-muted animate-pulse border-2 border-muted"
						/>
					))
				) : posts.length === 0 ? (
					<p className="col-span-2 text-center text-muted-foreground font-pixel py-12">
						NO POSTS YET FROM {username.toUpperCase()}
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

			{posts && typeof posts !== "string" && posts.length > 0 && (
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
		</PageWrapper>
	);
}
