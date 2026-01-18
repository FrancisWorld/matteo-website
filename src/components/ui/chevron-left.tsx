import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface ChevronLeftProps extends HTMLMotionProps<"button"> {
  size?: number;
  animated?: boolean;
}

export function ChevronLeft({
  size = 24,
  animated = true,
  className,
  ...props
}: ChevronLeftProps) {
  return (
    <motion.button
      whileHover={animated ? { x: -2 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animated ? "animate" : "normal"}
        variants={{
          normal: { x: 0 },
          animate: { x: [-2, 0, -2] },
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <polyline points="15 18 9 12 15 6" />
      </motion.svg>
    </motion.button>
  );
}
