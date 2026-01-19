import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/blog/new")({
	beforeLoad: async () => {
		// We rely on client-side protection or middleware for now
	},
	component: NewPost,
});

function NewPost() {
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const createPost = useMutation(api.posts.create);
	const navigate = Route.useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const session = authClient.useSession();
	const titleId = useId();
	const slugId = useId();
	const imageId = useId();
	const contentId = useId();

	if (session.isPending) {
		return (
			<PageWrapper className="flex items-center justify-center">
				<div className="p-8 text-center font-pixel animate-pulse">
					LOADING...
				</div>
			</PageWrapper>
		);
	}

	if (!session.data) {
		// Client-side redirect if not logged in
		window.location.href = "/login";
		return null;
	}

	// Auto-generate slug from title
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setTitle(val);
		setSlug(
			val
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, ""),
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		if (!session.data) return;

		try {
			await createPost({
				title,
				slug,
				content,
				coverImage: imageUrl || undefined,
				authorId: session.data.user.id,
				authorName: session.data.user.name,
			});
			navigate({ to: "/blog/$slug", params: { slug } });
		} catch (err) {
			console.error(err);
			alert("Failed to create post");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<PageWrapper>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-3xl mx-auto"
			>
				<div className="mb-8 text-center">
					<PageTitle subtitle="Compartilhe suas histórias com a comunidade">
						ESCREVER NOVO POST
					</PageTitle>
				</div>

				<PixelCard className="p-8 border-4 border-[#333] bg-[#fdf6e3] text-[#222] shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
					<div className="absolute left-0 top-0 bottom-0 w-8 bg-[#8b4513] border-r-2 border-[#5c2e0b] z-10" />
					<div className="absolute left-2 top-0 bottom-0 w-1 bg-[#a0522d] z-10" />

					<form onSubmit={handleSubmit} className="space-y-6 pl-8">
						<div className="space-y-2">
							<label
								htmlFor={titleId}
								className="font-pixel text-xs text-[#555]"
							>
								TÍTULO
							</label>
							<input
								id={titleId}
								className="w-full h-12 px-3 bg-white border-2 border-[#333] font-pixel text-lg focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_rgba(85,170,85,0.4)] transition-all"
								value={title}
								onChange={handleTitleChange}
								placeholder="A Incrível Aventura..."
								required
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor={slugId}
								className="font-pixel text-xs text-[#555]"
							>
								SLUG (URL AMIGÁVEL)
							</label>
							<input
								id={slugId}
								className="w-full h-10 px-3 bg-[#eee] border-2 border-[#ccc] font-body text-muted-foreground text-sm focus:outline-none"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								required
								readOnly
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor={imageId}
								className="font-pixel text-xs text-[#555]"
							>
								URL DA CAPA (OPCIONAL)
							</label>
							<input
								id={imageId}
								className="w-full h-10 px-3 bg-white border-2 border-[#333] font-body focus:outline-none focus:border-primary transition-colors"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								placeholder="https://exemplo.com/imagem.jpg"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor={contentId}
								className="font-pixel text-xs text-[#555]"
							>
								CONTEÚDO
							</label>
							<div className="relative">
								<textarea
									id={contentId}
									className="w-full h-96 p-4 bg-white border-2 border-[#333] font-body text-lg leading-relaxed focus:outline-none focus:border-primary transition-colors resize-y"
									style={{
										backgroundImage:
											"linear-gradient(#f1f1f1 1px, transparent 1px)",
										backgroundSize: "100% 2rem",
										lineHeight: "2rem",
										paddingTop: "0.5rem",
									}}
									value={content}
									onChange={(e) => setContent(e.target.value)}
									required
									placeholder="Escreva sua história aqui..."
								/>
							</div>
						</div>

						<div className="pt-4 flex justify-end">
							<PixelButton
								type="submit"
								disabled={submitting}
								isLoading={submitting}
								size="lg"
								className="w-full md:w-auto"
							>
								PUBLICAR HISTÓRIA
							</PixelButton>
						</div>
					</form>
				</PixelCard>
			</motion.div>
		</PageWrapper>
	);
}
