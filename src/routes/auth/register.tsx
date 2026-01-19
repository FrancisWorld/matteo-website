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
import { authClient, signUp } from "@/lib/auth-client";

const registerSchema = z
	.object({
		firstName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
		lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres"),
		email: z.string().email("E-mail inválido"),
		password: z
			.string()
			.min(5, "A senha deve ter pelo menos 5 caracteres")
			.regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
			.regex(
				/[!@#$%^&*(),.?":{}|<>]/,
				"A senha deve conter pelo menos um caractere especial",
			),
		confirmPassword: z.string(),
		minecraftUsername: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export const Route = createFileRoute("/auth/register")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			minecraftUsername: "",
		},
		onSubmit: async ({ value }) => {
			const validation = registerSchema.safeParse(value);
			if (!validation.success) {
				setError(validation.error.issues[0].message);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const result = await signUp.email({
					email: value.email,
					password: value.password,
					name: `${value.firstName} ${value.lastName}`,
					firstName: value.firstName,
					lastName: value.lastName,
					minecraftUsername: value.minecraftUsername,
					callbackURL: "/",
				} as any);

				if (result.error) {
					setError(result.error.message || "Erro ao criar conta");
					setLoading(false);
					return;
				}

				await authClient.emailOtp.sendVerificationOtp({
					email: value.email,
					type: "email-verification",
				});

				navigate({
					to: "/auth/verify-otp",
					search: { email: value.email },
				});
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

			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage:
						"radial-gradient(circle at 2px 2px, #55AA55 1px, transparent 0)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
			<div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative z-10 w-full max-w-md"
			>
				<PixelCard className="p-8 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#333]">
					<div className="space-y-6">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 mx-auto bg-primary/20 border-2 border-primary flex items-center justify-center">
								<Gamepad2 size={32} className="text-primary" />
							</div>

							<div>
								<h1 className="text-2xl font-pixel text-primary pixel-text-shadow tracking-wider">
									CRIAR CONTA
								</h1>
								<p className="font-body text-muted-foreground mt-2 text-lg">
									Junte-se ao Mundo do Matteo!
								</p>
							</div>
						</div>

						{error && (
							<div className="bg-destructive/10 border-2 border-destructive p-3 text-destructive font-body text-sm">
								{error}
							</div>
						)}

						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="space-y-4"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="grid grid-cols-2 gap-4"
							>
								<form.Field name="firstName">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300"
											>
												NOME
											</Label>
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Steve"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
										</div>
									)}
								</form.Field>
								<form.Field name="lastName">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300"
											>
												SOBRENOME
											</Label>
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Mine"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
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
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.35 }}
							>
								<form.Field name="minecraftUsername">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300 flex items-center gap-2"
											>
												<span className="text-primary">MINECRAFT USERNAME</span>
												<span className="text-[10px] text-muted-foreground">
													(OPCIONAL)
												</span>
											</Label>
											<Input
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Notch"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
											<p className="text-[10px] text-muted-foreground font-body">
												Usaremos isso para mostrar sua skin 3D!
											</p>
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
							>
								<form.Field name="password">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300"
											>
												SENHA
											</Label>
											<Input
												id={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
											<p className="text-[10px] text-muted-foreground font-body">
												Mínimo 5 caracteres, 1 maiúscula e 1 especial
											</p>
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 }}
							>
								<form.Field name="confirmPassword">
									{(field) => (
										<div className="space-y-2">
											<Label
												htmlFor={field.name}
												className="font-pixel text-xs text-gray-300"
											>
												CONFIRMAR SENHA
											</Label>
											<Input
												id={field.name}
												type="password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••"
												className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
											/>
										</div>
									)}
								</form.Field>
							</motion.div>

							<motion.div
								className="pt-4"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
							>
								<PixelButton
									type="submit"
									className="w-full h-12"
									isLoading={loading}
									disabled={loading}
								>
									<SparklesIcon size={16} className="mr-2" />
									REGISTRAR
								</PixelButton>
							</motion.div>
						</form>

						<div className="text-center font-body text-sm pt-4 border-t border-[#333]">
							<span className="text-muted-foreground">Já tem uma conta? </span>
							<Link
								to="/auth/login"
								className="text-primary hover:underline underline-offset-4 font-semibold"
							>
								Fazer Login
							</Link>
						</div>
					</div>
				</PixelCard>
			</motion.div>
		</div>
	);
}
