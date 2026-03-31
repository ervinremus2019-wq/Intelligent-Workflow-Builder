import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SystemService, InsertSystemService } from "@shared/schema";

const SERVICES_KEY = ["/api/services"];

export function useServices() {
  return useQuery<SystemService[]>({
    queryKey: SERVICES_KEY,
    queryFn: async () => {
      const res = await fetch("/api/services", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch system services");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSystemService) => {
      const res = await apiRequest("POST", "/api/services", data);
      return res.json() as Promise<SystemService>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<InsertSystemService> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/services/${id}`, data);
      return res.json() as Promise<SystemService>;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });
}

export function useResetServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/services/reset");
      return res.json() as Promise<SystemService[]>;
    },
    onSuccess: (data) => queryClient.setQueryData(SERVICES_KEY, data),
  });
}

export function useRecoverAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/services/recover");
      return res.json() as Promise<SystemService[]>;
    },
    onSuccess: (data) => queryClient.setQueryData(SERVICES_KEY, data),
  });
}
