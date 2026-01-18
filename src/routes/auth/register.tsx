import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

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
		image: z
			.string()
			.url("URL de imagem inválida")
			.optional()
			.or(z.literal("")),
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
			image: "",
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
					image: value.image || undefined,
					firstName: value.firstName,
					lastName: value.lastName,
					callbackURL: "/",
				} as any);

				if (result.error) {
					setError(result.error.message || "Erro ao criar conta");
				} else {
					navigate({ to: "/" });
				}
			} catch (err) {
				setError("Ocorreu um erro inesperado");
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
			<PixelCard className="w-full max-w-md">
				<div className="space-y-6">
					<div className="text-center space-y-2">
						<h1 className="text-3xl font-pixel text-primary uppercase tracking-tighter">
							Criar Conta
						</h1>
						<p className="font-pixel-body text-muted-foreground">
							Junte-se ao Mundo do Matteo!
						</p>
					</div>

					{error && (
						<div className="bg-destructive/10 border-2 border-destructive p-3 text-destructive font-pixel-body text-sm">
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
						<div className="grid grid-cols-2 gap-4">
							<form.Field name="firstName">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name} className="font-pixel text-xs">
											Nome
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Steve"
											className="border-2 border-foreground rounded-none font-pixel-body"
										/>
										{field.state.meta.errors ? (
											<em className="text-destructive text-[10px] font-pixel-body">
												{field.state.meta.errors.join(", ")}
											</em>
										) : null}
									</div>
								)}
							</form.Field>
							<form.Field name="lastName">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name} className="font-pixel text-xs">
											Sobrenome
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Mine"
											className="border-2 border-foreground rounded-none font-pixel-body"
										/>
										{field.state.meta.errors ? (
											<em className="text-destructive text-[10px] font-pixel-body">
												{field.state.meta.errors.join(", ")}
											</em>
										) : null}
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-pixel text-xs">
										E-mail
									</Label>
									<Input
										id={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="exemplo@email.com"
										className="border-2 border-foreground rounded-none font-pixel-body"
									/>
									{field.state.meta.errors ? (
										<em className="text-destructive text-[10px] font-pixel-body">
											{field.state.meta.errors.join(", ")}
										</em>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field name="image">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-pixel text-xs">
										URL da Foto (Opcional)
									</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://..."
										className="border-2 border-foreground rounded-none font-pixel-body"
									/>
									{field.state.meta.errors ? (
										<em className="text-destructive text-[10px] font-pixel-body">
											{field.state.meta.errors.join(", ")}
										</em>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-pixel text-xs">
										Senha
									</Label>
									<Input
										id={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="••••••••"
										className="border-2 border-foreground rounded-none font-pixel-body"
									/>
									{field.state.meta.errors ? (
										<em className="text-destructive text-[10px] font-pixel-body">
											{field.state.meta.errors.join(", ")}
										</em>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field name="confirmPassword">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-pixel text-xs">
										Confirmar Senha
									</Label>
									<Input
										id={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="••••••••"
										className="border-2 border-foreground rounded-none font-pixel-body"
									/>
									{field.state.meta.errors ? (
										<em className="text-destructive text-[10px] font-pixel-body">
											{field.state.meta.errors.join(", ")}
										</em>
									) : null}
								</div>
							)}
						</form.Field>

						<div className="pt-4">
							<PixelButton
								type="submit"
								className="w-full"
								isLoading={loading}
								disabled={loading}
							>
								REGISTRAR
							</PixelButton>
						</div>
					</form>

					<div className="text-center font-pixel-body text-sm pt-2">
						Já tem uma conta?{" "}
						<Link
							to="/auth/login"
							className="text-primary hover:underline underline-offset-4"
						>
							Fazer Login
						</Link>
					</div>
				</div>
			</PixelCard>
		</div>
	);
}
