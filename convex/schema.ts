import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(), // Better Auth ID
    name: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    minecraftUsername: v.optional(v.string()), // Username para buscar skin
    role: v.optional(v.string()),
    banned: v.optional(v.boolean()),
    banReason: v.optional(v.string()),
    banExpires: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_email", ["email"])
  .index("by_auth_id", ["id"]), // Renamed from by_id

  sessions: defineTable({
    id: v.string(),
    userId: v.string(), // References users.id (not Convex _id)
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_token", ["token"])
  .index("by_userId", ["userId"])
  .index("by_auth_id", ["id"]), // Renamed from by_id

  accounts: defineTable({
    id: v.string(),
    userId: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_provider_account", ["providerId", "accountId"])
  .index("by_userId", ["userId"])
  .index("by_auth_id", ["id"]), // Renamed from by_id

  verifications: defineTable({
    id: v.string(),
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_auth_id", ["id"]), // Renamed from by_id

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    authorId: v.string(), // References users.id (Better Auth ID)
    authorName: v.string(),
    publishedAt: v.number(),
    createdAt: v.number(),
  })
  .index("by_slug", ["slug"])
  .index("by_author", ["authorId"]),

	quizzes: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		authorId: v.string(),
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
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_author", ["authorId"]),

	quizResults: defineTable({
		quizId: v.id("quizzes"),
		userId: v.optional(v.string()),
		score: v.number(),
		totalQuestions: v.number(),
		answers: v.array(
			v.object({
				questionId: v.string(),
				selectedAnswerIndex: v.number(),
				isCorrect: v.boolean(),
			}),
		),
		completedAt: v.number(),
		shareToken: v.string(),
	})
		.index("by_quiz", ["quizId"])
		.index("by_user", ["userId"])
		.index("by_share_token", ["shareToken"]),

	videos: defineTable({
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
		fetchedAt: v.optional(v.number()),
		tags: v.optional(v.array(v.string())),
	})
		.index("by_youtube_id", ["youtubeId"])
		.index("by_published", ["publishedAt"])
		.index("by_views", ["viewCount"]),

	// Demo tables (optional to keep)
	products: defineTable({
		title: v.string(),
		imageId: v.string(),
		price: v.number(),
	}),
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
});
