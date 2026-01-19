import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SparklesIcon } from "@/components/ui/sparkles";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/auth/login")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			setLoading(true);
			setError(null);
			try {
				const result = await signIn.email({
					email: value.email,
					password: value.password,
					callbackURL: redirect || "/",
				});

				if (result.error) {
					setError(result.error.message || "E-mail ou senha incorretos");
				} else {
					navigate({ to: redirect || "/" });
				}
			} catch (err) {
				setError("Ocorreu um erro inesperado");
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden px-4 py-12">
			<div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a1a0a]" />

			<motion.div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage:
						"radial-gradient(circle at 2px 2px, #55AA55 1px, transparent 0)",
					backgroundSize: "40px 40px",
				}}
				animate={{
					backgroundPosition: ["0px 0px", "40px 40px"],
				}}
				transition={{
					duration: 20,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>

			<div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
			<div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

			<motion.div
				initial={{ opacity: 0, y: 30, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
				className="relative z-10 w-full max-w-md"
			>
				<PixelCard className="p-8 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#333]">
					<div className="space-y-6">
						<motion.div
							className="text-center space-y-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<motion.div
								className="w-16 h-16 mx-auto bg-primary/20 border-2 border-primary flex items-center justify-center"
								whileHover={{ scale: 1.1, rotate: 5 }}
							>
								<Gamepad2 size={32} className="text-primary" />
							</motion.div>

							<div>
								<h1 className="text-2xl font-pixel text-primary pixel-text-shadow tracking-wider">
									LOGIN
								</h1>
								<p className="font-body text-muted-foreground mt-2 text-lg">
									Bem-vindo de volta, aventureiro!
								</p>
							</div>
						</motion.div>

						{error && (
							<motion.div
								className="bg-destructive/10 border-2 border-destructive p-3 text-destructive font-body text-sm"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
							>
								{error}
							</motion.div>
						)}

						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="space-y-5"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
							>
								<form.Field name="email">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300"
											>
												E-MAIL
											</Label>
											<Input
												id={field.name}
												type="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="exemplo@email.com"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
											{field.state.meta.errors ? (
												<em className="text-destructive text-xs font-body">
													{field.state.meta.errors.join(", ")}
												</em>
											) : null}
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
							>
								<form.Field name="password">
									{(field) => (
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<Label
													htmlFor={field.name}
													className="font-pixel text-xs text-gray-300"
												>
													SENHA
												</Label>
												<Link
													to="/auth/forgot-password"
													className="text-xs font-body text-primary hover:underline underline-offset-2"
												>
													Esqueceu a senha?
												</Link>
											</div>
											<Input
												id={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
											{field.state.meta.errors ? (
												<em className="text-destructive text-xs font-body">
													{field.state.meta.errors.join(", ")}
												</em>
											) : null}
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								className="pt-4"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<PixelButton
									type="submit"
									className="w-full h-12"
									isLoading={loading}
									disabled={loading}
								>
									<SparklesIcon size={16} className="mr-2" />
									ENTRAR
								</PixelButton>
							</motion.div>
						</form>

						<motion.div
							className="text-center font-body text-sm pt-4 border-t border-[#333]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<span className="text-muted-foreground">Não tem uma conta? </span>
							<Link
								to="/auth/register"
								className="text-primary hover:underline underline-offset-4 font-semibold"
							>
								Criar Conta
							</Link>
						</motion.div>
					</div>
				</PixelCard>
			</motion.div>
		</div>
	);
}
