import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface ChevronRightProps extends Omit<HTMLMotionProps<"span">, "children"> {
  size?: number;
  animated?: boolean;
}

export function ChevronRight({
  size = 24,
  animated = true,
  className,
  ...props
}: ChevronRightProps) {
  return (
    <motion.span
      whileHover={animated ? { x: 2 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center",
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
          animate: { x: [2, 0, 2] },
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <polyline points="9 18 15 12 9 6" />
      </motion.svg>
    </motion.span>
  );
}
