import { formatDistanceToNow, format } from 'date-fns';

export default function Timestamp({ prefix, date }: { prefix?: string, date: Date }) {

  const color = 'text-orange-400';

  if (!date) return null;

  // "2 days ago" or "less than a minute ago"
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = format(date, "eeee, MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {
        <div className="relative group flex items-center gap-1.5">
          <span className="decoration-dotted decoration-neutral-600 underline-offset-2 text-sm text-neutral-300 capitalize-first">
            {prefix} {relativeTime}
          </span>
          
          {/* Tooltip */}
          <div
            role="tooltip"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-30"
          >
            <div className="relative whitespace-nowrap rounded-md bg-[#15151c] border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 shadow-lg">
              <span className={color}>{prefix}</span> {absoluteTime}
              <span
                aria-hidden="true"
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#15151c] border-l border-t border-white/10"
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
}