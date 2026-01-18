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
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-pixel mb-8">ADMIN DASHBOARD</h1>
			<Outlet />
		</div>
	);
}
