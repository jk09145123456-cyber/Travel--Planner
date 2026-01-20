import { useState } from "react";
import { ItineraryResult } from "@shared/schema";
import { DayTabs } from "@/components/ui/day-tabs";
import { Timeline } from "@/components/ui/timeline";
import { Calendar, Map, Activity } from "lucide-react";

interface ItineraryViewProps {
  data: ItineraryResult;
  isSavedMode?: boolean;
}

export function ItineraryView({ data }: ItineraryViewProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const currentPlan = data.plan.find((p) => p.day === currentDay);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Destination</p>
            <p className="font-bold text-foreground">{data.city}</p>
          </div>
        </div>

        <div className="bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Duration</p>
            <p className="font-bold text-foreground">{data.days} Days</p>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white/60 p-4 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pace</p>
            <p className="font-bold text-foreground">{data.tempo}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <DayTabs 
          days={data.days} 
          currentDay={currentDay} 
          onDayChange={setCurrentDay} 
        />
        
        <div className="bg-white/40 rounded-3xl p-4 sm:p-6 border border-white/60 shadow-xl backdrop-blur-md min-h-[400px]">
          {currentPlan ? (
            <Timeline activities={currentPlan.activities} />
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No activities planned for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
