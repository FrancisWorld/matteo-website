import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_token", (q) => q.eq("token", args.token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error("Unauthorized: Invalid or expired session");
		}

		return await ctx.storage.generateUploadUrl();
	},
});

export const updateAvatar = mutation({
	args: { storageId: v.id("_storage"), token: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_token", (q) => q.eq("token", args.token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error("Unauthorized: Invalid or expired session");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_auth_id", (q) => q.eq("id", session.userId))
			.first();

		if (!user) throw new Error("User not found");
		if (user.banned) throw new Error("User is banned");

		if (user.updatedAt && Date.now() - user.updatedAt < 60000) {
			throw new Error("Wait 1 minute before updating again");
		}

		const imageUrl = await ctx.storage.getUrl(args.storageId);
		if (!imageUrl) throw new Error("Image not found");

		// Delete old avatar from storage if it was a Convex storage file
		if (user.image && user.image.includes("/api/storage/")) {
			try {
				const oldStorageId = user.image.split("/api/storage/")[1]?.split("?")[0];
				if (oldStorageId) {
					await ctx.storage.delete(oldStorageId as any);
				}
			} catch {
				// Ignore deletion errors (file may already be deleted or external URL)
			}
		}

		await ctx.db.patch(user._id, { image: imageUrl, updatedAt: Date.now() });

		return imageUrl;
	},
});

export const updateMinecraftUsername = mutation({
	args: { username: v.string(), token: v.string() },
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_token", (q) => q.eq("token", args.token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error("Unauthorized: Invalid or expired session");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_auth_id", (q) => q.eq("id", session.userId))
			.first();

		if (!user) throw new Error("User not found");
		if (user.banned) throw new Error("User is banned");

		if (user.updatedAt && Date.now() - user.updatedAt < 60000) {
			throw new Error("Wait 1 minute before updating again");
		}

		await ctx.db.patch(user._id, {
			minecraftUsername: args.username,
			updatedAt: Date.now(),
		});
	},
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("id", args.id))
      .first();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});
