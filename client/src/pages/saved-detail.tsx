import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { getSavedItinerary, type SavedItinerary } from "@/lib/storage";
import { ItineraryView } from "@/components/itinerary-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SavedDetail() {
  const [, params] = useRoute("/saved/:id");
  const [, setLocation] = useLocation();
  const [itinerary, setItinerary] = useState<SavedItinerary | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      const found = getSavedItinerary(params.id);
      if (found) {
        setItinerary(found);
      } else {
        setLocation("/saved");
      }
    }
  }, [params, setLocation]);

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50/20 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/saved")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Saved Trips
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Link copied!", description: "Share this trip with friends." });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-10">
        <div className="mb-10 text-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saved Plan</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-2">
            {itinerary.city}
          </h1>
        </div>

        <ItineraryView data={itinerary} isSavedMode />
      </main>
    </div>
  );
}
