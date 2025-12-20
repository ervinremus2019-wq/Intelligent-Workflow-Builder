import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// GET /api/services
export function useServices() {
  return useQuery({
    queryKey: [api.services.list.path],
    queryFn: async () => {
      const res = await fetch(api.services.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch system services");
      return api.services.list.responses[200].parse(await res.json());
    },
    // Don't refetch automatically during the simulation animation
    refetchOnWindowFocus: false,
  });
}

// POST /api/services/reset
export function useResetServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.services.reset.path, {
        method: api.services.reset.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reset system services");
      return api.services.reset.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Optimistically update the cache with the reset data
      queryClient.setQueryData([api.services.list.path], data);
    },
  });
}
