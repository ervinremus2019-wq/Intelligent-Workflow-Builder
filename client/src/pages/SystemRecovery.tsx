import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, RefreshCw, AlertTriangle, CheckCircle2, Server, Activity, Zap,
  Bluetooth, Wifi, Database, Smartphone, Cloud, Lock, Music, Eye, Home,
  Users, LayoutGrid, Cpu, Terminal, Pencil, Trash2, Plus, Settings, X,
} from "lucide-react";
import {
  useServices, useCreateService, useUpdateService,
  useDeleteService, useResetServices, useRecoverAll,
} from "@/hooks/use-services";
import { StatusBadge } from "@/components/StatusBadge";
import { CyberCard } from "@/components/CyberCard";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { SystemService, InsertSystemService } from "@shared/schema";

// ── Icon registry ──────────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<any>> = {
  Server, Activity, Zap, Bluetooth, Wifi, Database, Smartphone,
  Cloud, Lock, Music, Eye, Home, Users, LayoutGrid, Cpu,
  Shield, Terminal, CheckCircle2,
};

const ICON_OPTIONS = Object.keys(iconMap);
const STATUS_OPTIONS = ["stable", "warning", "critical", "recovering", "scanning"] as const;
type Status = typeof STATUS_OPTIONS[number];

// ── Service Modal (create / edit) ──────────────────────────────────────────
interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  service?: SystemService;
}

const EMPTY_FORM: InsertSystemService = {
  name: "", size: "", status: "stable", icon: "Server",
};

function ServiceModal({
  state, onClose, onCreate, onUpdate, isPending,
}: {
  state: ModalState;
  onClose: () => void;
  onCreate: (data: InsertSystemService) => void;
  onUpdate: (id: number, data: Partial<InsertSystemService>) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<InsertSystemService>(EMPTY_FORM);

  useEffect(() => {
    if (state.open) {
      setForm(state.service
        ? { name: state.service.name, size: state.service.size, status: state.service.status, icon: state.service.icon }
        : EMPTY_FORM
      );
    }
  }, [state.open, state.service]);

  const set = (field: keyof InsertSystemService, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.mode === "create") {
      onCreate(form);
    } else if (state.service) {
      onUpdate(state.service.id, form);
    }
  };

  const IconPreview = iconMap[form.icon] || Cpu;

  return (
    <Dialog open={state.open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="bg-background border border-primary/30 shadow-[0_0_40px_rgba(0,255,255,0.08)] font-mono max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary tracking-widest uppercase text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {state.mode === "create" ? "DEPLOY_NEW_SERVICE" : "CONFIGURE_SERVICE"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Service Name
            </label>
            <input
              data-testid="input-service-name"
              required
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Network Monitor"
              className="w-full bg-card/40 border border-border focus:border-primary outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Allocated Memory
            </label>
            <input
              data-testid="input-service-size"
              required
              value={form.size}
              onChange={e => set("size", e.target.value)}
              placeholder="e.g. 4.20 MB"
              className="w-full bg-card/40 border border-border focus:border-primary outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Initial Status
            </label>
            <div className="grid grid-cols-5 gap-1">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  data-testid={`status-option-${s}`}
                  onClick={() => set("status", s)}
                  className={cn(
                    "py-1.5 text-[9px] uppercase tracking-wider border transition-all",
                    form.status === s
                      ? s === "stable" ? "border-[hsl(var(--status-stable))] bg-[hsl(var(--status-stable))]/20 text-[hsl(var(--status-stable))]"
                        : s === "warning" ? "border-[hsl(var(--status-warning))] bg-[hsl(var(--status-warning))]/20 text-[hsl(var(--status-warning))]"
                        : s === "critical" ? "border-destructive bg-destructive/20 text-destructive"
                        : s === "recovering" ? "border-primary bg-primary/20 text-primary"
                        : "border-[hsl(var(--status-scanning))] bg-[hsl(var(--status-scanning))]/20 text-[hsl(var(--status-scanning))]"
                      : "border-border/50 text-muted-foreground hover:border-border"
                  )}
                >
                  {s.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Icon
              <span className="text-primary flex items-center gap-1">
                <IconPreview className="w-3 h-3" /> {form.icon}
              </span>
            </label>
            <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {ICON_OPTIONS.map(iconName => {
                const Ic = iconMap[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    data-testid={`icon-option-${iconName}`}
                    title={iconName}
                    onClick={() => set("icon", iconName)}
                    className={cn(
                      "p-2 border flex items-center justify-center transition-all",
                      form.icon === iconName
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <Ic className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-border text-muted-foreground hover:text-foreground hover:bg-border/30 text-xs tracking-widest uppercase transition-all"
            >
              ABORT
            </button>
            <button
              type="submit"
              data-testid="button-submit-service"
              disabled={isPending}
              className="px-6 py-2 bg-primary/10 border border-primary/50 hover:border-primary text-primary text-xs tracking-widest uppercase font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPending
                ? <><RefreshCw className="w-3 h-3 animate-spin" /> WRITING...</>
                : state.mode === "create"
                  ? <><Plus className="w-3 h-3" /> DEPLOY</>
                  : <><CheckCircle2 className="w-3 h-3" /> UPDATE</>
              }
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────
export default function SystemRecovery() {
  const { data: initialServices, isLoading, error } = useServices();
  const createService  = useCreateService();
  const updateService  = useUpdateService();
  const deleteService  = useDeleteService();
  const resetMutation  = useResetServices();
  const recoverAll     = useRecoverAll();

  const [services,        setServices]        = useState<SystemService[]>([]);
  const [recovering,      setRecovering]      = useState(false);
  const [recoveryProgress,setRecoveryProgress]= useState(0);
  const [manageMode,      setManageMode]      = useState(false);
  const [deleteTarget,    setDeleteTarget]    = useState<number | null>(null);
  const [modal,           setModal]           = useState<ModalState>({ open: false, mode: "create" });

  useEffect(() => {
    if (initialServices) setServices(initialServices);
  }, [initialServices]);

  // ── Recovery simulation ───────────────────────────────────────────────
  const handleRecoverAll = () => {
    setRecovering(true);
    setRecoveryProgress(0);
    setServices(prev => prev.map(s =>
      s.status !== "stable" ? { ...s, status: "scanning" as Status } : s
    ));

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setRecoveryProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => finalizeRecovery(), 500);
      }
    }, 100);

    const flipInterval = setInterval(() => {
      setServices(prev => prev.map(s =>
        s.status === "scanning" && Math.random() > 0.7
          ? { ...s, status: "recovering" as Status }
          : s
      ));
    }, 300);
    setTimeout(() => clearInterval(flipInterval), 2000);
  };

  const finalizeRecovery = () => {
    setServices(prev => prev.map(s => ({ ...s, status: "stable" as Status })));
    setRecovering(false);
    recoverAll.mutate();
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: data => {
        setServices(data);
        setRecoveryProgress(0);
        setRecovering(false);
      },
    });
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────
  const handleCreate = (data: InsertSystemService) => {
    createService.mutate(data, {
      onSuccess: newSvc => {
        setServices(prev => [...prev, newSvc]);
        setModal({ open: false, mode: "create" });
      },
    });
  };

  const handleUpdate = (id: number, data: Partial<InsertSystemService>) => {
    updateService.mutate({ id, ...data }, {
      onSuccess: updated => {
        setServices(prev => prev.map(s => s.id === id ? updated : s));
        setModal({ open: false, mode: "edit" });
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteService.mutate(id, {
      onSuccess: () => {
        setServices(prev => prev.filter(s => s.id !== id));
        setDeleteTarget(null);
      },
    });
  };

  const handleStatusCycle = (service: SystemService) => {
    const next = STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(service.status as Status) + 1) % STATUS_OPTIONS.length];
    updateService.mutate({ id: service.id, status: next }, {
      onSuccess: updated =>
        setServices(prev => prev.map(s => s.id === updated.id ? updated : s)),
    });
  };

  // ── Derived stats ─────────────────────────────────────────────────────
  const criticalCount = services.filter(s => s.status === "critical").length;
  const warningCount  = services.filter(s => s.status === "warning").length;
  const stableCount   = services.filter(s => s.status === "stable").length;
  const totalCount    = services.length;
  const systemHealth  = totalCount > 0 ? Math.round((stableCount / totalCount) * 100) : 0;

  // ── Loading / error screens ───────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono">
      <div className="text-primary animate-pulse flex flex-col items-center gap-4">
        <Activity className="w-12 h-12 animate-spin" />
        <span className="text-xl tracking-widest">INITIALIZING DIAGNOSTICS...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono text-destructive">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-16 h-16 mx-auto" />
        <h2 className="text-2xl">SYSTEM CRITICAL FAILURE</h2>
        <p>Unable to connect to diagnostics kernel.</p>
      </div>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden font-mono selection:bg-primary/30">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border/50 pb-6 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-transparent">
                SYSTEM_RECOVERY_PROTOCOL
              </h1>
            </div>
            <p className="text-muted-foreground tracking-wide text-sm md:text-base">
              DIAGNOSTIC KERNEL V.9.0.2 //{" "}
              <span className="text-primary animate-pulse">ACTIVE</span>
              {manageMode && (
                <span className="ml-3 text-destructive animate-pulse">// MANAGE MODE ENABLED</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">System Integrity</div>
              <div className={cn("text-3xl font-bold tabular-nums",
                systemHealth < 50 ? "text-destructive" : systemHealth < 80 ? "text-accent" : "text-primary"
              )}>
                {systemHealth}%
              </div>
            </div>
            <div className="h-12 w-px bg-border/50 hidden md:block" />
            <div className="text-right hidden md:block">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Active Threads</div>
              <div className="text-3xl font-bold tabular-nums text-foreground">{totalCount}</div>
            </div>
          </div>
        </header>

        {/* ── Action Bar ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 border border-border/40 p-4 rounded-lg backdrop-blur-sm">
          {/* Stats */}
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

          {/* Controls */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
            {/* Manage toggle */}
            <button
              data-testid="button-manage-mode"
              onClick={() => { setManageMode(m => !m); setDeleteTarget(null); }}
              className={cn(
                "px-4 py-2 border text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2",
                manageMode
                  ? "border-destructive/70 bg-destructive/10 text-destructive"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              <Settings className="w-3.5 h-3.5" />
              {manageMode ? "EXIT_MANAGE" : "MANAGE"}
            </button>

            {/* Add service — only in manage mode */}
            <AnimatePresence>
              {manageMode && (
                <motion.button
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  data-testid="button-deploy-service"
                  onClick={() => setModal({ open: true, mode: "create" })}
                  className="px-4 py-2 border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> DEPLOY_SERVICE
                </motion.button>
              )}
            </AnimatePresence>

            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={recovering || resetMutation.isPending}
              className="px-4 py-2 border border-border hover:bg-border/30 text-muted-foreground hover:text-foreground text-xs font-semibold tracking-widest uppercase transition-all disabled:opacity-50"
            >
              {resetMutation.isPending ? "RESETTING..." : "RESET_SIM"}
            </button>

            <button
              data-testid="button-recover"
              onClick={handleRecoverAll}
              disabled={recovering || (criticalCount === 0 && warningCount === 0)}
              className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 hover:border-primary text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
            >
              {recovering ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> RECOVERING...</>
              ) : (
                <><Zap className="w-3.5 h-3.5 group-hover:fill-current" /> INITIATE_REPAIR</>
              )}
            </button>
          </div>
        </div>

        {/* ── Recovery Progress Bar ── */}
        <AnimatePresence>
          {recovering && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card/40 border border-primary/20 p-4 rounded-lg">
                <div className="flex justify-between text-xs uppercase tracking-widest text-primary mb-2">
                  <span>System Scan & Repair Sequence</span>
                  <span>{recoveryProgress}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${recoveryProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Service Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {services.map((service, idx) => {
              const IconComponent = iconMap[service.icon] || Cpu;
              const isDeletePending = deleteTarget === service.id;

              return (
                <CyberCard key={service.id} delay={idx * 0.04} className="flex flex-col h-full relative">

                  {/* ── Manage mode overlay (edit / delete) ── */}
                  <AnimatePresence>
                    {manageMode && !isDeletePending && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-2 right-2 flex gap-1.5 z-20"
                      >
                        <button
                          data-testid={`button-edit-${service.id}`}
                          onClick={() => setModal({ open: true, mode: "edit", service })}
                          className="p-1.5 bg-card border border-border hover:border-primary hover:text-primary text-muted-foreground transition-all"
                          title="Configure"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          data-testid={`button-delete-${service.id}`}
                          onClick={() => setDeleteTarget(service.id)}
                          className="p-1.5 bg-card border border-border hover:border-destructive hover:text-destructive text-muted-foreground transition-all"
                          title="Terminate"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Delete confirmation overlay ── */}
                  <AnimatePresence>
                    {isDeletePending && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 border border-destructive/50"
                      >
                        <Trash2 className="w-8 h-8 text-destructive" />
                        <p className="text-xs uppercase tracking-widest text-center px-4">
                          Terminate <span className="text-destructive">{service.name}</span>?
                        </p>
                        <div className="flex gap-3">
                          <button
                            data-testid={`button-cancel-delete-${service.id}`}
                            onClick={() => setDeleteTarget(null)}
                            className="px-4 py-1.5 border border-border text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> ABORT
                          </button>
                          <button
                            data-testid={`button-confirm-delete-${service.id}`}
                            onClick={() => handleDelete(service.id)}
                            disabled={deleteService.isPending}
                            className="px-4 py-1.5 border border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs uppercase tracking-widest transition-all flex items-center gap-1 disabled:opacity-50"
                          >
                            {deleteService.isPending
                              ? <RefreshCw className="w-3 h-3 animate-spin" />
                              : <><Trash2 className="w-3 h-3" /> CONFIRM</>
                            }
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Card body ── */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "p-2.5 rounded-lg border border-white/5 backdrop-blur-sm shadow-inner transition-colors duration-500",
                      service.status === "stable"   ? "bg-primary/10 text-primary" :
                      service.status === "critical" ? "bg-destructive/10 text-destructive animate-pulse" :
                      service.status === "warning"  ? "bg-accent/10 text-accent" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Status badge — clickable in manage mode to cycle status */}
                    <button
                      data-testid={`badge-status-${service.id}`}
                      onClick={() => manageMode && !recovering && handleStatusCycle(service)}
                      disabled={recovering || updateService.isPending}
                      className={cn(
                        "transition-all",
                        manageMode && "hover:scale-105 hover:brightness-125 cursor-pointer"
                      )}
                      title={manageMode ? "Click to cycle status" : undefined}
                    >
                      <StatusBadge status={service.status} />
                    </button>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-display tracking-wide truncate">
                        {service.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-border inline-block" />
                        ID: {service.id.toString().padStart(4, "0")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-border/30 pt-3">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase">Allocated</span>
                        <span className="text-foreground">{service.size}</span>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-muted-foreground block text-[10px] uppercase">Latency</span>
                        <span className={cn(service.status === "stable" ? "text-primary" : "text-muted-foreground")}>
                          {service.status === "stable" ? "< 1ms"
                            : service.status === "scanning" ? "..."
                            : service.status === "recovering" ? "SYNC"
                            : "TIMEOUT"}
                        </span>
                      </div>
                    </div>

                    {/* Manage mode hint */}
                    {manageMode && (
                      <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest border-t border-border/20 pt-2">
                        Tap badge to cycle status
                      </p>
                    )}
                  </div>

                  {/* Scanning pulse overlay */}
                  {service.status === "scanning" && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5 z-0 pointer-events-none"
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

      {/* ── Service Modal ── */}
      <ServiceModal
        state={modal}
        onClose={() => setModal({ open: false, mode: "create" })}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isPending={createService.isPending || updateService.isPending}
      />
    </div>
  );
}
