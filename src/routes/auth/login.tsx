import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
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
					callbackURL: "/",
				});

				if (result.error) {
					setError(result.error.message || "E-mail ou senha incorretos");
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
							Login
						</h1>
						<p className="font-pixel-body text-muted-foreground text-center">
							Bem-vindo de volta, aventureiro!
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

						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label htmlFor={field.name} className="font-pixel text-xs">
											Senha
										</Label>
										<Link
											to="/"
											className="text-[10px] font-pixel-body text-primary hover:underline"
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
								ENTRAR
							</PixelButton>
						</div>
					</form>

					<div className="text-center font-pixel-body text-sm pt-2">
						Não tem uma conta?{" "}
						<Link
							to="/auth/register"
							className="text-primary hover:underline underline-offset-4"
						>
							Criar Conta
						</Link>
					</div>
				</div>
			</PixelCard>
		</div>
	);
}
