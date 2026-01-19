import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import {
	fadeInUp,
	PageWrapper,
	staggerContainer,
} from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
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
			<div className="space-y-8">
				<div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
					<PageTitle subtitle="Histórias, tutoriais e novidades da comunidade">
						BLOG
					</PageTitle>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Link to="/blog/new">
							<PixelButton>NOVA POSTAGEM</PixelButton>
						</Link>
					</motion.div>
				</div>

				<motion.div
					key={posts ? "loaded" : "loading"}
					className="grid md:grid-cols-2 gap-8"
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{posts === undefined ? (
						["sk-p-1", "sk-p-2", "sk-p-3", "sk-p-4"].map((id) => (
							<motion.div
								key={id}
								variants={fadeInUp}
								className="h-64 bg-[#1a1a1a] animate-pulse border-2 border-[#222]"
							/>
						))
					) : posts.length === 0 ? (
						<motion.div
							className="col-span-2 text-center py-20"
							variants={fadeInUp}
						>
							<BookOpen
								size={64}
								className="mx-auto text-muted-foreground/30 mb-4"
							/>
							<p className="text-xl font-pixel text-muted-foreground mb-4">
								NENHUMA POSTAGEM ENCONTRADA
							</p>
							<p className="text-muted-foreground font-body">
								Comece a escrever sua primeira história!
							</p>
						</motion.div>
					) : (
						posts.map((post) => (
							<motion.div key={post._id} variants={fadeInUp}>
								<Link
									to="/blog/$slug"
									params={{ slug: post.slug }}
									className="block group h-full"
								>
									<PixelCard hoverEffect className="h-full flex flex-col">
										{post.coverImage && (
											<div className="aspect-video bg-muted mb-4 overflow-hidden border-2 border-[#333] relative">
												<img
													src={post.coverImage}
													alt={post.title}
													className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
											</div>
										)}
										<div className="flex-1 space-y-4">
											<h2 className="text-xl font-pixel group-hover:text-primary transition-colors pixel-text-shadow">
												{post.title}
											</h2>
											<p className="text-muted-foreground line-clamp-3 font-body text-lg">
												{post.excerpt || post.content.substring(0, 150)}...
											</p>
										</div>
										<div className="mt-6 pt-4 border-t-2 border-[#333] flex justify-between items-center text-xs font-pixel text-muted-foreground">
											<span>
												{new Date(post.publishedAt).toLocaleDateString("pt-BR")}
											</span>
											<span className="text-primary">
												POR {post.authorName}
											</span>
										</div>
									</PixelCard>
								</Link>
							</motion.div>
						))
					)}
				</motion.div>

				{posts && posts.length > 0 && (
					<motion.div
						className="flex justify-between items-center mt-12 pt-8 border-t-2 border-[#222]"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<PixelButton
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							variant="secondary"
						>
							<ChevronLeft size={16} className="mr-1" /> ANTERIOR
						</PixelButton>
						<div className="flex items-center gap-2 font-pixel text-xs">
							<span className="text-muted-foreground">Página</span>
							<span className="bg-primary text-primary-foreground px-3 py-1">
								{page}
							</span>
							<span className="text-muted-foreground">de</span>
							<span className="bg-[#333] text-white px-3 py-1">
								{totalPages}
							</span>
						</div>
						<PixelButton
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages}
							variant="secondary"
						>
							PRÓXIMO <ChevronRight size={16} className="ml-1" />
						</PixelButton>
					</motion.div>
				)}
			</div>
		</PageWrapper>
	);
}
