import { Skeleton } from "../ui/skeleton";
import Card from "../Card/Card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

const SidePanelSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-gray-300">Air Pollution</h1>
        <Tooltip>
          <TooltipTrigger className="cursor-help pointer-events-auto">
            <Info className="size-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-xs">
              US EPA Air Quality Index. Values range from 0 to 500. Where 0-50 =
              Good, 51-100 = Moderate, 101-150 = Unhealthy for Sensitive Groups,
              151-200 = Unhealthy, 201-300 = Very Unhealthy, 301-500 =
              Hazardous.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-4 py-2">
        <Skeleton className="min-w-18 h-16 rounded-xl" />
        <Skeleton className="h-7 w-32 rounded-md" />
      </div>

      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          animate={false}
          childrenClassName="flex flex-col gap-1"
          className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <Skeleton className="w-12 h-6" />
              <Info className="size-3.5 text-muted-foreground opacity-30" />
            </div>
            <Skeleton className="w-10 h-8" />
          </div>

          <div className="flex justify-start w-full my-1">
            <Skeleton className="w-full h-7 rounded-full" />
          </div>

          <Skeleton className="w-full h-2 mt-2 mb-1" />

          <div className="flex justify-between mt-1">
            <Skeleton className="w-4 h-3" />
            <Skeleton className="w-8 h-3" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SidePanelSkeleton;
