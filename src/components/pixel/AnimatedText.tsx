import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface AnimatedTextProps {
	text: string;
	className?: string;
	as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
	animation?: "typewriter" | "glitch" | "wave" | "fade" | "pixelate";
	delay?: number;
	once?: boolean;
}

export function AnimatedText({
	text,
	className = "",
	as: Tag = "span",
	animation = "fade",
	delay = 0,
	once = true,
}: AnimatedTextProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once, margin: "-50px" });

	const letters = text.split("");

	if (animation === "typewriter") {
		return (
			<Tag ref={ref} className={`inline-block ${className}`}>
				{letters.map((letter, i) => (
					<motion.span
						key={`${letter}-${i}`}
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : {}}
						transition={{
							duration: 0.01,
							delay: delay + i * 0.05,
						}}
						className="inline-block"
					>
						{letter === " " ? "\u00A0" : letter}
					</motion.span>
				))}
				<motion.span
					className="inline-block w-[0.5em] h-[1em] bg-primary ml-1"
					animate={{ opacity: [1, 0] }}
					transition={{
						duration: 0.5,
						repeat: Number.POSITIVE_INFINITY,
					}}
				/>
			</Tag>
		);
	}

	if (animation === "glitch") {
		return (
			<Tag ref={ref} className={`relative inline-block ${className}`}>
				<motion.span
					className="relative z-10"
					initial={{ opacity: 0 }}
					animate={
						isInView
							? {
									opacity: 1,
									x: [0, -2, 2, -1, 1, 0],
									textShadow: [
										"0 0 0 transparent",
										"2px 0 #ff0000, -2px 0 #00ffff",
										"-2px 0 #ff0000, 2px 0 #00ffff",
										"1px 0 #ff0000, -1px 0 #00ffff",
										"0 0 0 transparent",
									],
								}
							: {}
					}
					transition={{
						delay,
						duration: 0.3,
						times: [0, 0.2, 0.4, 0.6, 0.8, 1],
					}}
				>
					{text}
				</motion.span>
			</Tag>
		);
	}

	if (animation === "wave") {
		return (
			<Tag ref={ref} className={`inline-block ${className}`}>
				{letters.map((letter, i) => (
					<motion.span
						key={`${letter}-${i}`}
						initial={{ y: 0 }}
						animate={
							isInView
								? {
										y: [0, -8, 0],
									}
								: {}
						}
						transition={{
							delay: delay + i * 0.05,
							duration: 0.4,
							ease: "easeInOut",
						}}
						className="inline-block"
					>
						{letter === " " ? "\u00A0" : letter}
					</motion.span>
				))}
			</Tag>
		);
	}

	if (animation === "pixelate") {
		return (
			<Tag ref={ref} className={`relative inline-block ${className}`}>
				<motion.span
					initial={{ opacity: 0, filter: "blur(8px)" }}
					animate={
						isInView
							? {
									opacity: 1,
									filter: "blur(0px)",
								}
							: {}
					}
					transition={{
						delay,
						duration: 0.5,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
				>
					{text}
				</motion.span>
			</Tag>
		);
	}

	return (
		<Tag ref={ref} className={`inline-block ${className}`}>
			{letters.map((letter, i) => (
				<motion.span
					key={`${letter}-${i}`}
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{
						delay: delay + i * 0.03,
						duration: 0.3,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
					className="inline-block"
				>
					{letter === " " ? "\u00A0" : letter}
				</motion.span>
			))}
		</Tag>
	);
}

interface PageTitleProps {
	children: string;
	className?: string;
	subtitle?: string;
}

export function PageTitle({
	children,
	className = "",
	subtitle,
}: PageTitleProps) {
	return (
		<div className="space-y-2 mb-8">
			<motion.h1
				className={`text-4xl md:text-5xl font-pixel text-white pixel-text-shadow-lg ${className}`}
				initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
				animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
				transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
			>
				{children}
			</motion.h1>
			{subtitle && (
				<motion.p
					className="text-lg text-muted-foreground font-body"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						delay: 0.1,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
				>
					{subtitle}
				</motion.p>
			)}
			<motion.div
				className="h-1 bg-primary"
				initial={{ scaleX: 0, originX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{
					duration: 0.6,
					delay: 0.2,
					ease: [0.25, 0.46, 0.45, 0.94],
				}}
				style={{ width: "8rem" }}
			/>
		</div>
	);
}
