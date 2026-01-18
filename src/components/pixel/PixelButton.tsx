import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PixelButtonProps extends HTMLMotionProps<"button"> {
	variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

export function PixelButton({
	className,
	variant = "primary",
	size = "md",
	isLoading,
	children,
	...props
}: PixelButtonProps) {
	const variants = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive:
			"bg-destructive text-destructive-foreground hover:bg-destructive/90",
		ghost: "bg-transparent hover:bg-muted text-foreground",
		outline:
			"bg-transparent border-2 border-foreground hover:bg-muted text-foreground",
	};

	const sizes = {
		sm: "h-11 md:h-9 px-3 md:px-4 text-xs md:text-xs 4xl:h-12 4xl:text-sm",
		md: "h-12 md:h-10 px-4 md:px-5 text-sm md:text-sm 4xl:h-14 4xl:px-6 4xl:text-base",
		lg: "h-14 md:h-12 px-6 md:px-7 text-base md:text-base 4xl:h-16 4xl:px-10 4xl:text-lg",
	};

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ ease: "linear", duration: 0.1 }}
			className={cn(
				"relative inline-flex items-center justify-center font-pixel border-2 border-foreground select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
				"shadow-[4px_4px_0px_0px_var(--foreground)] active:shadow-none active:translate-x-1 active:translate-y-1",
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		>
			{isLoading ? <span className="mr-2 animate-spin">⌛</span> : null}
			{children as React.ReactNode}
		</motion.button>
	);
}
