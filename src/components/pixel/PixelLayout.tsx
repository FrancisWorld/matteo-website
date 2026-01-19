import {
	Link,
	useNavigate,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { DiscordIcon } from "@/components/ui/discord";
import { HamburgerIcon } from "@/components/ui/hamburger";
import { InstagramIcon } from "@/components/ui/instagram";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TwitterIcon } from "@/components/ui/twitter";
import { YoutubeIcon } from "@/components/ui/youtube";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { signOut } from "@/lib/auth-client";
import { PixelButton } from "./PixelButton";

export function PixelLayout({ children }: { children: React.ReactNode }) {
	const session = useAuthGuard();
	const user = session.data?.user as any;
	const router = useRouter();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="min-h-screen w-full bg-background text-foreground font-body flex flex-col relative">
			{/* Global Navigation (Minecraft Design System) */}
			<header className="relative z-50 bg-[#1e1e1e] border-b-4 border-b-[#000000] sticky top-0">
				<div className="container mx-auto px-4 py-3 md:py-4 3xl:py-5 4xl:py-6 flex items-center justify-between">
					{/* Logo Section */}
					<div className="flex items-center gap-4 md:gap-8">
						<Link
							to="/"
							className="text-lg md:text-2xl 3xl:text-3xl 4xl:text-4xl font-pixel text-white tracking-widest hover:text-primary transition-colors drop-shadow-[2px_2px_0_#000]"
						>
							MATTEO
						</Link>

						{/* Desktop Nav */}
						<nav className="hidden md:flex items-center gap-4 lg:gap-6 3xl:gap-8">
							<NavLink to="/videos">VÍDEOS</NavLink>
							<NavLink to="/blog">BLOG</NavLink>
							<NavLink to="/quiz">QUIZZES</NavLink>
							<NavLink to="/shop">LOJA</NavLink>
							<NavLink to="/community">COMUNIDADE</NavLink>
						</nav>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2 md:gap-4">
						<button
							type="button"
							className="p-2 md:p-3 hover:bg-white/10 text-white hover:scale-110 transition-transform"
							aria-label="Pesquisar"
						>
							<Search size={20} className="md:size-5 4xl:size-7" />
						</button>
						{session.data ? (
							<div className="flex items-center gap-2 md:gap-4">
								<div className="flex items-center gap-2">
									{user?.image ? (
										<img
											src={user.image}
											alt={user.name}
											className="w-8 h-8 md:w-10 md:h-10 4xl:w-12 4xl:h-12 border-2 border-foreground"
										/>
									) : (
										<div className="w-8 h-8 md:w-10 md:h-10 4xl:w-12 4xl:h-12 border-2 border-foreground bg-primary/20 flex items-center justify-center font-pixel text-[8px] md:text-[10px] 4xl:text-[12px]">
											?
										</div>
									)}
									<span className="font-pixel text-xs md:text-sm 3xl:text-base 4xl:text-lg text-white hidden md:block">
										{user?.name}
									</span>
								</div>
								<PixelButton
									variant="destructive"
									size="sm"
									onClick={() => {
										signOut({
											fetchOptions: {
												onSuccess: () => {
													router.invalidate().then(() => {
														navigate({ to: "/" });
													});
												},
											},
										});
									}}
									className="text-xs md:text-sm"
								>
									SAIR
								</PixelButton>
							</div>
						) : (
							<Link to="/auth/login">
								<PixelButton
									variant="primary"
									size="sm"
									className="hidden sm:flex text-xs md:text-sm"
								>
									ENTRAR
								</PixelButton>
							</Link>
						)}

						{/* Mobile Menu */}
						<div className="md:hidden">
							<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
								<SheetTrigger asChild>
									<HamburgerIcon isOpen={menuOpen} />
								</SheetTrigger>
								<SheetContent
									side="right"
									className="w-64 bg-[#1e1e1e] border-l-4 border-[#000000]"
								>
									<nav className="flex flex-col gap-4 pt-8">
										<MobileNavLink
											to="/videos"
											onClick={() => setMenuOpen(false)}
										>
											VÍDEOS
										</MobileNavLink>
										<MobileNavLink
											to="/blog"
											onClick={() => setMenuOpen(false)}
										>
											BLOG
										</MobileNavLink>
										<MobileNavLink
											to="/shop"
											onClick={() => setMenuOpen(false)}
										>
											LOJA
										</MobileNavLink>
										<MobileNavLink
											to="/community"
											onClick={() => setMenuOpen(false)}
										>
											COMUNIDADE
										</MobileNavLink>
									</nav>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</header>

			<main className="relative z-10 flex-1 w-full pt-20 bg-background">
				{children}
			</main>

			{/* Footer (Minecraft Design System) */}
			<footer className="relative z-10 bg-[#121212] border-t-4 border-[#333333] pt-12 md:pt-16 3xl:pt-20 4xl:pt-32 pb-8 text-white">
				<div className="container mx-auto px-4 container-px">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 3xl:gap-10 mb-12">
						<FooterColumn
							heading="CONTEÚDO"
							links={[
								{ label: "Últimos Vídeos", to: "/videos" },
								{ label: "Postagens do Blog", to: "/blog" },
								{ label: "Quizzes", to: "/quiz" },
								{ label: "Séries", to: "/videos" },
							]}
						/>
						<FooterColumn
							heading="LOJA"
							links={[
								{ label: "Loja de Merch", to: "/shop" },
								{ label: "Skins Digitais", to: "/shop" },
								{ label: "Adesivos", to: "/shop" },
								{ label: "Gift Cards", to: "/shop" },
							]}
						/>
						<FooterColumn
							heading="COMUNIDADE"
							links={[
								{ label: "Servidor no Discord", to: "/community" },
								{ label: "Fan Art", to: "/community" },
								{ label: "Fóruns", to: "/community" },
								{ label: "Suporte", to: "/community" },
							]}
						/>
						<div className="sm:col-span-2 lg:col-span-1">
							<h4 className="font-pixel text-base md:text-lg 3xl:text-xl 4xl:text-2xl mb-4 md:mb-6 text-primary">
								SIGA O MATTEO
							</h4>
							<div className="flex gap-3 md:gap-4 4xl:gap-6">
								<SocialIcon icon={<YoutubeIcon size={24} />} label="YouTube" />
								<SocialIcon icon={<TwitterIcon size={24} />} label="Twitter" />
								<SocialIcon
									icon={<InstagramIcon size={24} />}
									label="Instagram"
								/>
								<SocialIcon icon={<DiscordIcon size={24} />} label="Discord" />
							</div>
						</div>
					</div>

					<div className="border-t-2 border-[#333333] pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm 3xl:text-base 4xl:text-lg text-gray-500 gap-4">
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
							<Link to="/" className="hover:text-white">
								Política de Privacidade
							</Link>
							<Link to="/" className="hover:text-white">
								Termos de Serviço
							</Link>
						</div>
						<p className="font-pixel text-[10px] md:text-xs 3xl:text-sm 4xl:text-base text-gray-500">
							© {new Date().getFullYear()} MATTEO
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	const routerState = useRouterState();
	const isActive = routerState.location.pathname.startsWith(to);

	return (
		<Link
			to={to}
			className="font-pixel text-xs md:text-sm 3xl:text-base 4xl:text-lg text-gray-300 hover:text-white transition-colors relative group py-2"
		>
			{children}
			<span className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
		</Link>
	);
}

function MobileNavLink({
	to,
	children,
	onClick,
}: {
	to: string;
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<Link
			to={to}
			onClick={onClick}
			className="font-pixel text-lg md:text-xl px-4 py-3 text-gray-300 hover:text-white hover:bg-muted transition-colors block rounded"
		>
			{children}
		</Link>
	);
}

function FooterColumn({
	heading,
	links,
}: {
	heading: string;
	links: { label: string; to: string }[];
}) {
	return (
		<div>
			<h4 className="font-pixel text-sm md:text-base 3xl:text-lg 4xl:text-2xl mb-3 md:mb-6 text-gray-400">
				{heading}
			</h4>
			<ul className="space-y-2 md:space-y-3 font-body text-sm md:text-base 3xl:text-lg 4xl:text-xl">
				{links.map((link) => (
					<li key={link.label}>
						<Link
							to={link.to}
							className="text-gray-500 hover:text-primary transition-colors"
						>
							{link.label}
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
			className="w-12 h-12 md:w-10 md:h-10 4xl:w-16 4xl:h-16 bg-[#333333] flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all border-2 border-black shadow-[2px_2px_0_0_#000] text-gray-400"
			aria-label={label}
		>
			{icon}
		</Link>
	);
}
