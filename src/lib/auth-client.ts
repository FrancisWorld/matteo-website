import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
	ac,
	adminRole,
	creatorRole,
	moderatorRole,
	userRole,
} from "./permissions";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [
		adminClient({
			ac,
			roles: {
				admin: adminRole,
				moderator: moderatorRole,
				creator: creatorRole,
				user: userRole,
			},
		}),
		emailOTPClient(),
	],
});

export const { useSession, signIn, signOut, signUp } = authClient;
