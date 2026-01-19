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
			transition={{ ease: "linear", duration: 0.1 }}
			className={cn(
				"bg-card text-card-foreground border-2 border-foreground p-4 md:p-6 3xl:p-8 4xl:p-12",
				"shadow-[4px_4px_0px_0px_var(--foreground)] md:shadow-[6px_6px_0px_0px_var(--foreground)] 4xl:shadow-[8px_8px_0px_0px_var(--foreground)]",
				"relative",
				className,
			)}
			{...props}
		>
			{/* Corner accents */}
			<div className="absolute top-2 left-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
			<div className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
			<div className="absolute bottom-2 left-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
			<div className="absolute bottom-2 right-2 w-2 h-2 md:w-3 md:h-3 4xl:w-4 4xl:h-4 bg-primary pointer-events-none z-0" />
			{children as React.ReactNode}
		</motion.div>
	);
}
