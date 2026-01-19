import { createFileRoute, redirect } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/shop")({
	beforeLoad: async ({ location }) => {
		const session = await authClient.getSession();
		if (!session.data?.user) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: Shop,
});

function Shop() {
	return (
		<PageWrapper>
			<PageTitle subtitle="Adquira itens oficiais e apoie o canal">
				LOJA DE MERCH
			</PageTitle>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
				{[1, 2, 3].map((item) => (
					<PixelCard key={item} className="p-8 text-center space-y-4">
						<div className="w-full h-48 bg-muted border-2 border-dashed border-foreground/50 flex items-center justify-center">
							<ShoppingBag size={48} className="text-muted-foreground" />
						</div>
						<h3 className="text-xl font-pixel">ITEM MISTERIOSO #{item}</h3>
						<p className="text-muted-foreground font-body">Em breve...</p>
					</PixelCard>
				))}
			</div>
		</PageWrapper>
	);
}
