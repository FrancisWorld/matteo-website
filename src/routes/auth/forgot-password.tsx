import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleSubmit = async () => {
		if (!email) return;
		setIsLoading(true);
		setMessage(null);

		try {
			await authClient.forgetPassword({
				email,
				redirectURL: `${window.location.origin}/auth/reset-password`,
			});
			setMessage({ type: "success", text: "Instruções enviadas para seu e-mail!" });
			setEmail("");
		} catch (error) {
			setMessage({
				type: "error",
				text: "Erro ao enviar instruções. Tente novamente.",
			});
		} finally {
			setIsLoading(false);
		}
	};

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

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 w-full max-w-md"
			>
				<PixelCard className="p-8 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#333]">
					<div className="space-y-6 text-center">
						<h1 className="text-2xl font-pixel text-primary">
							RECUPERAR SENHA
						</h1>
						<p className="text-muted-foreground font-body">
							Digite seu e-mail para receber as instruções de recuperação.
						</p>

						<div className="space-y-4 text-left">
							<div className="space-y-2">
								<Label className="font-pixel text-xs text-gray-300">
									E-MAIL
								</Label>
								<Input
									type="email"
									placeholder="seu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="h-12 border-2 border-[#333] bg-[#0a0a0a] rounded-none font-body text-lg focus:border-primary transition-colors"
									disabled={isLoading}
								/>
							</div>

							{message && (
								<div
									className={`p-3 font-body text-sm text-center rounded ${
										message.type === "success"
											? "bg-green-500/20 text-green-400 border border-green-500/50"
											: "bg-red-500/20 text-red-400 border border-red-500/50"
									}`}
								>
									{message.text}
								</div>
							)}

							<PixelButton
								onClick={handleSubmit}
								disabled={isLoading || !email}
								isLoading={isLoading}
								className="w-full h-12"
							>
								ENVIAR INSTRUÇÕES
							</PixelButton>
						</div>

						<div className="pt-4 border-t border-[#333]">
							<Link
								to="/auth/login"
								className="text-sm font-body text-primary hover:underline underline-offset-4"
							>
								Voltar para Login
							</Link>
						</div>
					</div>
				</PixelCard>
			</motion.div>
		</div>
	);
}
