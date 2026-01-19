import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Camera, Save, User } from "lucide-react";
import { useRef, useState } from "react";
import { PageTitle } from "@/components/pixel/AnimatedText";
import { MinecraftSkinViewer } from "@/components/pixel/MinecraftSkinViewer";
import { PageWrapper } from "@/components/pixel/PageWrapper";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authQueryOptions } from "@/lib/auth-query";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/settings")({
	beforeLoad: async ({ context, location }) => {
		const sessionData =
			await context.queryClient.ensureQueryData(authQueryOptions);

		if (!sessionData?.user) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirect: location.href,
				},
			});
		}

		return { session: sessionData };
	},
	component: SettingsPage,
});

function SettingsPage() {
	const { session } = Route.useRouteContext() as { session: any };
	const user = session.user;
	const token = session.session.token;

	const generateUploadUrl = useMutation(api.users.generateUploadUrl);
	const updateAvatar = useMutation(api.users.updateAvatar);
	const updateMcUsername = useMutation(api.users.updateMinecraftUsername);

	const [isUploading, setIsUploading] = useState(false);
	const [mcUsername, setMcUsername] = useState(user.minecraftUsername || "");
	const [isSavingUsername, setIsSavingUsername] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			alert("A imagem deve ter no máximo 5MB");
			return;
		}

		setIsUploading(true);
		try {
			const postUrl = await generateUploadUrl({ token });

			const result = await fetch(postUrl, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			});

			if (!result.ok) throw new Error("Upload failed");

			const { storageId } = await result.json();

			await updateAvatar({ storageId, token });

			window.location.reload();
		} catch (error) {
			console.error(error);
			const errorMessage = error instanceof Error ? error.message : "Falha ao atualizar avatar";
			alert(errorMessage);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSaveUsername = async () => {
		if (!mcUsername) return;
		setIsSavingUsername(true);
		try {
			await updateMcUsername({ username: mcUsername, token });
			window.location.reload();
		} catch (error) {
			console.error(error);
			const errorMessage = error instanceof Error ? error.message : "Erro ao salvar username";
			alert(errorMessage);
		} finally {
			setIsSavingUsername(false);
		}
	};

	return (
		<PageWrapper>
			<PageTitle subtitle="Gerencie seu perfil e preferências">
				CONFIGURAÇÕES
			</PageTitle>

			<div className="grid md:grid-cols-[1fr_2fr] gap-8">
				<div className="space-y-4">
					<PixelCard className="p-4 bg-muted/20">
						<nav className="flex flex-col gap-2 font-pixel text-sm">
							<button
								type="button"
								className="text-left px-4 py-2 bg-primary/20 text-primary border-l-4 border-primary"
							>
								PERFIL
							</button>
							<button
								type="button"
								className="text-left px-4 py-2 text-muted-foreground hover:bg-muted/50 transition-colors"
							>
								CONTA
							</button>
							<button
								type="button"
								className="text-left px-4 py-2 text-muted-foreground hover:bg-muted/50 transition-colors"
							>
								NOTIFICAÇÕES
							</button>
						</nav>
					</PixelCard>
				</div>

				<div className="space-y-8">
					<PixelCard className="p-8">
						<h2 className="text-xl font-pixel mb-6 flex items-center gap-2">
							<User className="text-primary" />
							AVATAR & SKIN
						</h2>

						<div className="flex flex-col md:flex-row gap-8 items-start">
							<div className="relative group mx-auto md:mx-0">
								<MinecraftSkinViewer
									username={mcUsername || "Steve"}
									skinUrl={user.image || undefined}
									width={250}
									height={350}
								/>
								<div className="absolute top-2 right-2 flex flex-col gap-2">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="bg-black/60 p-2 text-white hover:bg-primary hover:text-black transition-colors border border-white/20"
										title="Upload Skin File"
									>
										<Camera size={16} />
									</button>
								</div>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/png"
									onChange={handleImageSelect}
								/>
							</div>

							<div className="flex-1 space-y-6 w-full">
								<div className="space-y-2">
									<h3 className="font-pixel text-lg">SUA SKIN 3D</h3>
									<p className="text-muted-foreground font-body text-sm">
										Você pode usar seu username do Minecraft Java para importar
										sua skin automaticamente, ou fazer upload de um arquivo de
										skin (.png).
									</p>
								</div>

								<div className="space-y-4 border-t border-[#333] pt-4">
									<div className="space-y-2">
										<Label className="font-pixel text-xs text-muted-foreground">
											MINECRAFT JAVA USERNAME
										</Label>
										<div className="flex gap-2">
											<Input
												value={mcUsername}
												onChange={(e) => setMcUsername(e.target.value)}
												placeholder="Ex: Notch"
												className="bg-muted/20 border-2 border-[#333] font-body flex-1"
											/>
											<PixelButton
												onClick={handleSaveUsername}
												isLoading={isSavingUsername}
												disabled={isSavingUsername || !mcUsername}
											>
												SALVAR
											</PixelButton>
										</div>
										<p className="text-[10px] text-muted-foreground font-body">
											Digite seu nick para carregar a skin da Mojang.
										</p>
									</div>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t border-[#333]" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-background px-2 text-muted-foreground font-pixel">
												OU
											</span>
										</div>
									</div>

									<div className="text-center">
										<PixelButton
											variant="secondary"
											onClick={() => fileInputRef.current?.click()}
											isLoading={isUploading}
											className="w-full"
										>
											<Camera size={16} className="mr-2" />
											UPLOAD ARQUIVO DE SKIN
										</PixelButton>
										<p className="text-[10px] text-muted-foreground font-body mt-2">
											Use um arquivo .png de skin (64x64 ou 64x32)
										</p>
									</div>
								</div>
							</div>
						</div>
					</PixelCard>

					<PixelCard className="p-8">
						<h2 className="text-xl font-pixel mb-6 flex items-center gap-2">
							<Save className="text-primary" />
							INFORMAÇÕES BÁSICAS
						</h2>

						<div className="grid gap-6">
							<div className="space-y-2">
								<Label className="font-pixel text-xs text-muted-foreground">
									NOME DE EXIBIÇÃO
								</Label>
								<Input
									value={user.name}
									disabled
									className="bg-muted/20 border-2 border-[#333] font-body"
								/>
							</div>

							<div className="space-y-2">
								<Label className="font-pixel text-xs text-muted-foreground">
									E-MAIL
								</Label>
								<Input
									value={user.email}
									disabled
									className="bg-muted/20 border-2 border-[#333] font-body"
								/>
							</div>
						</div>
					</PixelCard>
				</div>
			</div>
		</PageWrapper>
	);
}
