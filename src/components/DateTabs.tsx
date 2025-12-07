import { Button } from "@/components/ui/button";
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";

interface DateTabsProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  kidCounts?: Record<string, number>;
}

export function DateTabs({ selectedDate, onDateSelect, kidCounts = {} }: DateTabsProps) {
  const today = new Date();
  
  // Generate 7 days: yesterday, today, and next 5 days
  const dates = [
    subDays(today, 1),
    today,
    addDays(today, 1),
    addDays(today, 2),
    addDays(today, 3),
    addDays(today, 4),
    addDays(today, 5),
  ];

  const getDateLabel = (date: Date) => {
    if (isYesterday(date)) return "Yesterday";
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE");
  };

  const getDateKey = (date: Date) => format(date, "MM-dd");

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-1.5 sm:gap-2 min-w-max px-2 sm:px-4 md:px-0 md:justify-center">
        {dates.map((date) => {
          const dateKey = getDateKey(date);
          const count = kidCounts[dateKey] || 0;
          const isSelected = format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
          
          return (
            <Button
              key={dateKey}
              variant={isSelected ? "tabActive" : "tab"}
              onClick={() => onDateSelect(date)}
              className="flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-2 sm:py-3 px-2.5 sm:px-4 min-w-[60px] sm:min-w-[80px]"
            >
              <span className="text-[10px] sm:text-xs font-medium opacity-80">
                {getDateLabel(date)}
              </span>
              <span className="text-base sm:text-lg font-bold">
                {format(date, "d")}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wide opacity-70">
                {format(date, "MMM")}
              </span>
              {count > 0 && (
                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-primary/10 text-primary"
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}