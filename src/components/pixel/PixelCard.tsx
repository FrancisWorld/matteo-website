import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PixelCardProps extends HTMLMotionProps<"div"> {
	hoverEffect?: boolean;
	variant?: "default" | "compact";
}

export function PixelCard({
	className,
	children,
	hoverEffect = false,
	variant = "default",
	...props
}: PixelCardProps) {
	const isCompact = variant === "compact";

	return (
		<motion.div
			whileHover={hoverEffect ? { y: isCompact ? -2 : -4 } : undefined}
			transition={{ type: "tween", duration: 0.15, ease: "linear" }}
			style={
				{
					"--shadow-right": "#000000",
					"--shadow-bottom": "#000000",
				} as React.CSSProperties
			}
			className={cn(
				"bg-card text-card-foreground border-2 border-foreground relative",
				isCompact
					? "p-2 shadow-[2px_2px_0px_0px_var(--foreground)]"
					: "p-4 md:p-6 3xl:p-8 4xl:p-12 shadow-[4px_4px_0px_0px_var(--foreground)] md:shadow-[6px_6px_0px_0px_var(--foreground)] 4xl:shadow-[8px_8px_0px_0px_var(--foreground)]",
				className,
			)}
			{...props}
		>
			{/* Corner accents - Only for default variant */}
			{!isCompact && (
				<>
					<div className="absolute top-2 left-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
					<div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
					<div className="absolute bottom-2 left-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
					<div className="absolute bottom-2 right-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
				</>
			)}

			{/* Tiny corners for compact variant */}
			{isCompact && (
				<>
					<div className="absolute top-1 left-1 w-1 h-1 bg-primary pointer-events-none z-0" />
					<div className="absolute top-1 right-1 w-1 h-1 bg-primary pointer-events-none z-0" />
					<div className="absolute bottom-1 left-1 w-1 h-1 bg-primary pointer-events-none z-0" />
					<div className="absolute bottom-1 right-1 w-1 h-1 bg-primary pointer-events-none z-0" />
				</>
			)}

			{children as React.ReactNode}
		</motion.div>
	);
}
