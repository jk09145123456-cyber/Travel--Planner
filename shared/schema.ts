import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  days: integer("days").notNull(),
  tempo: text("tempo").notNull(),
  budget: integer("budget").notNull().default(0),
  plan: jsonb("plan").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({ id: true, createdAt: true });

export const generateItinerarySchema = z.object({
  city: z.string().min(1, "도시 이름을 입력해주세요"),
  days: z.coerce.number().min(1, "최소 1일").max(14, "최대 14일"),
  tempo: z.string(), // "느긋", "보통", "빡빡"
  budget: z.coerce.number().min(0, "예산은 0원 이상이어야 합니다"),
});

export type GenerateRequest = z.infer<typeof generateItinerarySchema>;

export interface Activity {
  time: string;
  activity: string;
  location: string;
  transport: string;
  cost?: number; // Changed to number for easier calculation
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface ItineraryResult {
  id?: string;
  timestamp?: number;
  city: string;
  days: number;
  tempo: string;
  budget: number;
  plan: DayPlan[];
}
