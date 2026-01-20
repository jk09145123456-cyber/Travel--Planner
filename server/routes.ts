
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GenerateRequest, ItineraryResult, DayPlan, Activity } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.itinerary.generate.path, async (req, res) => {
    try {
      const input = api.itinerary.generate.input.parse(req.body);
      const itinerary = generateMockItinerary(input);
      res.json(itinerary);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}

function generateMockItinerary(input: GenerateRequest): ItineraryResult {
  const { city, days, tempo } = input;
  const plan: DayPlan[] = [];

  // Tempo configuration
  let activitiesPerDay = 4;
  if (tempo === "느긋") activitiesPerDay = 3;
  if (tempo === "빡빡") activitiesPerDay = 5;

  const activityPool = [
    { type: "명소", list: ["랜드마크 방문", "역사 박물관", "시내 전망대", "유명 광장", "오래된 성당/사원"] },
    { type: "식사", list: ["로컬 맛집 점심", "길거리 음식 체험", "유명 카페 휴식", "전통 시장 투어", "미슐랭 저녁 식사"] },
    { type: "체험", list: ["공원 산책", "쇼핑몰 구경", "자전거 투어", "보트 유람선", "야경 감상"] }
  ];

  const times = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"];

  for (let d = 1; d <= days; d++) {
    const dayActivities: Activity[] = [];
    let timeIdx = 0;

    for (let i = 0; i < activitiesPerDay; i++) {
      const poolIdx = i % 3; // Cycle through types
      const typeGroup = activityPool[poolIdx];
      const randomAct = typeGroup.list[Math.floor(Math.random() * typeGroup.list.length)];
      
      // Pseudo-randomizing location name based on city
      const locationName = `${city} ${String.fromCharCode(65 + i)}구역`;

      dayActivities.push({
        time: times[timeIdx] || "22:00",
        activity: randomAct,
        location: locationName,
        transport: ["도보 10분", "지하철 15분", "택시 5분", "버스 20분"][Math.floor(Math.random() * 4)],
        cost: Math.random() > 0.5 ? `${(Math.floor(Math.random() * 5) + 1) * 10000}원` : undefined
      });

      timeIdx += (tempo === "빡빡" ? 1 : 2); // Increment time
      if (timeIdx >= times.length) timeIdx = times.length - 1;
    }

    plan.push({
      day: d,
      activities: dayActivities
    });
  }

  return {
    city,
    days,
    tempo,
    plan
  };
}
