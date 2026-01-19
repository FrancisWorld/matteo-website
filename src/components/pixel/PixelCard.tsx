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
			whileHover={hoverEffect ? { y: -2 } : undefined}
			transition={{ type: "tween", duration: 0.15, ease: "linear" }}
			style={
				{
					"--shadow-right": "#000000",
					"--shadow-bottom": "#000000",
				} as React.CSSProperties
			}
			className={cn(
				"bg-card text-card-foreground border-2 border-foreground relative",
				"p-4 shadow-[3px_3px_0px_0px_var(--foreground)]",
				className,
			)}
			{...props}
		>
			{/* Unified corner accents - smaller and proportional */}
			<div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-primary pointer-events-none z-0" />
			<div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary pointer-events-none z-0" />
			<div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-primary pointer-events-none z-0" />
			<div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-primary pointer-events-none z-0" />

			{children as React.ReactNode}
		</motion.div>
	);
}
