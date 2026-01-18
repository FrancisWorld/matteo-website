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
				"bg-card text-card-foreground border-2 border-foreground p-6",
				"shadow-[4px_4px_0px_0px_var(--foreground)]",
				className,
			)}
			{...props}
		>
			{children as React.ReactNode}
		</motion.div>
	);
}
