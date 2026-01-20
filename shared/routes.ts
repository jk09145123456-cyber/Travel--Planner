
import { z } from 'zod';
import { generateItinerarySchema } from './schema';

export const api = {
  itinerary: {
    generate: {
      method: 'POST' as const,
      path: '/api/itinerary/generate',
      input: generateItinerarySchema,
      responses: {
        200: z.custom<any>(), // Returns ItineraryResult
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
