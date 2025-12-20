import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize seed data
  await storage.seedServices();

  app.get(api.services.list.path, async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.post(api.services.reset.path, async (_req, res) => {
    // In a real app this would reset DB state, but for this demo
    // we just re-seed if empty or return current state
    const services = await storage.getServices();
    res.json(services);
  });

  return httpServer;
}
