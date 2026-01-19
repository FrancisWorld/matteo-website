import { createFileRoute, redirect } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/community")({
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
	component: Community,
});

function Community() {
	return (
		<PageWrapper>
			<PageTitle subtitle="Junte-se ao servidor e participe de eventos">
				COMUNIDADE
			</PageTitle>

			<div className="max-w-4xl mx-auto mt-12">
				<PixelCard className="p-12 text-center space-y-6">
					<div className="flex justify-center mb-6">
						<div className="p-6 bg-primary/20 rounded-full">
							<Users size={64} className="text-primary" />
						</div>
					</div>
					<h3 className="text-2xl font-pixel">DISCORD OFICIAL</h3>
					<p className="text-xl text-muted-foreground font-body max-w-lg mx-auto">
						Converse com outros fãs, compartilhe suas construções e fique por
						dentro das novidades do canal.
					</p>
					<div className="pt-4">
						<a
							href="https://discord.gg"
							target="_blank"
							rel="noreferrer"
							className="inline-block"
						>
							<div className="bg-[#5865F2] text-white px-8 py-4 font-pixel pixel-shadow-3d hover:translate-y-1 transition-transform">
								ENTRAR NO DISCORD
							</div>
						</a>
					</div>
				</PixelCard>
			</div>
		</PageWrapper>
	);
}
