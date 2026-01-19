import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelCard } from "@/components/pixel/PixelCard";

export const Route = createFileRoute("/terms")({
	component: TermsOfService,
});

function TermsOfService() {
	return (
		<PageWrapper>
			<PixelCard className="max-w-4xl mx-auto p-8 md:p-12 space-y-6">
				<h1 className="text-3xl md:text-5xl font-pixel text-primary mb-8">
					Termos de Serviço
				</h1>

				<div className="prose prose-invert max-w-none font-body text-gray-300 space-y-4">
					<p>Última atualização: {new Date().toLocaleDateString()}</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						1. Aceitação dos Termos
					</h2>
					<p>
						Ao acessar e usar o site do Matteo, você concorda em cumprir e ficar
						vinculado a estes Termos de Serviço. Se você não concordar com estes
						termos, por favor, não use nosso site.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">2. Uso do Site</h2>
					<p>
						Você concorda em usar o site apenas para fins legais e de uma
						maneira que não infrinja os direitos de terceiros ou restrinja o uso
						e aproveitamento do site por qualquer outra pessoa.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						3. Propriedade Intelectual
					</h2>
					<p>
						Todo o conteúdo presente neste site, incluindo textos, gráficos,
						logotipos e imagens, é propriedade do Matteo ou de seus
						licenciadores e está protegido por leis de direitos autorais.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						4. Contas de Usuário
					</h2>
					<p>
						Ao criar uma conta, você é responsável por manter a
						confidencialidade de suas credenciais e por todas as atividades que
						ocorrem sob sua conta.
					</p>

					<h2 className="text-xl font-pixel text-white mt-6">
						5. Modificações
					</h2>
					<p>
						Reservamo-nos o direito de modificar estes termos a qualquer
						momento. As alterações entrarão em vigor imediatamente após a
						publicação no site.
					</p>
				</div>
			</PixelCard>
		</PageWrapper>
	);
}
