import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

export function useAuthGuard() {
	const router = useRouter();
	const session = useSession();
	const wasAuthenticated = useRef<boolean | null>(null);

	useEffect(() => {
		const isAuthenticated = !!session.data?.user;

		if (wasAuthenticated.current === null) {
			wasAuthenticated.current = isAuthenticated;
			return;
		}

		if (wasAuthenticated.current && !isAuthenticated) {
			router.invalidate();
		}

		wasAuthenticated.current = isAuthenticated;
	}, [session.data?.user, router]);

	return session;
}
