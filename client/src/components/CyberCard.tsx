import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function CyberCard({ children, className, delay = 0 }: CyberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "relative bg-card/40 backdrop-blur-md border border-border/50 p-6 rounded-lg overflow-hidden group hover:border-primary/50 transition-colors duration-300",
        className
      )}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors" />
      
      {/* Scanline overlay opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-y-[-100%] group-hover:translate-y-[100%] transition-transform" />

      {children}
    </motion.div>
  );
}
