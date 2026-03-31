import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, RefreshCw, Activity, Search } from "lucide-react";

type StatusValue = "stable" | "warning" | "critical" | "recovering" | "scanning";

interface StatusBadgeProps {
  status: StatusValue | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    stable: {
      icon: CheckCircle2,
      label: "STABLE",
      color: "text-[hsl(var(--status-stable))]",
      bg: "bg-[hsl(var(--status-stable))]/10",
      border: "border-[hsl(var(--status-stable))]/30",
    },
    warning: {
      icon: AlertTriangle,
      label: "WARNING",
      color: "text-[hsl(var(--status-warning))]",
      bg: "bg-[hsl(var(--status-warning))]/10",
      border: "border-[hsl(var(--status-warning))]/30",
    },
    critical: {
      icon: AlertTriangle,
      label: "CRITICAL",
      color: "text-[hsl(var(--status-critical))]",
      bg: "bg-[hsl(var(--status-critical))]/10",
      border: "border-[hsl(var(--status-critical))]/30",
    },
    recovering: {
      icon: RefreshCw,
      label: "RECOVERING",
      color: "text-[hsl(var(--status-recovering))]",
      bg: "bg-[hsl(var(--status-recovering))]/10",
      border: "border-[hsl(var(--status-recovering))]/30",
    },
    scanning: {
      icon: Search,
      label: "SCANNING",
      color: "text-[hsl(var(--status-scanning))]",
      bg: "bg-[hsl(var(--status-scanning))]/10",
      border: "border-[hsl(var(--status-scanning))]/30",
    },
  };

  const current = config[status as StatusValue] || config.stable;
  const Icon = current.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-sm border font-mono text-xs tracking-wider uppercase backdrop-blur-sm",
      current.color,
      current.bg,
      current.border,
      className
    )}>
      <Icon className={cn("w-3.5 h-3.5", status === "recovering" && "animate-spin")} />
      <span>{current.label}</span>
    </div>
  );
}
