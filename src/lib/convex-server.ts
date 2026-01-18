import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export const convexServer = new ConvexHttpClient(
	import.meta.env.VITE_CONVEX_URL || process.env.VITE_CONVEX_URL!,
);

export const fetchPostBySlug = async (slug: string) => {
	return await convexServer.query(api.posts.getBySlug, { slug });
};
