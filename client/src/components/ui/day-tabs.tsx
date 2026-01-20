import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayTabsProps {
  days: number;
  currentDay: number;
  onDayChange: (day: number) => void;
}

export function DayTabs({ days, currentDay, onDayChange }: DayTabsProps) {
  const dayList = Array.from({ length: days }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="flex space-x-3 px-1 min-w-max">
        {dayList.map((day) => {
          const isActive = currentDay === day;
          return (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={cn(
                "relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-white text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent hover:border-border"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Day {day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
