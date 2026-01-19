import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as skinview3d from "skinview3d";
import { PixelButton } from "./PixelButton";

interface MinecraftSkinViewerProps {
	username?: string;
	skinUrl?: string;
	width?: number;
	height?: number;
	className?: string;
}

export function MinecraftSkinViewer({
	username,
	skinUrl,
	width = 300,
	height = 400,
	className,
}: MinecraftSkinViewerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const viewerRef = useRef<skinview3d.SkinViewer | null>(null);
	const [isPlaying, setIsPlaying] = useState(true);

	const finalSkinUrl = skinUrl
		? skinUrl
		: username
			? `https://minotar.net/skin/${encodeURIComponent(username)}`
			: "/steve-skin.png";

	useEffect(() => {
		if (!canvasRef.current) return;

		const viewer = new skinview3d.SkinViewer({
			canvas: canvasRef.current,
			width,
			height,
			skin: finalSkinUrl,
		});

		viewer.camera.position.x = 20;
		viewer.animation = new skinview3d.WalkingAnimation();
		viewer.animation.speed = 0.5;

		viewerRef.current = viewer;

		return () => {
			viewer.dispose();
		};
	}, [width, height, finalSkinUrl]);

	const toggleAnimation = () => {
		const viewer = viewerRef.current;
		if (!viewer) return;

		if (isPlaying) {
			viewer.animation = null;
		} else {
			const animation = new skinview3d.WalkingAnimation();
			animation.speed = 0.5;
			viewer.animation = animation;
		}
		setIsPlaying(!isPlaying);
	};

	const resetRotation = () => {
		const viewer = viewerRef.current;
		if (!viewer) return;

		viewer.playerObject.rotation.y = 0;
		setIsPlaying(false);
		viewer.animation = null;
	};

	return (
		<div className={`relative group ${className}`}>
			<div className="border-4 border-[#333] bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
				<div
					className="absolute inset-0 opacity-10 pointer-events-none"
					style={{
						backgroundImage:
							"linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
						backgroundSize: "20px 20px",
					}}
				/>

				<canvas ref={canvasRef} />

				<div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<PixelButton
						size="sm"
						variant="secondary"
						className="h-8 w-8 p-0"
						onClick={toggleAnimation}
					>
						{isPlaying ? <Pause size={14} /> : <Play size={14} />}
					</PixelButton>

					<PixelButton
						size="sm"
						variant="secondary"
						className="h-8 w-8 p-0"
						onClick={resetRotation}
					>
						<RotateCcw size={14} />
					</PixelButton>
				</div>
			</div>

			{username && !skinUrl && (
				<div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[10px] font-pixel text-white border border-white/20">
					{username}
				</div>
			)}
		</div>
	);
}
