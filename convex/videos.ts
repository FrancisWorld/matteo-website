import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertBatch = internalMutation({
	args: {
		videos: v.array(
			v.object({
				youtubeId: v.string(),
				title: v.string(),
				description: v.optional(v.string()),
				thumbnail: v.string(),
				thumbnailHigh: v.optional(v.string()),
				viewCount: v.number(),
				likeCount: v.optional(v.number()),
				commentCount: v.optional(v.number()),
				duration: v.optional(v.string()),
				publishedAt: v.number(),
				fetchedAt: v.number(),
				tags: v.optional(v.array(v.string())),
			}),
		),
	},
	handler: async (ctx, args) => {
		for (const video of args.videos) {
			const existing = await ctx.db
				.query("videos")
				.withIndex("by_youtube_id", (q) => q.eq("youtubeId", video.youtubeId))
				.first();

			if (existing) {
				await ctx.db.patch(existing._id, video);
			} else {
				await ctx.db.insert("videos", video);
			}
		}
	},
});

export const list = query({
	args: {
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
		search: v.optional(v.string()),
		type: v.optional(v.union(v.literal("short"), v.literal("video"))),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 20;
		const offset = args.offset ?? 0;

		let videoQuery = ctx.db
			.query("videos")
			.withIndex("by_published")
			.order("desc");

		const videos = await videoQuery.collect();

		let filtered = videos;

		// Filter by Search
		if (args.search) {
			const searchLower = args.search.toLowerCase();
			filtered = filtered.filter(
				(v) =>
					v.title.toLowerCase().includes(searchLower) ||
					v.description?.toLowerCase().includes(searchLower),
			);
		}

		// Filter by Type (Short vs Video)
		if (args.type) {
			filtered = filtered.filter((v) => {
				const duration = v.duration;
				if (!duration) return false;

				// Parse ISO 8601 duration
				// Shorts are typically <= 60 seconds, but we allow up to 90s to be safe
				// Also check title/tags for #shorts

				const isShort = (() => {
					// Check metadata first
					const titleLower = v.title.toLowerCase();
					if (titleLower.includes("#shorts") || titleLower.includes("#short")) return true;
					
					// Check for 'H' (Hours) -> definitely long
					if (duration.includes("H")) return false;

					// Check minutes
					const minuteMatch = duration.match(/(\d+)M/);
					const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

					// Check seconds
					const secondMatch = duration.match(/(\d+)S/);
					const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;

					const totalSeconds = minutes * 60 + seconds;
					return totalSeconds <= 90;
				})();

				return args.type === "short" ? isShort : !isShort;
			});
		}

		return filtered.slice(offset, offset + limit);
	},
});

export const getById = query({
	args: { id: v.id("videos") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const getByYoutubeId = query({
	args: { youtubeId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("videos")
			.withIndex("by_youtube_id", (q) => q.eq("youtubeId", args.youtubeId))
			.first();
	},
});

export const getMostViewed = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.limit ?? 5;
		return await ctx.db
			.query("videos")
			.withIndex("by_views")
			.order("desc")
			.take(limit);
	},
});

export const getRecent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.limit ?? 5;
		return await ctx.db
			.query("videos")
			.withIndex("by_published")
			.order("desc")
			.take(limit);
	},
});

export const count = query({
	handler: async (ctx) => {
		const videos = await ctx.db.query("videos").collect();
		return videos.length;
	},
});
