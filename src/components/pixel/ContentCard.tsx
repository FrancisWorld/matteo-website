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
		<Link to={href} className="block group h-full">
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
					<div className="aspect-video bg-muted relative border-b-2 border-foreground overflow-hidden">
						<img
							src={thumbnail}
							alt={title}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

						<div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-pixel border border-white/20">
							{type.toUpperCase()}
						</div>
					</div>
				)}

				<div className="p-4 flex-1 flex flex-col gap-2">
					<h3 className="font-pixel text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
						{title}
					</h3>

					{subtitle && (
						<p className="text-muted-foreground line-clamp-2 font-body text-sm">
							{subtitle}
						</p>
					)}

					<div className="mt-auto pt-4 flex justify-between items-center text-xs text-muted-foreground font-pixel border-t border-white/10">
						{metadata?.map((meta) => (
							<span key={meta.label}>
								{meta.value} {meta.label}
							</span>
						))}
					</div>
				</div>
			</PixelCard>
		</Link>
	);
}
