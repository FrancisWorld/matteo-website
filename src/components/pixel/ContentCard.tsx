import { Link } from "@tanstack/react-router";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelCard } from "./PixelCard";

export interface ContentCardProps {
	title: string;
	type: "video" | "blog" | "quiz";
	thumbnail?: string;
	subtitle?: string;
	metadata?: { label: string; value: string; icon?: React.ReactNode }[];
	href: string;
	isMostViewed?: boolean;
	isRecent?: boolean;
	isShort?: boolean;
	className?: string;
	orientation?: "vertical" | "horizontal";
}

export function ContentCard({
	title,
	type,
	thumbnail,
	subtitle,
	metadata,
	href,
	isMostViewed,
	isRecent,
	isShort,
	className,
	orientation = "vertical",
}: ContentCardProps) {
	return (
		<Link to={href} className="block group h-full cursor-pointer">
			<PixelCard
				hoverEffect
				className={cn(
					"h-full p-0 overflow-hidden flex relative",
					orientation === "vertical" ? "flex-col" : "flex-row h-24 md:h-28",
					isMostViewed && "enchanted ring-2 ring-purple-500",
					isRecent && "gold-glow ring-2 ring-[#FFD700]",
					className,
				)}
			>
				{isRecent && (
					<div className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black text-[9px] md:text-[10px] font-pixel px-1.5 py-0.5 md:px-2 md:py-1 border-b-2 border-r-2 border-black shadow-[1px_1px_0_rgba(0,0,0,0.5)] animate-bounce">
						NOVO
					</div>
				)}
				{isMostViewed && (
					<div className="absolute top-0 right-0 z-20 bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-[9px] md:text-[10px] font-pixel px-1.5 py-0.5 md:px-2 md:py-1 border-b-2 border-l-2 border-black shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
						POPULAR
					</div>
				)}
				{thumbnail && (
					<div
						className={cn(
							"bg-muted relative border-foreground overflow-hidden flex-shrink-0",
							orientation === "vertical"
								? isShort
									? "aspect-[9/16] border-b-2 md:border-b-4"
									: "aspect-video border-b-2 md:border-b-4"
								: isShort
									? "w-16 md:w-20 border-r-2"
									: "w-32 md:w-40 border-r-2",
						)}
					>
						<img
							src={thumbnail}
							alt={title}
							srcSet={`${thumbnail} 400w`}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

						{orientation === "vertical" && (
							<div className="absolute top-2 md:top-3 right-2 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/80 text-white text-[9px] md:text-[10px] font-pixel border border-white/20 z-10">
								{isShort ? "SHORT" : type.toUpperCase()}
							</div>
						)}
						{orientation === "horizontal" && isShort && (
							<div className="absolute top-1 right-1 bg-black/80 text-[8px] text-white px-1 border border-white/20 z-10">
								⚡
							</div>
						)}
					</div>
				)}

				<div
					className={cn(
						"flex-1 flex flex-col",
						orientation === "vertical"
							? "p-3 md:p-4 gap-2 md:gap-3"
							: "p-2 md:p-3 gap-1 md:gap-2 justify-center",
					)}
				>
					<h3
						className={cn(
							"font-pixel leading-tight group-hover:text-primary transition-colors line-clamp-2",
							orientation === "vertical"
								? isShort
									? "text-xs md:text-sm"
									: "text-sm md:text-base lg:text-lg"
								: "text-xs md:text-sm",
						)}
					>
						{title}
					</h3>

					{subtitle && (
						<p className="text-muted-foreground line-clamp-2 font-body text-xs md:text-sm">
							{subtitle}
						</p>
					)}

					<div
						className={cn(
							"flex items-center gap-2 text-[9px] md:text-[10px] text-muted-foreground font-pixel",
							orientation === "vertical"
								? "mt-auto pt-2 md:pt-3 justify-between border-t border-white/10"
								: "mt-auto",
						)}
					>
						{metadata?.map((meta) => (
							<span
								key={meta.label}
								className="whitespace-nowrap flex items-center gap-1"
							>
								{meta.icon} {meta.value} {meta.label}
							</span>
						))}
					</div>
				</div>
			</PixelCard>
		</Link>
	);
}
