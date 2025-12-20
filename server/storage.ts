import { db } from "./db";
import { systemServices, type InsertSystemService, type SystemService } from "@shared/schema";

export interface IStorage {
  getServices(): Promise<SystemService[]>;
  seedServices(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getServices(): Promise<SystemService[]> {
    return await db.select().from(systemServices).orderBy(systemServices.id);
  }

  async seedServices(): Promise<void> {
    const count = await db.select().from(systemServices);
    if (count.length === 0) {
      const initialServices: InsertSystemService[] = [
        { name: "Documents & Sync", size: "9.82 MB", status: "warning", icon: "Cloud" },
        { name: "Corporate Accounts", size: "8.79 MB", status: "critical", icon: "Lock" },
        { name: "Mobile Services", size: "7.45 MB", status: "stable", icon: "Smartphone" },
        { name: "Backup", size: "7.15 MB", status: "warning", icon: "Database" },
        { name: "Bluetooth Services", size: "7.12 MB", status: "stable", icon: "Bluetooth" },
        { name: "AI/ML Services", size: "4.94 MB", status: "critical", icon: "Activity" },
        { name: "iTunes", size: "3.85 MB", status: "stable", icon: "Music" },
        { name: "Power Services", size: "2.94 MB", status: "stable", icon: "Zap" },
        { name: "Accessibility", size: "1.74 MB", status: "stable", icon: "Eye" },
        { name: "Remote", size: "1.70 MB", status: "stable", icon: "Wifi" },
        { name: "Focus", size: "1.60 MB", status: "stable", icon: "Eye" },
        { name: "Voicemail", size: "1.33 MB", status: "warning", icon: "Server" },
        { name: "Screen Time", size: "1.31 MB", status: "stable", icon: "Activity" },
        { name: "Ambient Music", size: "376 KB", status: "stable", icon: "Music" },
        { name: "HomeCaptiveViewService", size: "348 KB", status: "stable", icon: "Home" },
        { name: "Setup", size: "296 KB", status: "stable", icon: "CheckCircle2" },
        { name: "Family", size: "135 KB", status: "stable", icon: "Users" },
        { name: "Home Screen", size: "116 KB", status: "stable", icon: "LayoutGrid" },
      ];
      
      await db.insert(systemServices).values(initialServices);
    }
  }
}

export const storage = new DatabaseStorage();
