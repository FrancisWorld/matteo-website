import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
	component: Community,
});

function Community() {
	return (
		<div className="p-8 text-center">
			<h1 className="text-4xl font-pixel mb-4">COMUNIDADE</h1>
			<p className="font-body text-xl">Em breve...</p>
		</div>
	);
}
