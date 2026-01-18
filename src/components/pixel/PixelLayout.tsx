import { Link } from "@tanstack/react-router";
import {
	Disc as Discord,
	Instagram,
	Search,
	Twitter,
	Youtube,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { PixelButton } from "./PixelButton";

export function PixelLayout({ children }: { children: React.ReactNode }) {
	const session = useSession();
	const user = session.data?.user;

	return (
		<div className="min-h-screen w-full bg-background text-foreground font-body flex flex-col relative overflow-hidden">
			{/* Background Pattern */}
			<div
				className="fixed inset-0 z-0 pointer-events-none opacity-5"
				style={{
					backgroundImage:
						"repeating-linear-gradient(45deg, var(--foreground) 25%, transparent 25%, transparent 75%, var(--foreground) 75%, var(--foreground)), repeating-linear-gradient(45deg, var(--foreground) 25%, var(--background) 25%, var(--background) 75%, var(--foreground) 75%, var(--foreground))",
					backgroundPosition: "0 0, 10px 10px",
					backgroundSize: "20px 20px",
				}}
			/>

			{/* Global Navigation (Minecraft Design System) */}
			<header className="relative z-50 bg-[#1e1e1e] border-b-4 border-b-[#000000] sticky top-0">
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">
					{/* Logo Section */}
					<div className="flex items-center gap-8">
						<Link
							to="/"
							className="text-2xl font-pixel text-white tracking-widest hover:text-primary transition-colors drop-shadow-[2px_2px_0_#000]"
						>
							MATTEO
						</Link>

						{/* Desktop Nav */}
						<nav className="hidden md:flex items-center gap-6">
							<NavLink to="/videos">VÍDEOS</NavLink>
							<NavLink to="/blog">BLOG</NavLink>
							<NavLink to="/shop">LOJA</NavLink>
							<NavLink to="/community">COMUNIDADE</NavLink>
						</nav>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="p-2 hover:bg-white/10 text-white"
							aria-label="Pesquisar"
						>
							<Search size={20} />
						</button>
						{session.data ? (
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									{user?.image ? (
										<img
											src={user.image}
											alt={user.name}
											className="w-8 h-8 border-2 border-foreground"
										/>
									) : (
										<div className="w-8 h-8 border-2 border-foreground bg-primary/20 flex items-center justify-center font-pixel text-[10px]">
											?
										</div>
									)}
									<span className="font-pixel text-xs text-white hidden md:block">
										{user?.name}
									</span>
								</div>
								<PixelButton
									variant="destructive"
									size="sm"
									onClick={() => signOut()}
								>
									SAIR
								</PixelButton>
							</div>
						) : (
							<Link to="/auth/login">
								<PixelButton
									variant="primary"
									size="sm"
									className="hidden sm:flex"
								>
									ENTRAR
								</PixelButton>
							</Link>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 flex-1 w-full">{children}</main>

			{/* Footer (Minecraft Design System) */}
			<footer className="relative z-10 bg-[#121212] border-t-4 border-[#333333] pt-16 pb-8 text-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
						<FooterColumn
							heading="CONTEÚDO"
							links={[
								"Últimos Vídeos",
								"Postagens do Blog",
								"Quizzes",
								"Séries",
							]}
						/>
						<FooterColumn
							heading="LOJA"
							links={[
								"Loja de Merch",
								"Skins Digitais",
								"Adesivos",
								"Gift Cards",
							]}
						/>
						<FooterColumn
							heading="COMUNIDADE"
							links={["Servidor no Discord", "Fan Art", "Fóruns", "Suporte"]}
						/>
						<div className="col-span-2 md:col-span-1">
							<h4 className="font-pixel text-lg mb-6 text-primary">
								SIGA O MATTEO
							</h4>
							<div className="flex gap-4">
								<SocialIcon icon={<Youtube size={20} />} label="YouTube" />
								<SocialIcon icon={<Twitter size={20} />} label="Twitter" />
								<SocialIcon icon={<Instagram size={20} />} label="Instagram" />
								<SocialIcon icon={<Discord size={20} />} label="Discord" />
							</div>
						</div>
					</div>

					<div className="border-t-2 border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
						<div className="flex gap-6">
							<Link to="/" className="hover:text-white">
								Política de Privacidade
							</Link>
							<Link to="/" className="hover:text-white">
								Termos de Serviço
							</Link>
							<Link to="/" className="hover:text-white">
								Marcas Registradas
							</Link>
						</div>
						<p>
							© {new Date().getFullYear()} MATTEO. Não é um produto oficial do
							Minecraft.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	return (
		<Link
			to={to}
			className="font-pixel text-xs text-gray-300 hover:text-white transition-colors relative group py-2"
		>
			{children}
			<span className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
		</Link>
	);
}

function FooterColumn({
	heading,
	links,
}: {
	heading: string;
	links: string[];
}) {
	return (
		<div>
			<h4 className="font-pixel text-lg mb-6 text-gray-400">{heading}</h4>
			<ul className="space-y-3 font-body text-lg">
				{links.map((link) => (
					<li key={link}>
						<Link
							to="/"
							className="text-gray-500 hover:text-white hover:underline decoration-primary decoration-2 underline-offset-4 transition-all"
						>
							{link}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<Link
			to="/"
			className="w-10 h-10 bg-[#333333] flex items-center justify-center hover:bg-primary hover:text-white transition-colors border-2 border-black shadow-[2px_2px_0_0_#000] text-gray-400"
			aria-label={label}
		>
			{icon}
		</Link>
	);
}
