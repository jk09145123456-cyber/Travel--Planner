import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getSavedItineraries, deleteItinerary, type SavedItinerary } from "@/lib/storage";
import { format } from "date-fns";
import { ArrowLeft, Trash2, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Saved() {
  const [, setLocation] = useLocation();
  const [savedItems, setSavedItems] = useState<SavedItinerary[]>([]);

  useEffect(() => {
    setSavedItems(getSavedItineraries());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this itinerary?")) {
      deleteItinerary(id);
      setSavedItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display font-bold text-xl">Saved Trips</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {savedItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No saved trips yet</h3>
            <p className="text-muted-foreground mb-6">Create your first dream itinerary to see it here.</p>
            <Button onClick={() => setLocation("/")}>Create New Trip</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {savedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setLocation(`/saved/${item.id}`)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDelete(item.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.city}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Created {format(item.savedAt, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
                      {item.days} Days
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
                      {item.tempo} Pace
                    </div>
                    <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
