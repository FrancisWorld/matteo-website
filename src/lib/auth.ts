import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { convexAdapter } from "./convex-adapter";

export const auth = betterAuth({
	database: convexAdapter(),
	plugins: [admin()],
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			firstName: {
				type: "string",
				required: false,
			},
			lastName: {
				type: "string",
				required: false,
			},
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	trustedOrigins: ["http://localhost:3000", "http://localhost:5173"], // Add dev origins
});
