import { useMutation } from "@tanstack/react-query";
import { api, type GenerateRequest, type ItineraryResult } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGenerateItinerary() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateRequest) => {
      // Simulate network delay for better UX feeling
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch(api.itinerary.generate.path, {
        method: api.itinerary.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const result = await res.json();
      return result as ItineraryResult;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong generating your plan.",
        variant: "destructive",
      });
    },
  });
}
