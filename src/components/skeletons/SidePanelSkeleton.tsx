import React from "react";
import { Skeleton } from "../ui/skeleton";
import Card from "../Card/Card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

type Props = {};

const SidePanelSkeleton = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-sm font-semibold">Air Pollution</h1>
      <Skeleton className="w-8 h-10" />
      <div className="flex gap-2">
        <h3 className="text-sm font-semibold">AQI</h3>
        <Tooltip>
          <TooltipTrigger className="p-1 -m-1 cursor-help pointer-events-auto">
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent className="">
            <p className="w-xs">
              Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good,
              2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          animate={false}
          childrenClassName="flex flex-col gap-3"
          className="gap-0! hover:scale-105 transition-transform duration-300">
          <div className="flex justify-between">
            <Skeleton className="w-14 h-5" />
            <Skeleton className="w-9 h-5" />
          </div>
          <Skeleton className="w-63 h-2" />
          <div className="flex justify-between text-xs">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-6 h-4" />
          </div>
          <div className="flex justify-between">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-10 h-6" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SidePanelSkeleton;
