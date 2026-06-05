import Card from "../Card/Card";
import { Skeleton } from "../ui/skeleton";

const AddtionalInfoSkeleton = () => {
  return (
    <Card
      animate={false}
      title="Hourly Forecast (48 hours)"
      className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
      childrenClassName="flex gap-8 overflow-x-scroll pb-3">
      {Array.from({ length: 48 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 items-center p-2">
          <Skeleton className="w-10 h-6" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-9 h-6" />
        </div>
      ))}
    </Card>
  );
};

export default AddtionalInfoSkeleton;
