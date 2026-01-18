import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
		timeLimit: v.optional(v.number()),
		questions: v.array(
			v.object({
				id: v.string(),
				question: v.string(),
				answers: v.array(v.string()),
				correctAnswerIndex: v.number(),
				explanation: v.optional(v.string()),
			}),
		),
		authorId: v.string(),
		coverImage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		return await ctx.db.insert("quizzes", {
			...args,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const get = query({
	args: { quizId: v.id("quizzes") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.quizId);
	},
});

export const list = query({
	args: { limit: v.optional(v.number()), offset: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10;
		const offset = args.offset ?? 0;
		const quizzes = await ctx.db.query("quizzes").order("desc").collect();
		return quizzes.slice(offset, offset + limit);
	},
});

export const count = query({
	handler: async (ctx) => {
		const quizzes = await ctx.db.query("quizzes").collect();
		return quizzes.length;
	},
});

export const getByAuthor = query({
	args: { authorId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("quizzes")
			.withIndex("by_author", (q) => q.eq("authorId", args.authorId))
			.collect();
	},
});

export const submitResult = mutation({
	args: {
		quizId: v.id("quizzes"),
		userId: v.optional(v.string()),
		answers: v.array(
			v.object({
				questionId: v.string(),
				selectedAnswerIndex: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		const quiz = await ctx.db.get(args.quizId);
		if (!quiz) {
			throw new Error("Quiz not found");
		}

		let correctCount = 0;
		const scoredAnswers = args.answers.map((ans) => {
			const question = quiz.questions.find((q: any) => q.id === ans.questionId);
			const isCorrect = question?.correctAnswerIndex === ans.selectedAnswerIndex;
			if (isCorrect) correctCount++;
			return { ...ans, isCorrect };
		});

		const shareToken = Math.random().toString(36).substring(2, 9);
		const resultId = await ctx.db.insert("quizResults", {
			quizId: args.quizId,
			userId: args.userId,
			score: correctCount,
			totalQuestions: args.answers.length,
			answers: scoredAnswers,
			completedAt: Date.now(),
			shareToken,
		});

		return { resultId, shareToken };
	},
});

export const getResultByToken = query({
	args: { shareToken: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("quizResults")
			.withIndex("by_share_token", (q) => q.eq("shareToken", args.shareToken))
			.first();
	},
});

export const getResultById = query({
	args: { resultId: v.id("quizResults") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.resultId);
	},
});

export const getUserResults = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("quizResults")
			.withIndex("by_user", (q) => q.eq("userId", args.userId))
			.collect();
	},
});
