import { motion } from "framer-motion";
import { MapPin, Clock, Car, Bus, Footprints, DollarSign } from "lucide-react";
import { Activity } from "@shared/schema";

interface TimelineProps {
  activities: Activity[];
}

export function Timeline({ activities }: TimelineProps) {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 sm:space-y-10 my-8">
      {/* Vertical Line */}
      <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />

      {activities.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </div>
  );
}

function TimelineItem({ item, index }: { item: Activity; index: number }) {
  const getTransportIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("bus")) return <Bus className="w-3 h-3" />;
    if (t.includes("walk") || t.includes("도보")) return <Footprints className="w-3 h-3" />;
    return <Car className="w-3 h-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 group"
    >
      {/* Dot */}
      <div className="absolute -left-[29px] sm:-left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors duration-300" />

      {/* Time */}
      <div className="flex items-center gap-2 min-w-[80px] pt-1">
        <Clock className="w-4 h-4 text-primary/70" />
        <span className="text-sm font-semibold text-primary font-mono">{item.time}</span>
      </div>

      {/* Card Content */}
      <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-border/40 hover:shadow-md hover:border-primary/20 transition-all duration-300">
        <h4 className="text-lg font-bold text-foreground mb-1">{item.activity}</h4>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{item.location}</span>
          </div>
          
          {item.cost && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-green-600" />
              <span>{item.cost}</span>
            </div>
          )}
        </div>

        {/* Transport Chip */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium border border-secondary">
          {getTransportIcon(item.transport)}
          <span>{item.transport}</span>
        </div>
      </div>
    </motion.div>
  );
}
