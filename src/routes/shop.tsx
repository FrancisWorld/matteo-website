import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop")({
	component: Shop,
});

function Shop() {
	return (
		<div className="p-8 text-center">
			<h1 className="text-4xl font-pixel mb-4">LOJA DE MERCH</h1>
			<p className="font-body text-xl">Em breve...</p>
		</div>
	);
}
