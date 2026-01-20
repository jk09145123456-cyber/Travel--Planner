import { ItineraryResult } from "@shared/schema";

const STORAGE_KEY = "saved_itineraries";

export interface SavedItinerary extends ItineraryResult {
  id: string;
  savedAt: number;
}

export function saveItinerary(itinerary: ItineraryResult): SavedItinerary {
  const saved: SavedItinerary = {
    ...itinerary,
    id: crypto.randomUUID(),
    savedAt: Date.now(),
  };

  const current = getSavedItineraries();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([saved, ...current]));
  return saved;
}

export function getSavedItineraries(): SavedItinerary[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse saved itineraries", e);
    return [];
  }
}

export function getSavedItinerary(id: string): SavedItinerary | undefined {
  const all = getSavedItineraries();
  return all.find((item) => item.id === id);
}

export function deleteItinerary(id: string) {
  const current = getSavedItineraries();
  const filtered = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
