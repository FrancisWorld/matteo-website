import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "w-full max-w-screen-xl 3xl:max-w-[1920px] 4xl:max-w-[2560px] 4xl:mx-auto",
        "px-4 md:px-6 lg:px-8 3xl:px-12 4xl:px-16",
        "py-8 md:py-12 3xl:py-16 4xl:py-24",
        "mx-auto spacing-section",
        className,
      )}
    >
      {children}
    </div>
  );
}
