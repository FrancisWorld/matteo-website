import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface HamburgerIconProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

export function HamburgerIcon({
  isOpen,
  onClick,
  className,
}: HamburgerIconProps) {
  const topVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 },
  };

  const middleVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const bottomVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 },
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center w-12 h-12 md:w-10 md:h-10 4xl:w-16 4xl:h-16 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 md:w-5 md:h-5 4xl:w-8 4xl:h-8"
      >
        <motion.line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          variants={topVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          variants={middleVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        <motion.line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          variants={bottomVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.button>
  );
}
