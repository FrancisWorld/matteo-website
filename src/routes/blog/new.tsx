import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useId, useState } from "react";
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
		return <div className="p-8 text-center font-pixel">LOADING...</div>;
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
		// session.data is guaranteed here by early return
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
		<div className="max-w-2xl mx-auto py-12">
			<PixelCard>
				<h1 className="text-3xl font-pixel mb-8">CREATE NEW POST</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor={titleId} className="font-pixel text-xs">
							TITLE
						</label>
						<input
							id={titleId}
							className="w-full h-10 px-3 bg-input border-2 border-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
							value={title}
							onChange={handleTitleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor={slugId} className="font-pixel text-xs">
							SLUG
						</label>
						<input
							id={slugId}
							className="w-full h-10 px-3 bg-input border-2 border-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring text-muted-foreground"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor={imageId} className="font-pixel text-xs">
							COVER IMAGE URL
						</label>
						<input
							id={imageId}
							className="w-full h-10 px-3 bg-input border-2 border-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							placeholder="https://..."
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor={contentId} className="font-pixel text-xs">
							CONTENT
						</label>
						<textarea
							id={contentId}
							className="w-full h-64 p-3 bg-input border-2 border-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						/>
					</div>

					<PixelButton
						type="submit"
						disabled={submitting}
						isLoading={submitting}
						className="w-full"
					>
						PUBLISH TO WORLD
					</PixelButton>
				</form>
			</PixelCard>
		</div>
	);
}
