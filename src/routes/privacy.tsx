import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelCard } from "@/components/pixel/PixelCard";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPolicy,
});

function PrivacyPolicy() {
	return (
		<PageWrapper>
			<PixelCard className="max-w-4xl mx-auto p-8 md:p-12 space-y-6">
				<h1 className="text-3xl md:text-5xl font-pixel text-primary mb-8">
					Política de Privacidade
				</h1>

				<div className="prose prose-invert max-w-none font-body text-gray-300 space-y-4">
					<p>Última atualização: {new Date().toLocaleDateString()}</p>

					<h2 className="text-xl font-pixel text-white mt-6">1. Introdução</h2>
					<p>
						Bem-vindo ao site do Matteo. Nós respeitamos sua privacidade e
						estamos comprometidos em proteger suas informações pessoais.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						2. Informações que Coletamos
					</h2>
					<p>
						Coletamos informações que você nos fornece diretamente, como quando
						cria uma conta, se inscreve em nossa newsletter ou entra em contato
						conosco. Isso pode incluir seu nome, endereço de e-mail e nome de
						usuário do Minecraft.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						3. Como Usamos Suas Informações
					</h2>
					<p>
						Usamos suas informações para fornecer, manter e melhorar nossos
						serviços, incluindo:
					</p>
					<ul className="list-disc pl-6 space-y-2">
						<li>Gerenciar sua conta e fornecer suporte ao cliente.</li>
						<li>
							Enviar atualizações, newsletters e comunicações de marketing.
						</li>
						<li>Personalizar sua experiência no site.</li>
					</ul>

					<h2 className="text-xl font-pixel text-white mt-6">
						4. Compartilhamento de Informações
					</h2>
					<p>
						Não vendemos ou alugamos suas informações pessoais para terceiros.
						Podemos compartilhar informações com prestadores de serviços que nos
						ajudam a operar nosso site.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">5. Contato</h2>
					<p>
						Se você tiver dúvidas sobre esta Política de Privacidade, entre em
						contato conosco através dos canais oficiais da comunidade.
					</p>
				</div>
			</PixelCard>
		</PageWrapper>
	);
}
