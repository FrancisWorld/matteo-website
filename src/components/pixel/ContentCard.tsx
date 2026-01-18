import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { PixelCard } from "./PixelCard";

export interface ContentCardProps {
	title: string;
	type: "video" | "blog" | "quiz";
	thumbnail?: string;
	subtitle?: string;
	metadata?: { label: string; value: string }[];
	href: string;
	isMostViewed?: boolean;
	isRecent?: boolean;
	className?: string;
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
	className,
}: ContentCardProps) {
	return (
		<Link to={href} className="block group h-full cursor-pointer">
			<PixelCard
				hoverEffect
				className={cn(
					"h-full p-0 overflow-hidden flex flex-col relative",
					isMostViewed && "enchanted",
					isRecent && "gold-glow",
					className,
				)}
			>
				{thumbnail && (
					<div className="aspect-video bg-muted relative border-b-2 md:border-b-3 4xl:border-b-4 border-foreground overflow-hidden">
						<img
							src={thumbnail}
							alt={title}
							srcSet={`${thumbnail} 400w`}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

						<div className="absolute top-2 md:top-3 4xl:top-4 right-2 md:right-3 4xl:right-4 px-2 md:px-3 4xl:px-4 py-1 bg-black/80 text-white text-[10px] md:text-xs 4xl:text-sm font-pixel border border-white/20">
							{type.toUpperCase()}
						</div>
					</div>
				)}

				<div className="p-3 md:p-4 3xl:p-5 4xl:p-6 flex-1 flex flex-col gap-2">
					<h3 className="font-pixel text-base md:text-lg 3xl:text-xl 4xl:text-2xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
						{title}
					</h3>

					{subtitle && (
						<p className="text-muted-foreground line-clamp-2 font-body text-xs md:text-sm 3xl:text-base 4xl:text-lg">
							{subtitle}
						</p>
					)}

					<div className="mt-auto pt-3 md:pt-4 flex justify-between items-center gap-2 text-[8px] md:text-xs 3xl:text-sm 4xl:text-base text-muted-foreground font-pixel border-t border-white/10">
						{metadata?.map((meta) => (
							<span key={meta.label} className="whitespace-nowrap">
								{meta.value} {meta.label}
							</span>
						))}
					</div>
				</div>
			</PixelCard>
		</Link>
	);
}
