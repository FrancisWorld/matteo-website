import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		const user = session.data?.user;

		if (!user || user.role !== "admin") {
			throw redirect({
				to: "/",
			});
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
	return <Outlet />;
}
