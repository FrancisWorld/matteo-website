import { Loader2 } from "lucide-react";
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
		ghost: "bg-transparent hover:bg-muted text-foreground border-transparent",
		outline:
			"bg-transparent border-2 border-foreground hover:bg-muted text-foreground",
	};

	const sizes = {
		sm: "h-8 px-3 text-xs",
		md: "h-10 px-4 text-sm",
		lg: "h-12 px-8 text-base",
	};

	// Determine shadow colors based on variant
	const getShadowVars = () => {
		switch (variant) {
			case "primary":
				return {
					"--shadow-right": "#2f7543",
					"--shadow-bottom": "#1a4d23",
				} as React.CSSProperties;
			case "secondary":
				return {
					"--shadow-right": "#555555",
					"--shadow-bottom": "#333333",
				} as React.CSSProperties;
			case "destructive":
				return {
					"--shadow-right": "#aa0000",
					"--shadow-bottom": "#880000",
				} as React.CSSProperties;
			default:
				return {} as React.CSSProperties;
		}
	};

	const is3D = ["primary", "secondary", "destructive"].includes(variant);

	return (
		<motion.button
			whileHover={{ scale: 1.02, y: -2 }}
			whileTap={{ scale: 0.98, y: 2 }}
			transition={{ type: "tween", duration: 0.1, ease: "linear" }}
			style={getShadowVars()}
			className={cn(
				"relative inline-flex items-center justify-center font-pixel border-2 border-foreground select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer pixel-text-shadow",
				is3D
					? "pixel-shadow-3d active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
					: "",
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		>
			{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
			{children as React.ReactNode}
		</motion.button>
	);
}
