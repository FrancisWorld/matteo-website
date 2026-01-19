import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/auth/verify-otp")({
	validateSearch: z.object({
		email: z.string().optional(),
		type: z
			.enum(["email-verification", "sign-in", "forget-password"])
			.optional(),
	}),
	component: VerifyOTPPage,
});

function VerifyOTPPage() {
	const { email } = Route.useSearch();
	const navigate = useNavigate();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [resent, setResent] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").slice(0, 6);
		if (!/^\d+$/.test(pastedData)) return;

		const newOtp = [...otp];
		for (let i = 0; i < pastedData.length; i++) {
			newOtp[i] = pastedData[i];
		}
		setOtp(newOtp);

		const nextIndex = Math.min(pastedData.length, 5);
		inputRefs.current[nextIndex]?.focus();
	};

	const handleVerify = async () => {
		if (!email) {
			setError("Email não encontrado");
			return;
		}

		const code = otp.join("");
		if (code.length !== 6) {
			setError("Digite o código completo");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await authClient.emailOtp.verifyEmail({
				email,
				otp: code,
			});

			if (result.error) {
				setError(result.error.message || "Código inválido");
			} else {
				navigate({ to: "/auth/login" });
			}
		} catch (err) {
			setError("Erro ao verificar código");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!email || resending) return;

		setResending(true);
		setError(null);

		try {
			await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});
			setResent(true);
			setTimeout(() => setResent(false), 5000);
		} catch (err) {
			setError("Erro ao reenviar código");
		} finally {
			setResending(false);
		}
	};

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

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="relative z-10 w-full max-w-md"
			>
				<PixelCard className="p-8 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#333]">
					<div className="space-y-6">
						<div className="text-center space-y-4">
							<motion.div
								className="w-16 h-16 mx-auto bg-primary/20 border-2 border-primary flex items-center justify-center"
								animate={{ rotate: [0, 5, -5, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
							>
								<KeyRound size={32} className="text-primary" />
							</motion.div>

							<div>
								<h1 className="text-xl font-pixel text-primary pixel-text-shadow tracking-wider">
									DIGITE O CÓDIGO
								</h1>
								<p className="font-body text-muted-foreground mt-2">
									Enviamos um código de 6 dígitos para:
								</p>
								{email && (
									<p className="font-body text-primary font-semibold mt-1 break-all">
										{email}
									</p>
								)}
							</div>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-destructive/10 border-2 border-destructive p-3 text-destructive font-body text-sm text-center"
							>
								{error}
							</motion.div>
						)}

						{resent && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-primary/20 border-2 border-primary p-3 text-primary font-body text-sm text-center"
							>
								Código reenviado!
							</motion.div>
						)}

						<div className="flex justify-center gap-2">
							{otp.map((digit, index) => {
								const inputId = `otp-input-${index}`;
								return (
									<input
										key={inputId}
										id={inputId}
										ref={(el) => {
											inputRefs.current[index] = el;
										}}
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										onPaste={handlePaste}
										className="w-12 h-14 text-center text-2xl font-pixel bg-[#0a0a0a] border-2 border-[#333] focus:border-primary outline-none transition-colors text-white"
									/>
								);
							})}
						</div>

						<div className="space-y-3 pt-4">
							<PixelButton
								className="w-full h-12"
								onClick={handleVerify}
								isLoading={loading}
								disabled={loading || otp.join("").length !== 6}
							>
								VERIFICAR
							</PixelButton>

							{email && (
								<PixelButton
									variant="secondary"
									className="w-full h-10"
									onClick={handleResend}
									disabled={resending || resent}
									isLoading={resending}
								>
									<RefreshCw size={14} className="mr-2" />
									{resent ? "ENVIADO!" : "REENVIAR CÓDIGO"}
								</PixelButton>
							)}

							<Link to="/auth/login" className="block">
								<PixelButton variant="ghost" className="w-full h-10">
									VOLTAR
								</PixelButton>
							</Link>
						</div>

						<p className="font-body text-xs text-muted-foreground text-center pt-4 border-t border-[#333]">
							O código expira em 10 minutos
						</p>
					</div>
				</PixelCard>
			</motion.div>
		</div>
	);
}
