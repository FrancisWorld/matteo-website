import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
	children: ReactNode;
	className?: string;
	withContainer?: boolean;
	withPadding?: boolean;
}

const pageVariants = {
	initial: {
		opacity: 0,
		y: 20,
		filter: "blur(10px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			duration: 0.4,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
			staggerChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		filter: "blur(10px)",
		transition: {
			duration: 0.3,
		},
	},
};

export function PageWrapper({
	children,
	className = "",
	withContainer = true,
	withPadding = true,
}: PageWrapperProps) {
	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className={cn(
				"min-h-[calc(100vh-5rem)]",
				withContainer &&
					"container mx-auto w-full max-w-screen-xl 3xl:max-w-[1920px] 4xl:max-w-[2560px] 4xl:mx-auto",
				withPadding &&
					"px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16 py-8 md:py-12 3xl:py-16 4xl:py-24 spacing-section",
				className,
			)}
		>
			{children}
		</motion.div>
	);
}

export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
};

export const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

export const fadeInScale = {
	initial: { opacity: 0, scale: 0.9 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

export const slideInLeft = {
	initial: { opacity: 0, x: -50 },
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

export const slideInRight = {
	initial: { opacity: 0, x: 50 },
	animate: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};
