import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/env")({
	server: {
		handlers: {
			GET: () => {
				return json({
					process_vite_convex_url: process.env.VITE_CONVEX_URL,
					process_convex_url: process.env.CONVEX_URL,
					import_meta_env_vite_convex_url: import.meta.env?.VITE_CONVEX_URL,
				});
			},
		},
	},
});
