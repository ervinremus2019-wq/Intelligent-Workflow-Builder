import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, RefreshCw, AlertTriangle, CheckCircle2, Server, Activity, Zap,
  Bluetooth, Wifi, Database, Smartphone, Cloud, Lock, Music, Eye, Home,
  Users, LayoutGrid, Cpu, Terminal
} from "lucide-react";
import { useServices, useResetServices } from "@/hooks/use-services";
import { StatusBadge } from "@/components/StatusBadge";
import { CyberCard } from "@/components/CyberCard";
import { cn } from "@/lib/utils";
import type { SystemService } from "@shared/schema";

// Map strings to icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Server, Activity, Zap, Bluetooth, Wifi, Database, Smartphone, 
  Cloud, Lock, Music, Eye, Home, Users, LayoutGrid, Cpu, Shield, Terminal
};

type Status = "stable" | "warning" | "critical" | "recovering" | "scanning";

export default function SystemRecovery() {
  const { data: initialServices, isLoading, error } = useServices();
  const resetMutation = useResetServices();
  
  // Local state for the simulation visuals
  const [services, setServices] = useState<SystemService[]>([]);
  const [recovering, setRecovering] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);

  // Initialize local state when data loads
  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
    }
  }, [initialServices]);

  const handleRecoverAll = () => {
    setRecovering(true);
    setRecoveryProgress(0);
    
    // 1. Set all non-stable items to 'scanning'
    const scanningState = services.map(s => 
      s.status !== 'stable' ? { ...s, status: 'scanning' as Status } : s
    );
    setServices(scanningState);

    // 2. Simulate progressive recovery
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setRecoveryProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finalizeRecovery();
        }, 500);
      }
    }, 100);

    // Randomly switch items to 'recovering' during scan
    const recoveryInterval = setInterval(() => {
      setServices(prev => prev.map(s => {
        if (s.status === 'scanning' && Math.random() > 0.7) {
          return { ...s, status: 'recovering' as Status };
        }
        return s;
      }));
    }, 300);

    // Cleanup random flipper when progress done
    setTimeout(() => clearInterval(recoveryInterval), 2000);
  };

  const finalizeRecovery = () => {
    // 3. Mark all as stable
    const allStable = services.map(s => ({ ...s, status: 'stable' as Status }));
    setServices(allStable);
    setRecovering(false);
    
    // Here you could call an API to persist the "repaired" state if needed
    // For now we just reset visual state after a delay or let user bask in green
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: (data) => {
        setServices(data);
        setRecoveryProgress(0);
        setRecovering(false);
      }
    });
  };

  // Derived stats
  const criticalCount = services.filter(s => s.status === 'critical').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const stableCount = services.filter(s => s.status === 'stable').length;
  const totalCount = services.length;
  const systemHealth = totalCount > 0 ? Math.round((stableCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="text-primary animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 animate-spin" />
          <span className="text-xl tracking-widest">INITIALIZING DIAGNOSTICS...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-destructive">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl">SYSTEM CRITICAL FAILURE</h2>
          <p>Unable to connect to diagnostics kernel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden font-mono selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border/50 pb-6 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-transparent">
                SYSTEM_RECOVERY_PROTOCOL
              </h1>
            </div>
            <p className="text-muted-foreground tracking-wide text-sm md:text-base">
              DIAGNOSTIC KERNEL V.9.0.2 // <span className="text-primary animate-pulse">ACTIVE</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">System Integrity</div>
                <div className={cn(
                  "text-3xl font-bold tabular-nums",
                  systemHealth < 50 ? "text-destructive" : systemHealth < 80 ? "text-accent" : "text-primary"
                )}>
                  {systemHealth}%
                </div>
             </div>
             <div className="h-12 w-[1px] bg-border/50 hidden md:block" />
             <div className="text-right hidden md:block">
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Active Threads</div>
                <div className="text-3xl font-bold tabular-nums text-foreground">{totalCount}</div>
             </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 border border-border/40 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex gap-4 w-full sm:w-auto text-sm">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold">{criticalCount}</span> Critical
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Activity className="w-4 h-4" />
              <span className="font-bold">{warningCount}</span> Warning
            </div>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold">{stableCount}</span> Stable
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={handleReset}
              disabled={recovering || resetMutation.isPending}
              className="flex-1 sm:flex-none px-6 py-2 border border-border hover:bg-border/30 text-muted-foreground hover:text-foreground text-sm font-semibold tracking-wider transition-all disabled:opacity-50"
            >
              RESET_SIM
            </button>
            <button
              onClick={handleRecoverAll}
              disabled={recovering || (criticalCount === 0 && warningCount === 0)}
              className="flex-1 sm:flex-none px-8 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 hover:border-primary hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] text-sm font-bold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {recovering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  RECOVERING...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 group-hover:fill-current" />
                  INITIATE_REPAIR
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (Only visible during recovery) */}
        <AnimatePresence>
          {recovering && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card/40 border border-primary/20 p-4 rounded-lg relative overflow-hidden">
                <div className="flex justify-between text-xs uppercase tracking-widest text-primary mb-2">
                  <span>System Scan & Repair Sequence</span>
                  <span>{recoveryProgress}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${recoveryProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                {/* Matrix rain effect simplified */}
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-[0.03] pointer-events-none mix-blend-screen" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {services.map((service, idx) => {
              const IconComponent = iconMap[service.icon] || Cpu;
              
              return (
                <CyberCard key={service.id} delay={idx * 0.05} className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "p-2.5 rounded-lg border border-white/5 backdrop-blur-sm shadow-inner transition-colors duration-500",
                      service.status === 'stable' ? "bg-primary/10 text-primary" :
                      service.status === 'critical' ? "bg-destructive/10 text-destructive animate-pulse" :
                      service.status === 'warning' ? "bg-accent/10 text-accent" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <StatusBadge status={service.status as Status} />
                  </div>

                  <div className="mt-auto space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-display tracking-wide truncate">{service.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-border inline-block" />
                        ID: {service.id.toString().padStart(4, '0')}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-border/30 pt-3">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase">Allocated</span>
                        <span className="text-foreground">{service.size}</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-muted-foreground block text-[10px] uppercase">Latency</span>
                        <span className={cn(
                          service.status === 'stable' ? "text-primary" : "text-muted-foreground"
                        )}>
                          {service.status === 'stable' ? '< 1ms' : service.status === 'scanning' ? '...' : service.status === 'recovering' ? 'SYNC' : 'TIMEOUT'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlight bar for scanning effect */}
                  {service.status === 'scanning' && (
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </CyberCard>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
