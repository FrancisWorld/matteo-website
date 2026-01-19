import {
	Link,
	useNavigate,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { signOut } from "@/lib/auth-client";
import { DiscordIcon } from "../ui/discord";
import { InstagramIcon } from "../ui/instagram";
import { SearchIcon } from "../ui/search";
import { TwitterIcon } from "../ui/twitter";
import { YoutubeIcon } from "../ui/youtube";
import { PixelButton } from "./PixelButton";

export function PixelLayout({ children }: { children: React.ReactNode }) {
	const session = useAuthGuard();
	const user = session.data?.user as any;
	const router = useRouter();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const isHomePage = routerState.location.pathname === "/";

	const avatarUrl = user?.image
		? user.image
		: user?.minecraftUsername
			? `https://minotar.net/avatar/${encodeURIComponent(user.minecraftUsername)}/32`
			: null;

	const { scrollY } = useScroll();

	const headerBg = useTransform(
		scrollY,
		[0, 100],
		isHomePage
			? ["rgba(0,0,0,0)", "rgba(18,18,18,0.98)"]
			: ["rgba(18,18,18,0.95)", "rgba(18,18,18,0.98)"],
	);

	const headerBorder = useTransform(
		scrollY,
		[0, 100],
		isHomePage
			? ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
			: ["rgba(0,0,0,0.5)", "rgba(0,0,0,1)"],
	);

	const headerShadow = useTransform(
		scrollY,
		[0, 100],
		[
			"0 0 0 rgba(0,0,0,0)",
			"0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(85,170,85,0.1)",
		],
	);

	return (
		<div className="min-h-screen w-full bg-background text-foreground font-body flex flex-col relative">
			<motion.header
				className="fixed top-0 left-0 right-0 z-50 border-b-4 backdrop-blur-md"
				style={{
					backgroundColor: headerBg,
					borderColor: headerBorder,
					boxShadow: headerShadow,
				}}
			>
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">
					<div className="flex items-center gap-8">
						<Link to="/" className="group">
							<motion.span
								className="text-2xl font-pixel text-white tracking-widest pixel-text-shadow block"
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<span className="group-hover:text-primary transition-colors duration-200">
									MATTEO
								</span>
							</motion.span>
						</Link>

						<nav className="hidden md:flex items-center gap-6">
							<NavLink to="/videos">VÍDEOS</NavLink>
							<NavLink to="/blog">BLOG</NavLink>
							<NavLink to="/quiz">QUIZZES</NavLink>
							<NavLink to="/shop">LOJA</NavLink>
							<NavLink to="/community">COMUNIDADE</NavLink>
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<motion.button
							type="button"
							className="p-2 text-white/80 hover:text-white hover:bg-white/10"
							aria-label="Pesquisar"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<SearchIcon size={20} />
						</motion.button>
						{session.data ? (
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<Link to="/settings">
										{avatarUrl ? (
											<motion.img
												src={avatarUrl}
												alt={user.name}
												className="w-8 h-8 border-2 border-primary cursor-pointer"
												whileHover={{ scale: 1.1, rotate: 5 }}
											/>
										) : (
											<div className="w-8 h-8 border-2 border-primary bg-primary/20 flex items-center justify-center font-pixel text-[10px] cursor-pointer hover:scale-110 transition-transform">
												?
											</div>
										)}
									</Link>
									<Link to="/settings">
										<span className="font-pixel text-xs text-white hidden md:block hover:text-primary transition-colors cursor-pointer">
											{user?.name}
										</span>
									</Link>
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
			</motion.header>

			<main className="relative z-10 flex-1 w-full pt-20 bg-background">
				{children}
			</main>

			<footer className="relative z-10 bg-[#0a0a0a] border-t-4 border-[#222] pt-16 pb-8 text-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
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
						<div className="col-span-2 md:col-span-1">
							<h4 className="font-pixel text-sm mb-6 text-primary pixel-text-shadow">
								SIGA O MATTEO
							</h4>
							<div className="flex gap-3">
								<SocialIcon icon={<YoutubeIcon size={18} />} label="YouTube" />
								<SocialIcon icon={<TwitterIcon size={18} />} label="Twitter" />
								<SocialIcon
									icon={<InstagramIcon size={18} />}
									label="Instagram"
								/>
								<SocialIcon icon={<DiscordIcon size={18} />} label="Discord" />
							</div>
						</div>
					</div>

					<div className="border-t-2 border-[#222] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
						<div className="flex gap-6 font-body">
							<Link
								to="/"
								className="hover:text-primary transition-colors text-sm"
							>
								Política de Privacidade
							</Link>
							<Link
								to="/"
								className="hover:text-primary transition-colors text-sm"
							>
								Termos de Serviço
							</Link>
						</div>
						<p className="font-pixel text-[10px] text-gray-500">
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
		<Link to={to} className="relative group py-2">
			<span
				className={`font-pixel text-xs transition-colors pixel-text-shadow ${
					isActive ? "text-primary" : "text-gray-300 group-hover:text-white"
				}`}
			>
				{children}
			</span>
			{isActive && (
				<motion.div
					layoutId="navbar-indicator"
					className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(85,170,85,0.8)]"
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 30,
					}}
				/>
			)}
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
			<h4 className="font-pixel text-xs mb-4 text-gray-400 pixel-text-shadow tracking-wider">
				{heading}
			</h4>
			<ul className="space-y-2 font-body">
				{links.map((link) => (
					<li key={link.label}>
						<Link
							to={link.to}
							className="text-gray-500 hover:text-primary transition-colors text-base"
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
		<motion.a
			href="#"
			className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#333] text-gray-500 hover:text-white hover:border-primary hover:bg-primary/20 transition-colors"
			aria-label={label}
			whileHover={{ scale: 1.1, y: -2 }}
			whileTap={{ scale: 0.95 }}
		>
			{icon}
		</motion.a>
	);
}
