import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PixelCardProps extends HTMLMotionProps<"div"> {
	hoverEffect?: boolean;
}

export function PixelCard({
	className,
	children,
	hoverEffect = false,
	...props
}: PixelCardProps) {
	return (
		<motion.div
			whileHover={hoverEffect ? { y: -4 } : undefined}
			transition={{ type: "tween", duration: 0.15, ease: "linear" }}
			style={
				{
					"--shadow-right": "#000000",
					"--shadow-bottom": "#000000",
				} as React.CSSProperties
			}
			className={cn(
				"relative bg-card text-card-foreground border-2 border-foreground p-6 pixel-shadow-3d",
				className,
			)}
			{...props}
		>
			{/* Corner Accents */}
			<div className="absolute top-1 left-1 w-2 h-2 bg-primary pointer-events-none" />
			<div className="absolute top-1 right-1 w-2 h-2 bg-primary pointer-events-none" />
			<div className="absolute bottom-1 left-1 w-2 h-2 bg-primary pointer-events-none" />
			<div className="absolute bottom-1 right-1 w-2 h-2 bg-primary pointer-events-none" />

			{children as React.ReactNode}
		</motion.div>
	);
}
