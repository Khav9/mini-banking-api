import { Clock } from "lucide-react";

const StatsBar = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", // "Monday"
    year: "numeric", // "2025"
    month: "long", // "October"
    day: "numeric", // "4"
  });

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",

  });

  return (
    <div className="min-w-max">
      <div className="flex items-center gap-4 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded px-4 py-2">
        {/* current date */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {time}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {today}
        </span>

        {/* example icon */}
        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default StatsBar;
