import { formatDistanceToNow, format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Build } from '../data/build';

export default function BuildTimestamps({ build }: { build: Build}) {
  // Define configuration for each timestamp row
  const timestamps = [
    {
      label: 'Submitted',
      date: build.createdAt,
      color: 'text-orange-400',
    },
    {
      label: 'Last updated',
      date: build.lastUpdated,
      color: 'text-orange-400', // Keeps your exact color choice
    },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {timestamps.map((item, index) => {
        if (!item.date) return null;

        // "2 days ago" or "less than a minute ago"
        const relativeTime = formatDistanceToNow(item.date, { addSuffix: true });
        const absoluteTime = format(item.date, "eeee, MMMM d, yyyy 'at' h:mm a");

        return (
          <div key={index} className="relative group flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-neutral-500" />
            <span className="cursor-help underline decoration-dotted decoration-neutral-600 underline-offset-2 text-sm text-neutral-300 capitalize-first">
              {item.label} {relativeTime}
            </span>
            
            {/* Tooltip */}
            <div
              role="tooltip"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-30"
            >
              <div className="relative whitespace-nowrap rounded-md bg-[#15151c] border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 shadow-lg">
                <span className={item.color}>{item.label}</span> {absoluteTime}
                <span
                  aria-hidden="true"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#15151c] border-l border-t border-white/10"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}