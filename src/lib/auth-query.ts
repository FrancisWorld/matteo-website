import { queryOptions } from "@tanstack/react-query";
import { authClient } from "./auth-client";

export const authQueryOptions = queryOptions({
	queryKey: ["auth", "session"],
	queryFn: async () => {
		const session = await authClient.getSession();
		return session.data;
	},
	staleTime: 5 * 60 * 1000,
	refetchOnWindowFocus: true,
});
