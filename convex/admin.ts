import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const checkAdmin = async (ctx: any) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) throw new Error("Unauthorized");

	const user = await ctx.db
		.query("users")
		.withIndex("by_auth_id", (q: any) => q.eq("id", identity.subject))
		.first();

	if (!user || user.role !== "admin") {
		throw new Error("Unauthorized: Admin access required");
	}
	return user;
};

export const listUsers = query({
	handler: async (ctx) => {
		await checkAdmin(ctx);
		return await ctx.db.query("users").order("desc").collect();
	},
});

export const banUser = mutation({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		await checkAdmin(ctx);
		await ctx.db.patch(args.userId, { banned: true });
	},
});

export const deletePost = mutation({
	args: { postId: v.id("posts") },
	handler: async (ctx, args) => {
		await checkAdmin(ctx);
		await ctx.db.delete(args.postId);
	},
});

export const deleteQuiz = mutation({
	args: { quizId: v.id("quizzes") },
	handler: async (ctx, args) => {
		await checkAdmin(ctx);
		await ctx.db.delete(args.quizId);
	},
});

export const promoteToAdmin = mutation({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		await checkAdmin(ctx);
		const user = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("email"), args.email))
			.first();

		if (!user) {
			throw new Error("User not found");
		}

		await ctx.db.patch(user._id, { role: "admin" });
		return `User ${user.name} (${user.email}) is now an ADMIN`;
	},
});
