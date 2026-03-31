import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertSystemServiceSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await storage.seedServices();

  // GET /api/services — list all
  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  // POST /api/services/reset — wipe + re-seed to original defaults
  app.post("/api/services/reset", async (_req, res) => {
    const services = await storage.resetServices();
    res.json(services);
  });

  // POST /api/services/recover — persist all statuses as stable
  app.post("/api/services/recover", async (_req, res) => {
    const services = await storage.recoverAll();
    res.json(services);
  });

  // POST /api/services — create a new service
  app.post("/api/services", async (req, res) => {
    const parsed = insertSystemServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }
    const service = await storage.createService(parsed.data);
    res.status(201).json(service);
  });

  // PATCH /api/services/:id — update a service
  app.patch("/api/services/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const parsed = insertSystemServiceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.message });
    }

    try {
      const service = await storage.updateService(id, parsed.data);
      res.json(service);
    } catch {
      res.status(404).json({ message: `Service ${id} not found` });
    }
  });

  // DELETE /api/services/:id — delete a service
  app.delete("/api/services/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    await storage.deleteService(id);
    res.status(204).send();
  });

  return httpServer;
}
